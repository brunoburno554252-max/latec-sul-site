import mysql.connector
import os

# Configurações do banco
db_config = {
    "host": "localhost",
    "user": "faculdade_user",
    "password": "Faculdade2024!",
    "database": "faculdade_db"
}

novo_titulo = "Empresários Educacionais: transformem propósito em rentabilidade real"

# 1. Atualizar no Banco de Dados
try:
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    
    query = "UPDATE home_settings SET value = %s WHERE section = 'about' AND field = 'title'"
    cursor.execute(query, (novo_titulo,))
    conn.commit()
    print(f"Banco de dados atualizado: {cursor.rowcount} linha(s) afetada(s).")
    
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Erro ao atualizar banco: {e}")

# 2. Atualizar no Código-Fonte (Fallback)
filepath = "/var/www/faculdade-site/client/src/components/About.tsx"
try:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    old_text = "Empresários Educacionais: transformem propósito em rentabilidade real com o maior ecossistema de cursos do mundo"
    new_content = content.replace(old_text, novo_titulo)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Código-fonte atualizado: {filepath}")
except Exception as e:
    print(f"Erro ao atualizar código: {e}")
