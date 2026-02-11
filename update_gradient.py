import os

filepath = "/var/www/faculdade-site/client/src/index.css"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Substituir o degradê roxo -> rosa por rosa -> azul
# Rosa: #da1069, Azul: #3b82f6 (Blue 500 do Tailwind)
new_gradient = "linear-gradient(135deg, #da1069 0%, #3b82f6 100%)"
new_hover_gradient = "linear-gradient(135deg, #c4105e 0%, #2563eb 100%)"

content = content.replace("linear-gradient(135deg, #8b5cf6 0%, #da1069 100%)", new_gradient)
content = content.replace("linear-gradient(135deg, #7c3aed 0%, #c4105e 100%)", new_hover_gradient)

# Também atualizar o comentário se existir
content = content.replace("/* Degradê Roxo → Rosa */", "/* Degradê Rosa → Azul */")

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Updated gradient in {filepath}")
