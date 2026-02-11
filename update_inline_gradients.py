import os
import re

replacements = [
    (r"from-\[#da1069\] to-pink-600", "from-[#da1069] to-[#3b82f6]"),
    (r"hover:from-\[#8a1570\] hover:to-pink-700", "hover:from-[#c4105e] hover:to-[#2563eb]"),
    (r"from-\[#9d197d\] to-pink-600", "from-[#da1069] to-[#3b82f6]"),
    (r"from-\[#9d197d\] via-pink-500 to-transparent", "from-[#da1069] via-[#3b82f6] to-transparent"),
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
        print(f"Fixed inline gradient: {filepath}")

def main():
    base_dir = "/var/www/faculdade-site/client/src"
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.tsx'):
                fix_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
