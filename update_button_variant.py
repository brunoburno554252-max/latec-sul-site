import os

filepath = "/var/www/faculdade-site/client/src/components/ui/button.tsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Substituir a variante gradient antiga pela nova com rosa e azul
old_gradient = 'gradient: "bg-gradient-to-br from-pink-600 to-[#da1069] text-white hover:from-pink-700 hover:to-[#c4105e] hover:shadow-lg hover:shadow-pink-500/50 hover:-translate-y-0.5"'
new_gradient = 'gradient: "bg-gradient-to-br from-[#da1069] to-[#3b82f6] text-white hover:from-[#c4105e] hover:to-[#2563eb] hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5"'

content = content.replace(old_gradient, new_gradient)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Updated button variant in {filepath}")
