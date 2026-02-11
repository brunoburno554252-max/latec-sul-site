import os
import re

# Definições de cores
ROXO_ESCURO = "#9d197d"
ROXO_MEDIO = "purple-600"
ROXO_CLARO = "purple-500"
ROXO_MUITO_CLARO = "purple-100"
ROXO_HOVER = "purple-700"

ROSA_LA = "#da1069"
ROSA_TAILWIND = "pink-600"
ROSA_CLARO_TAILWIND = "pink-500"
ROSA_MUITO_CLARO_TAILWIND = "pink-100"
ROSA_HOVER_TAILWIND = "pink-700"

replacements = [
    (r"#9d197d", ROSA_LA),
    (r"purple-900", "pink-900"),
    (r"purple-950", "pink-950"),
    (r"purple-800", "pink-800"),
    (r"purple-700", "pink-700"),
    (r"purple-600", "pink-600"),
    (r"purple-500", "pink-500"),
    (r"purple-400", "pink-400"),
    (r"purple-300", "pink-300"),
    (r"purple-200", "pink-200"),
    (r"purple-100", "pink-100"),
    (r"purple-50", "pink-50"),
    (r"via-purple-500", "via-pink-500"),
    (r"to-purple-600", f"to-[{ROSA_LA}]"),
    (r"from-purple-500", "from-pink-500"),
    (r"text-purple-700", "text-pink-700"),
    (r"text-purple-500", "text-pink-500"),
    (r"bg-purple-500", "bg-pink-500"),
    (r"border-purple-500", "border-pink-500"),
    (r"hover:text-purple-700", "hover:text-pink-700"),
    (r"hover:bg-purple-50", "hover:bg-pink-50"),
    (r"hover:border-purple-300", "hover:border-pink-300"),
]

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for pattern, replacement in replacements:
        new_content = re.sub(pattern, replacement, new_content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed: {filepath}")

def main():
    base_dir = "/var/www/faculdade-site/client/src"
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.css')):
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
