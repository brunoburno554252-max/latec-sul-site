import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL não configurada!");
  process.exit(1);
}

async function seedAdmin() {
  try {
    console.log("🔄 Conectando ao banco de dados...");
    
    const connection = await mysql.createConnection(DATABASE_URL);

    console.log("🔄 Verificando se admin já existe...");
    
    // Verificar se admin já existe
    const [existing] = await connection.execute(
      "SELECT id FROM admin_users WHERE username = ?",
      ["admin"]
    );

    if (existing.length > 0) {
      console.log("✅ Admin já existe!");
      await connection.end();
      return;
    }

    console.log("🔄 Criando usuário admin...");
    
    const passwordHash = await bcrypt.hash("123456", 10);

    await connection.execute(
      "INSERT INTO admin_users (username, passwordHash, name, email, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
      ["admin", passwordHash, "Administrador", "admin@laeducacao.com.br", true]
    );

    console.log("✅ Admin criado com sucesso!");
    console.log("📝 Usuário: admin");
    console.log("📝 Senha: 123456");

    await connection.end();
  } catch (error) {
    console.error("❌ Erro:", error.message);
    process.exit(1);
  }
}

seedAdmin();
