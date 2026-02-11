import os
import re

# Cores Alvo
ROSA_LA = "#da1069"
AZUL_NOVO = "#3559AC"
AZUL_HOVER = "#2a468a" # Um tom levemente mais escuro para o hover
ROSA_HOVER = "#c4105e"

# Degradês
DEGRADE_NOVO = f"linear-gradient(135deg, {ROSA_LA} 0%, {AZUL_NOVO} 100%)"
DEGRADE_HOVER = f"linear-gradient(135deg, {ROSA_HOVER} 0%, {AZUL_HOVER} 100%)"

replacements = [
    # 1. Substituir o azul anterior (#3b82f6) pelo novo (#3559AC)
    (r"#3b82f6", AZUL_NOVO),
    (r"blue-500", f"[{AZUL_NOVO}]"),
    (r"blue-600", f"[{AZUL_HOVER}]"),
    
    # 2. Garantir que degradês Tailwind usem a nova cor
    (r"to-\[#3b82f6\]", f"to-[{AZUL_NOVO}]"),
    (r"hover:to-\[#2563eb\]", f"hover:to-[{AZUL_HOVER}]"),
    
    # 3. Substituir degradês manuais no CSS que possam ter sobrado
    (r"linear-gradient\(135deg, #da1069 0%, #3b82f6 100%\)", DEGRADE_NOVO),
    (r"linear-gradient\(135deg, #c4105e 0%, #2563eb 100%\)", DEGRADE_HOVER),
]

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for pattern, replacement in replacements:
            new_content = re.sub(pattern, replacement, new_content)
        
        # Caso especial para o index.css
        if "index.css" in filepath:
            new_content = new_content.replace("linear-gradient(135deg, #da1069 0%, #3b82f6 100%)", DEGRADE_NOVO)

        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Color Updated: {filepath}")
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
