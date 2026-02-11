import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { adminSubdomainMiddleware } from "../adminSubdomainMiddleware";
import mysql from "mysql2/promise";
import { registerCertificateKeysRoutes } from "../certificateKeysRouter";

// Configuração do banco de dados MySQL - lida em RUNTIME
function getDbConfig() {
  return {
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USER || "faculdade_user",
    password: process.env.DATABASE_PASSWORD || "Faculdade2024!",
    database: process.env.DATABASE_NAME || "faculdade_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

// Pool de conexões MySQL (criado sob demanda)
let dbPool: mysql.Pool | null = null;

export async function getDbPool(): Promise<mysql.Pool> {
  if (!dbPool) {
    const config = getDbConfig();
    console.log("[DB] Criando pool de conexões MySQL...");
    console.log("[DB] Host:", config.host, "User:", config.user, "Database:", config.database);
    dbPool = mysql.createPool(config);
  }
  return dbPool;
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  app.set("trust proxy", 1);
  const server = createServer(app);
  
  // Security headers with Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );
  
  // Rate limiting for API endpoints
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Muitas requisições deste IP, por favor tente novamente mais tarde.",
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  // Apply rate limiting to API routes
  app.use("/api/", apiLimiter);
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  
  // Admin subdomain middleware
  app.use(adminSubdomainMiddleware);
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // Endpoint simples para salvar coordenadas do ecossistema
  app.post("/api/ecosystem/save-coordinates", express.json(), async (req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");
      
      const data = req.body;
      const filePath = path.join(process.cwd(), "client/src/data/organograma-cards-final.json");
      
      console.log("[API] Salvando coordenadas em:", filePath);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
      
      res.json({ success: true, message: "Coordenadas salvas com sucesso!" });
    } catch (error) {
      console.error("[API] Erro ao salvar:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });
  
  // ============================================================
  // ENDPOINT DE UPLOAD - SALVA EM /var/www/uploads/ (PERMANENTE)
  // ============================================================
  app.post("/api/upload", express.json({ limit: "50mb" }), async (req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");
      
      const { base64, filename, contentType } = req.body;
      if (!base64) {
        return res.status(400).json({ success: false, error: "No base64 data provided" });
      }

      const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      
      // IMPORTANTE: Salvar em /var/www/uploads/ (pasta permanente fora do projeto)
      const uploadDir = "/var/www/uploads";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const timestamp = Date.now();
      const safeFilename = `${timestamp}-${filename.replace(/[^a-z0-9.]/gi, "_").toLowerCase()}`;
      const filePath = path.join(uploadDir, safeFilename);
      
      fs.writeFileSync(filePath, buffer);
      
      // URL servida pelo Nginx diretamente
      const url = `/uploads/${safeFilename}`;
      console.log("[API] Imagem salva PERMANENTEMENTE em:", filePath);
      console.log("[API] URL pública:", url);
      
      res.json({ success: true, url });
    } catch (error) {
      console.error("[API] Erro no upload:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // ============================================================
  // GET /api/ecosystem/institutions - BUSCAR DO MYSQL
  // ============================================================
  app.get("/api/ecosystem/institutions", async (req, res) => {
    try {
      const pool = await getDbPool();
      const [rows] = await pool.execute("SELECT * FROM ecosystem_institutions ORDER BY name");
      
      // Converter para formato esperado pelo frontend (objeto com id como chave)
      const institutions: Record<string, any> = {};
      for (const row of rows as any[]) {
        institutions[row.id] = {
          nome: row.name || "",
          tipo: row.tipo || "",
          categoria: row.categoria || "",
          descricao: row.description || "",
          fotos: row.logo_url ? [row.logo_url] : [],
          banner: row.banner_url || "",
          website: row.website || "",
          missao: row.missao || "",
          visao: row.visao || "",
          valores: row.valores ? JSON.parse(row.valores) : []
        };
      }
      
      console.log("[API] Instituições carregadas do MySQL:", Object.keys(institutions).length);
      res.json(institutions);
    } catch (error) {
      console.error("[API] Erro ao buscar instituições:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // ============================================================
  // POST /api/ecosystem/save-institution - SALVAR NO MYSQL
  // ============================================================
  app.post("/api/ecosystem/save-institution", express.json(), async (req, res) => {
    try {
      const { institutionId, data } = req.body;
      
      if (!institutionId || !data) {
        return res.status(400).json({ success: false, error: "institutionId e data são obrigatórios" });
      }
      
      const pool = await getDbPool();
      
      // Extrair dados do formato do frontend
      const name = data.nome || "";
      const description = data.descricao || "";
      const logo_url = data.fotos && data.fotos[0] ? data.fotos[0] : "";
      const banner_url = data.banner || "";
      const tipo = data.tipo || "";
      const categoria = data.categoria || "";
      const website = data.website || "";
      const missao = data.missao || "";
      const visao = data.visao || "";
      const valores = data.valores ? JSON.stringify(data.valores) : "[]";
      
      // Verificar se a instituição já existe
      const [existing] = await pool.execute(
        "SELECT id FROM ecosystem_institutions WHERE id = ?",
        [institutionId]
      );
      
      if ((existing as any[]).length > 0) {
        // UPDATE
        await pool.execute(
          `UPDATE ecosystem_institutions SET 
            name = ?, description = ?, logo_url = ?, banner_url = ?,
            tipo = ?, categoria = ?, website = ?, missao = ?, visao = ?, valores = ?,
            updated_at = NOW()
          WHERE id = ?`,
          [name, description, logo_url, banner_url, tipo, categoria, website, missao, visao, valores, institutionId]
        );
        console.log("[API] Instituição ATUALIZADA no MySQL:", institutionId);
      } else {
        // INSERT
        await pool.execute(
          `INSERT INTO ecosystem_institutions 
            (id, name, description, logo_url, banner_url, tipo, categoria, website, missao, visao, valores) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [institutionId, name, description, logo_url, banner_url, tipo, categoria, website, missao, visao, valores]
        );
        console.log("[API] Instituição INSERIDA no MySQL:", institutionId);
      }
      
      res.json({ success: true, message: "Instituição salva com sucesso no banco de dados!" });
    } catch (error) {
      console.error("[API] Erro ao salvar instituição no MySQL:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });
  
  // ============================================================
  // CERTIFICATE KEYS - Sistema seguro de chaves de download
  // ============================================================
  registerCertificateKeysRoutes(app, getDbPool);

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // Servir pasta de uploads (fallback - Nginx deve servir em produção)
  const path = await import("path");
  app.use("/uploads", express.static("/var/www/uploads"));

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    console.log(`[DB] Configuração: Host=${process.env.DATABASE_HOST}, User=${process.env.DATABASE_USER}, DB=${process.env.DATABASE_NAME}`);
  });
}

startServer().catch(console.error);
