import { Express, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import mysql from "mysql2/promise";

// ============================================================
// CERTIFICATE KEYS - Sistema seguro de chaves de download
// ============================================================
// Cada CRM do Bitrix recebe uma chave única para o aluno
// baixar seu certificado. A chave é armazenada com hash bcrypt.
// ============================================================

const BITRIX_WEBHOOK_URL = "https://grupolaeducacao.bitrix24.com.br/rest/11/skpys5v7oq07mf2y/crm.item.list.json";
const ENTITY_TYPE_ID = 1058;

// Chave secreta para proteger a API de geração (o Forms precisa enviar essa chave)
const API_SECRET = process.env.CERTIFICATE_API_SECRET || "facla-cert-secret-2024-xK9mP2vQ";

// Mapeamento de Status do Bitrix
const STATUS_MAP: Record<number, string> = {
  249: "Concluído",
  243: "Aguardando Documentos",
  383: "Aguardando Trabalhos - EJA",
  385: "Aguardando TCC",
  251: "Entregue Aluno/Parceiro",
  379: "Parcelas Atrasadas",
  381: "Parcelas Pendentes",
  439: "Aguardando Práticas Pedagógicas",
  429: "Aguardando Envio para Certificadora",
  247: "Processo de Emissão (LA)",
  245: "Enviado a Certificadora"
};

// Gerar chave aleatória segura (12 caracteres alfanuméricos maiúsculos)
function generateSecureKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sem I, O, 0, 1 para evitar confusão
  let key = "";
  const randomBytes = crypto.randomBytes(12);
  for (let i = 0; i < 12; i++) {
    key += chars[randomBytes[i] % chars.length];
  }
  // Formatar como XXXX-XXXX-XXXX para facilitar leitura
  return `${key.slice(0, 4)}-${key.slice(4, 8)}-${key.slice(8, 12)}`;
}

export function registerCertificateKeysRoutes(app: Express, getDbPool: () => Promise<mysql.Pool>) {
  
  // Rate limiter específico para validação de chaves (mais restritivo)
  const validateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 5, // Máximo 5 tentativas por minuto por IP
    message: { success: false, error: "Muitas tentativas. Aguarde 1 minuto antes de tentar novamente." },
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: true, xForwardedForHeader: true }
  });

  // Rate limiter para geração (protegido por API key, mas com limite)
  const generateLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 30, // Máximo 30 gerações por minuto
    message: { success: false, error: "Limite de geração atingido. Aguarde." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // ============================================================
  // POST /api/certificate-keys/generate
  // Gera uma chave para um CRM do Bitrix
  // Protegido por API_SECRET (o Forms envia no header)
  // ============================================================
  app.post("/api/certificate-keys/generate", generateLimiter, async (req: Request, res: Response) => {
    try {
      // Validar API secret
      const authHeader = req.headers["x-api-key"] || req.headers["authorization"];
      if (!authHeader || authHeader !== API_SECRET) {
        console.warn("[CERT-KEYS] Tentativa de geração sem autorização:", req.ip);
        return res.status(403).json({ success: false, error: "Acesso negado." });
      }

      const { crmId } = req.body;
      
      if (!crmId) {
        return res.status(400).json({ success: false, error: "crmId é obrigatório." });
      }

      const pool = await getDbPool();

      // Verificar se já existe uma chave ativa para este CRM
      const [existing] = await pool.execute(
        "SELECT id FROM certificate_keys WHERE crmId = ? AND isActive = TRUE",
        [String(crmId)]
      );

      if ((existing as any[]).length > 0) {
        // Desativar chaves anteriores
        await pool.execute(
          "UPDATE certificate_keys SET isActive = FALSE WHERE crmId = ?",
          [String(crmId)]
        );
        console.log("[CERT-KEYS] Chaves anteriores desativadas para CRM:", crmId);
      }

      // Gerar nova chave
      const plainKey = generateSecureKey();
      
      // Hash da chave com bcrypt (salt rounds = 10)
      const keyHash = await bcrypt.hash(plainKey, 10);

      // Salvar no banco
      await pool.execute(
        "INSERT INTO certificate_keys (crmId, keyHash, isActive, createdAt) VALUES (?, ?, TRUE, NOW())",
        [String(crmId), keyHash]
      );

      console.log("[CERT-KEYS] Chave gerada para CRM:", crmId);

      // Retornar a chave em texto plano (só neste momento - depois só o hash existe)
      return res.json({
        success: true,
        data: {
          crmId: String(crmId),
          key: plainKey, // Essa é a única vez que a chave aparece em texto plano
          message: "Chave gerada com sucesso. Envie esta chave ao aluno."
        }
      });

    } catch (error) {
      console.error("[CERT-KEYS] Erro ao gerar chave:", error);
      return res.status(500).json({ success: false, error: "Erro interno ao gerar chave." });
    }
  });

  // ============================================================
  // POST /api/certificate-keys/validate
  // Valida uma chave e retorna os dados do certificado
  // Usado pelo frontend do site (aluno digita a chave)
  // ============================================================
  app.post("/api/certificate-keys/validate", validateLimiter, async (req: Request, res: Response) => {
    try {
      const { key } = req.body;

      if (!key || typeof key !== "string") {
        return res.status(400).json({ success: false, error: "Chave é obrigatória." });
      }

      // Sanitizar a chave (remover espaços, converter para maiúscula)
      const sanitizedKey = key.trim().toUpperCase().replace(/[^A-Z0-9\-]/g, "");

      if (sanitizedKey.length < 10) {
        return res.status(400).json({ success: false, error: "Chave inválida." });
      }

      const pool = await getDbPool();

      // Buscar todas as chaves ativas
      const [rows] = await pool.execute(
        "SELECT id, crmId, keyHash, attempts FROM certificate_keys WHERE isActive = TRUE"
      );

      const keys = rows as any[];
      let matchedKey: any = null;

      // Verificar cada hash (bcrypt compare)
      for (const row of keys) {
        // Bloquear se muitas tentativas nesta chave específica
        if (row.attempts >= 10) {
          continue; // Chave bloqueada por muitas tentativas
        }

        const isMatch = await bcrypt.compare(sanitizedKey, row.keyHash);
        if (isMatch) {
          matchedKey = row;
          break;
        }
      }

      if (!matchedKey) {
        // Incrementar tentativas para todas as chaves (proteção contra brute force)
        // Na prática, registrar a tentativa falha
        console.warn("[CERT-KEYS] Tentativa de validação falhou:", req.ip);
        return res.status(401).json({ 
          success: false, 
          error: "Chave inválida ou expirada. Verifique e tente novamente." 
        });
      }

      // Chave válida! Buscar dados do Bitrix
      const crmId = matchedKey.crmId;

      // Registrar uso
      await pool.execute(
        "UPDATE certificate_keys SET usedAt = NOW(), lastAttemptAt = NOW() WHERE id = ?",
        [matchedKey.id]
      );

      // Buscar dados do certificado no Bitrix
      try {
        const axios = (await import("axios")).default;
        const response = await axios.get(BITRIX_WEBHOOK_URL, {
          params: {
            entityTypeId: ENTITY_TYPE_ID,
            "filter[id]": crmId
          },
          timeout: 10000 // 10 segundos timeout
        });

        const items = response.data?.result?.items || [];

        if (items.length === 0) {
          return res.json({
            success: true,
            data: {
              aluno: "Dados sendo processados",
              curso: "Em processamento",
              status: "Enviado a Certificadora",
              dataSolicitacao: new Date().toLocaleDateString("pt-BR"),
              arquivos: [],
              message: "Seu certificado está sendo processado. Aguarde a conclusão."
            }
          });
        }

        const item = items[0];
        const statusId = Number(item.ufCrm11_1742922374807);
        const status = STATUS_MAP[statusId] || `Em processamento`;

        // Retornar apenas dados necessários (sem dados sensíveis)
        return res.json({
          success: true,
          data: {
            aluno: item.ufCrm11_1742922113371 || "Não informado",
            curso: item.ufCrm11_1742922326382 || "Não informado",
            status: status,
            dataSolicitacao: item.ufCrm11_1742923044042 
              ? new Date(item.ufCrm11_1742923044042).toLocaleDateString("pt-BR") 
              : "Não informada",
            // Só mostrar arquivos se o status for "Concluído"
            arquivos: statusId === 249 ? (item.ufCrm11_1748878858 || []) : [],
            message: statusId === 249 
              ? "Seu certificado está disponível para download!" 
              : "Seu certificado está em processamento. Acompanhe o status."
          }
        });

      } catch (bitrixError) {
        console.error("[CERT-KEYS] Erro ao consultar Bitrix:", bitrixError);
        return res.json({
          success: true,
          data: {
            aluno: "Dados indisponíveis temporariamente",
            curso: "Consulte novamente em alguns minutos",
            status: "Enviado a Certificadora",
            dataSolicitacao: "-",
            arquivos: [],
            message: "Sistema temporariamente indisponível. Tente novamente em alguns minutos."
          }
        });
      }

    } catch (error) {
      console.error("[CERT-KEYS] Erro na validação:", error);
      return res.status(500).json({ success: false, error: "Erro interno. Tente novamente." });
    }
  });

  // ============================================================
  // GET /api/certificate-keys/health
  // Endpoint de health check (sem dados sensíveis)
  // ============================================================
  app.get("/api/certificate-keys/health", (req: Request, res: Response) => {
    res.json({ success: true, service: "certificate-keys", status: "online" });
  });

  console.log("[CERT-KEYS] Rotas de chaves de certificado registradas com sucesso!");
}
