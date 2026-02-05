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
  
  // Endpoint para salvar instituições do ecossistema
  app.post("/api/ecosystem/save-institution", express.json(), async (req, res) => {
    try {
      const fs = await import("fs");
      const path = await import("path");
      
      const { institutionId, data } = req.body;
      const filePath = path.join(process.cwd(), "client/src/data/instituicoes-info.json");
      
      // Ler arquivo atual
      let allInstitutions = {};
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        allInstitutions = JSON.parse(content);
      }
      
      // Atualizar instituição
      allInstitutions[institutionId] = data;
      
      console.log("[API] Salvando instituição:", institutionId);
      fs.writeFileSync(filePath, JSON.stringify(allInstitutions, null, 2), "utf-8");
      
      res.json({ success: true, message: "Instituição salva com sucesso!" });
    } catch (error) {
      console.error("[API] Erro ao salvar instituição:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
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
  });
}

startServer().catch(console.error);
