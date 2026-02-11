import os
import re

# Cores Alvo
ROSA_LA = "#da1069"
AZUL_ALVO = "#3b82f6"
AZUL_HOVER = "#2563eb"
ROSA_HOVER = "#c4105e"

# Degradês
DEGRADE_NOVO = f"linear-gradient(135deg, {ROSA_LA} 0%, {AZUL_ALVO} 100%)"
DEGRADE_HOVER = f"linear-gradient(135deg, {ROSA_HOVER} 0%, {AZUL_HOVER} 100%)"

replacements = [
    # 1. Substituir degradês Tailwind que usam 'primary' e 'accent' (comuns no Header e Home)
    (r"from-primary to-accent", f"from-[{ROSA_LA}] to-[{AZUL_ALVO}]"),
    (r"from-accent to-primary", f"from-[{ROSA_LA}] to-[{AZUL_ALVO}]"),
    
    # 2. Substituir cores sólidas em botões que deveriam ser degradê
    (r"bg-primary(?!\/)", f"bg-gradient-to-r from-[{ROSA_LA}] to-[{AZUL_ALVO}]"),
    (r"bg-accent(?!\/)", f"bg-gradient-to-r from-[{ROSA_LA}] to-[{AZUL_ALVO}]"),
    
    # 3. Corrigir hovers
    (r"hover:bg-primary", f"hover:from-[{ROSA_HOVER}] hover:to-[{AZUL_HOVER}]"),
    (r"hover:bg-accent", f"hover:from-[{ROSA_HOVER}] hover:to-[{AZUL_HOVER}]"),
    
    # 4. Substituir degradês manuais no CSS
    (r"linear-gradient\(135deg, #da1069 0%, #da1069 100%\)", DEGRADE_NOVO),
    (r"linear-gradient\(to right, #da1069, #da1069\)", DEGRADE_NOVO),
    
    # 5. Corrigir sombras
    (r"shadow-primary\/20", f"shadow-blue-500/30"),
    (r"shadow-accent\/20", f"shadow-blue-500/30"),
]

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for pattern, replacement in replacements:
            new_content = re.sub(pattern, replacement, new_content)
        
        # Caso especial para o index.css para garantir as variáveis root
        if "index.css" in filepath:
            new_content = new_content.replace("--gradient-button: linear-gradient(135deg, #8b5cf6 0%, #da1069 100%);", 
                                             f"--gradient-button: {DEGRADE_NOVO};")

        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Final Fix Applied: {filepath}")
    except Exception as e:
        print(f"Error: {e}")

def main():
    base_dir = "/var/www/faculdade-site/client/src"
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.css')):
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
