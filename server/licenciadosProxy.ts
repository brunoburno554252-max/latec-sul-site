import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

// Cache em memória com TTL de 10 minutos
interface CacheEntry {
  data: any[];
  timestamp: number;
}

let cache: CacheEntry | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutos

// Rate limiting por IP
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 10; // máximo 10 requisições
const RATE_LIMIT_WINDOW = 60 * 1000; // por minuto

// Logs de auditoria
interface AuditLog {
  timestamp: Date;
  ip: string;
  term: string;
  resultsCount: number;
}

const auditLogs: AuditLog[] = [];

// Função para buscar dados da API externa com cache
async function fetchLicenciados(): Promise<any[]> {
  const now = Date.now();
  
  // Verificar cache
  if (cache && (now - cache.timestamp) < CACHE_TTL) {
    console.log("[Cache] Retornando dados do cache");
    return cache.data;
  }
  
  try {
    console.log("[API] Buscando dados da API externa...");
    const apiUrl = process.env.LICENCIADOS_API_URL;
    if (!apiUrl) {
      throw new Error("LICENCIADOS_API_URL não configurada");
    }
    const response = await fetch(apiUrl);
    const result = await response.json();
    
    if (result.success && Array.isArray(result.data)) {
      // Atualizar cache
      cache = {
        data: result.data,
        timestamp: now
      };
      console.log(`[Cache] Cache atualizado com ${result.data.length} licenciados`);
      return result.data;
    }
    
    throw new Error("Formato de resposta inválido");
  } catch (error) {
    console.error("[Erro] Falha ao buscar licenciados:", error);
    // Se houver cache expirado, usar ele em caso de erro
    if (cache) {
      console.log("[Cache] Usando cache expirado devido a erro na API");
      return cache.data;
    }
    throw new Error("Falha ao buscar licenciados da API externa");
  }
}

// Função para verificar rate limit
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  
  if (!entry || now > entry.resetTime) {
    // Nova janela de tempo
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }
  
  if (entry.count >= RATE_LIMIT_MAX) {
    console.log(`[Rate Limit] IP ${ip} excedeu o limite de ${RATE_LIMIT_MAX} requisições por minuto`);
    return false;
  }
  
  entry.count++;
  return true;
}

// Função para mascarar CPF/CNPJ - mostra 4 primeiros dígitos usando cnpj_cpf_busca
function maskCpfCnpj(cnpjCpfBusca: string, cnpjCpfOriginal: string): string {
  // Usar cnpj_cpf_busca (números completos) para criar máscara controlada
  const numbers = (cnpjCpfBusca || "").replace(/[^\d]/g, "");
  
  if (!numbers || numbers.length < 4) {
    // Fallback: se não tem busca, retornar o original da API (já mascarado)
    return cnpjCpfOriginal || "\u2014";
  }
  
  if (numbers.length === 11) {
    // CPF: mostrar 4 primeiros dígitos -> 123.4**.**-**
    return numbers.substring(0, 3) + "." + numbers.substring(3, 4) + "**.**-**";
  } else if (numbers.length === 14) {
    // CNPJ: mostrar 4 primeiros dígitos -> 12.34*.***/****-**
    return numbers.substring(0, 2) + "." + numbers.substring(2, 4) + "*.***/****-**";
  }
  
  // Outro formato: mostrar 4 primeiros dígitos
  return numbers.substring(0, 4) + "*".repeat(Math.max(0, numbers.length - 4));
}

// Função para filtrar licenciados - BUSCA PRECISA
function searchLicenciados(licenciados: any[], searchTerm: string): any[] {
  const term = searchTerm.toLowerCase().trim();
  const termNumerico = term.replace(/[^0-9]/g, "");
  
  // Detectar se parece CNPJ/CPF (contém pontos, barras, hifens ou é numérico com 3+ dígitos)
  const looksLikeCnpjCpf = /^[\d.\-\/]+$/.test(term) && termNumerico.length >= 3;
  
  // Se o termo é apenas números ou parece CNPJ/CPF
  const isNumericOnly = /^\d+$/.test(term);
  
  if (looksLikeCnpjCpf || isNumericOnly) {
    // Busca numérica - priorizar ID exato
    if (isNumericOnly) {
      const exactIdMatch = licenciados.filter((lic) => lic.id.toString() === term);
      if (exactIdMatch.length > 0) {
        return exactIdMatch;
      }
    }
    
    // Buscar por CNPJ/CPF que contenha os números
    const cnpjResults = licenciados.filter((lic) => {
      const cnpjCpfBusca = (lic.cnpj_cpf_busca || lic.cnpj_cpf || "").replace(/[^0-9]/g, "");
      return cnpjCpfBusca.startsWith(termNumerico) || cnpjCpfBusca.includes(termNumerico);
    });
    
    if (cnpjResults.length > 0) {
      return cnpjResults;
    }
    
    // Se não encontrou por CNPJ, tentar por ID parcial
    if (isNumericOnly) {
      return licenciados.filter((lic) => lic.id.toString().startsWith(term));
    }
    
    return [];
  }
  
  // Busca por texto - nome
  return licenciados.filter((lic) => {
    const nome = (lic.nome || "").toLowerCase();
    
    // Busca por nome
    const nomeWords = nome.split(/\s+/);
    const termWords = term.split(/\s+/);
    
    // Verificar se TODAS as palavras do termo estão presentes no nome
    const allTermsInName = termWords.every((tw: string) => 
      nomeWords.some((nw: string) => nw.startsWith(tw) || nw === tw)
    );
    
    if (allTermsInName) return true;
    
    return false;
  });
}

export const licenciadosProxyRouter = router({
  search: publicProcedure
    .input(
      z.object({
        term: z.string()
          .min(3, "O termo de busca deve ter no m\u00ednimo 3 caracteres")
          .max(100, "O termo de busca deve ter no m\u00e1ximo 100 caracteres")
      })
    )
    .query(async ({ input, ctx }) => {
      // Obter IP do cliente
      const ip = ctx.req?.headers["x-forwarded-for"] || 
                 ctx.req?.headers["x-real-ip"] || 
                 ctx.req?.socket?.remoteAddress || 
                 "unknown";
      
      const clientIp = Array.isArray(ip) ? ip[0] : ip.toString();
      
      // Verificar rate limit
      if (!checkRateLimit(clientIp)) {
        throw new Error("Muitas requisi\u00e7\u00f5es. Por favor, aguarde um momento e tente novamente.");
      }
      
      try {
        // Buscar todos os licenciados (com cache)
        const allLicenciados = await fetchLicenciados();
        
        // Filtrar resultados no backend
        const filteredResults = searchLicenciados(allLicenciados, input.term);
        
        // Mascarar dados sens\u00edveis antes de retornar
        const safeResults = filteredResults.map((lic) => ({
          id: lic.id,
          nome: lic.nome,
          status: lic.status,
          cnpj_cpf: maskCpfCnpj(lic.cnpj_cpf_busca || "", lic.cnpj_cpf || ""),
          cidade: lic.cidade || null,
          estado: lic.estado || null,
        }));
        
        // Log de auditoria
        const log: AuditLog = {
          timestamp: new Date(),
          ip: clientIp,
          term: input.term,
          resultsCount: safeResults.length
        };
        auditLogs.push(log);
        
        // Manter apenas \u00faltimos 1000 logs
        if (auditLogs.length > 1000) {
          auditLogs.shift();
        }
        
        console.log(`[Auditoria] IP: ${clientIp} | Termo: "${input.term}" | Resultados: ${safeResults.length}`);
        
        return {
          success: true,
          data: safeResults,
          count: safeResults.length
        };
      } catch (error: any) {
        console.error("[Erro] Falha na busca:", error);
        throw new Error(error.message || "Erro ao buscar licenciados");
      }
    }),
});
