import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const DATABASE_URL = "mysql://faculdade_user:Faculdade2024!@localhost:3306/faculdade_db";

async function resetAdmin() {
  try {
    console.log("🔄 Conectando ao banco de dados...");
    const connection = await mysql.createConnection(DATABASE_URL);
    
    const username = "suporte.ti@facla.edu.br";
    const password = "La2024@@@@@@";
    
    console.log(`🔄 Verificando se usuário ${username} existe...`);
    const [existing] = await connection.execute(
      "SELECT id FROM admin_users WHERE username = ?",
      [username]
    );
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    if (existing.length > 0) {
      console.log("🔄 Atualizando senha do usuário existente...");
      await connection.execute(
        "UPDATE admin_users SET passwordHash = ?, isActive = 1, updatedAt = NOW() WHERE username = ?",
        [passwordHash, username]
      );
      console.log("✅ Senha atualizada com sucesso!");
    } else {
      console.log("🔄 Criando novo usuário administrador...");
      await connection.execute(
        "INSERT INTO admin_users (username, passwordHash, name, email, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())",
        [username, passwordHash, "Suporte TI", username, true]
      );
      console.log("✅ Usuário criado com sucesso!");
    }
    
    await connection.end();
  } catch (error) {
    console.error("❌ Erro:", error.message);
    process.exit(1);
  }
}

resetAdmin();
