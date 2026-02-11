import mysql from 'mysql2/promise';
import fs from 'fs';

const dbConfig = {
    host: 'localhost',
    user: 'faculdade_user',
    password: 'Faculdade2024!',
    database: 'faculdade_db'
};

const novoTitulo = "Empresários Educacionais: transformem propósito em rentabilidade real";

async function update() {
    // 1. Atualizar no Banco de Dados
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            "UPDATE home_settings SET value = ? WHERE section = 'about' AND field = 'title'",
            [novoTitulo]
        );
        console.log(`Banco de dados atualizado: ${result.affectedRows} linha(s) afetada(s).`);
        await connection.end();
    } catch (error) {
        console.error(`Erro ao atualizar banco: ${error.message}`);
    }

    // 2. Atualizar no Código-Fonte (Fallback)
    const filepath = "/var/www/faculdade-site/client/src/components/About.tsx";
    try {
        let content = fs.readFileSync(filepath, 'utf8');
        const oldText = "Empresários Educacionais: transformem propósito em rentabilidade real com o maior ecossistema de cursos do mundo";
        
        if (content.includes(oldText)) {
            const newContent = content.replace(oldText, novoTitulo);
            fs.writeFileSync(filepath, newContent, 'utf8');
            console.log(`Código-fonte atualizado: ${filepath}`);
        } else {
            console.log("Texto antigo não encontrado no código-fonte (pode já ter sido alterado via banco).");
        }
    } catch (error) {
        console.error(`Erro ao atualizar código: ${error.message}`);
    }
}

update();
