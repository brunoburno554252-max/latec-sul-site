import os
import re

# Cores Alvo
ROSA_LA = "#da1069"
AZUL_ALVO = "#3b82f6"
AZUL_HOVER = "#2563eb"
ROSA_HOVER = "#c4105e"

# Padrões de substituição para cobrir diversas formas de declaração de degradê e cores
replacements = [
    # Substituir degradês específicos (Roxo/Rosa -> Rosa/Azul)
    (r"linear-gradient\(135deg, #8b5cf6 0%, #da1069 100%\)", f"linear-gradient(135deg, {ROSA_LA} 0%, {AZUL_ALVO} 100%)"),
    (r"linear-gradient\(135deg, #7c3aed 0%, #c4105e 100%\)", f"linear-gradient(135deg, {ROSA_HOVER} 0%, {AZUL_HOVER} 100%)"),
    
    # Substituir classes Tailwind de degradê comuns no projeto
    (r"from-pink-600 to-\[#da1069\]", f"from-[{ROSA_LA}] to-[{AZUL_ALVO}]"),
    (r"from-\[#da1069\] to-pink-600", f"from-[{ROSA_LA}] to-[{AZUL_ALVO}]"),
    (r"from-\[#9d197d\] to-purple-600", f"from-[{ROSA_LA}] to-[{AZUL_ALVO}]"),
    (r"from-\[#9d197d\] to-pink-600", f"from-[{ROSA_LA}] to-[{AZUL_ALVO}]"),
    (r"from-purple-500 to-purple-600", f"from-[{ROSA_LA}] to-[{AZUL_ALVO}]"),
    (r"from-purple-600 to-pink-600", f"from-[{ROSA_LA}] to-[{AZUL_ALVO}]"),
    
    # Hovers
    (r"hover:from-pink-700 hover:to-\[#c4105e\]", f"hover:from-[{ROSA_HOVER}] hover:to-[{AZUL_HOVER}]"),
    (r"hover:from-\[#8a1570\] hover:to-pink-700", f"hover:from-[{ROSA_HOVER}] hover:to-[{AZUL_HOVER}]"),
    (r"hover:from-purple-700 hover:to-pink-700", f"hover:from-[{ROSA_HOVER}] hover:to-[{AZUL_HOVER}]"),
    
    # Sombras relacionadas
    (r"shadow-pink-500/50", f"shadow-blue-500/30"),
    (r"shadow-purple-500/50", f"shadow-blue-500/30"),
]

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for pattern, replacement in replacements:
            new_content = re.sub(pattern, replacement, new_content)
        
        # Caso especial para o componente Button que pode ter sido alterado parcialmente
        if "button.tsx" in filepath:
            new_content = re.sub(r'gradient: "bg-gradient-to-br from-.* to-.*"', 
                               f'gradient: "bg-gradient-to-br from-[{ROSA_LA}] to-[{AZUL_ALVO}] text-white hover:from-[{ROSA_HOVER}] hover:to-[{AZUL_HOVER}] hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"', 
                               new_content)

        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Global Fix: {filepath}")
    except Exception as e:
        print(f"Error fixing {filepath}: {e}")

def main():
    base_dir = "/var/www/faculdade-site/client/src"
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.css')):
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
