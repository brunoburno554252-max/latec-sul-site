import PyPDF2
import re
import json
import sys


def extract_curriculum_from_pdf(pdf_path):
    """
    Extrai a grade curricular (disciplinas, carga horária, etc.) de PDFs
    de cursos da LA Educação.
    
    FORMATOS SUPORTADOS:
    
    FORMATO A - Tabela inline (EJA):
      Disciplina e carga horária na MESMA linha.
      Ex: "LÍNGUA PORTUGUESA 350h 37 3"
      Pode ter: nome + carga(h) + aulas + provas
      Ou apenas: nome + carga(h)
    
    FORMATO B - Tabela alternada (Técnico):
      Disciplina em uma linha, carga horária na PRÓXIMA linha (só número).
      Ex: "REDAÇÃO TÉCNICA"
           "50"
      Organizado por MÓDULOS.
    
    FORMATO C - Com semestres/períodos:
      Disciplinas agrupadas por "SEMESTRE X" ou "PERÍODO X".
    
    O script tenta todos os formatos e retorna o que encontrar mais resultados.
    """
    text = ""
    try:
        with open(pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except FileNotFoundError:
        return {"error": f"Erro: O arquivo {pdf_path} não foi encontrado."}
    except Exception as e:
        return {"error": f"Erro ao ler o PDF: {e}"}

    if not text.strip():
        return {"error": "Não foi possível extrair texto do PDF. O arquivo pode estar escaneado ou protegido."}

    # ============================================================
    # EXTRAIR NOME DO CURSO
    # ============================================================
    course_name = extract_course_name(text)

    # ============================================================
    # TENTAR TODOS OS FORMATOS E USAR O MELHOR RESULTADO
    # ============================================================
    results = []

    # Formato A: Tabela inline (disciplina + carga na mesma linha)
    subjects_a = try_format_inline_table(text)
    if subjects_a:
        results.append(("inline", subjects_a))

    # Formato B: Tabela alternada (disciplina numa linha, carga na próxima)
    subjects_b = try_format_alternating_lines(text)
    if subjects_b:
        results.append(("alternating", subjects_b))

    # Formato C: Com semestres/períodos explícitos
    subjects_c = try_format_semesters(text)
    if subjects_c:
        results.append(("semesters", subjects_c))

    # Escolher o resultado com mais disciplinas
    if not results:
        return {"error": "Nenhuma disciplina foi encontrada no PDF. Verifique se o documento contém uma grade curricular válida."}

    best_format, best_subjects = max(results, key=lambda x: len(x[1]))

    # Filtrar disciplinas duplicadas
    unique_subjects = deduplicate_subjects(best_subjects)

    # Calcular total de semestres/módulos
    total_semesters = max((s["semester"] for s in unique_subjects), default=1)

    return {
        "courseName": course_name,
        "totalSemesters": total_semesters,
        "subjects": unique_subjects
    }


def extract_course_name(text):
    """Tenta extrair o nome do curso do texto do PDF."""
    
    # Padrão: "TÉCNICO EM XXX" ou "CURSO DE XXX" no início
    patterns = [
        r"(TÉCNICO\s+EM\s+[A-ZÀ-Ú\s]+?)(?:\n|ESTRUTURA|MÓDULO|Um curso)",
        r"(TECNÓLOGO\s+EM\s+[A-ZÀ-Ú\s]+?)(?:\n|ESTRUTURA|MÓDULO|Um curso)",
        r"(BACHARELADO\s+EM\s+[A-ZÀ-Ú\s]+?)(?:\n|ESTRUTURA|MÓDULO|Um curso)",
        r"(LICENCIATURA\s+EM\s+[A-ZÀ-Ú\s]+?)(?:\n|ESTRUTURA|MÓDULO|Um curso)",
        r"PROJETO\s+([\w\s]+?)(?:\n|PREMIUM|FOMENTANDO)",
        r"Curso\s+(?:de|em)\s+([\w\s-]+?)(?:\n\n|\nSEMESTRE|\nMÓDULO|\nPERÍODO)",
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            name = match.group(1).strip()
            # Limpar espaços extras
            name = re.sub(r'\s+', ' ', name)
            return name
    
    return "Curso Não Identificado"


def is_header_or_noise(name):
    """Verifica se o texto é um cabeçalho ou ruído, não uma disciplina."""
    name_upper = name.upper().strip()
    
    # Palavras que são ruído APENAS quando são exatamente iguais
    exact_noise = [
        "DISCIPLINAS", "DISCIPLINA", "CARGA", "CARGA HORÁRIA", "CARGA HORARIA",
        "QDE DE", "HORÁRIA", "HORARIA", "PROVAS", "AULAS",
        "MÓDULO", "MODULO", "SEMESTRE", "PERÍODO", "PERIODO",
        "ESTRUTURA CURRICULAR", "ESTRUTURA", "CURRICULAR",
        "PLANO DE ESTUDOS", "AVALIAÇÃO", "AVALIACAO", "CERTIFICAÇÃO",
        "PRAZO", "HORAS", "CADA DISCIPLINA",
        "FORMAÇÃO", "CERTIFICADO", "BIBLIOTECA",
    ]
    
    # Palavras que são ruído quando o texto COMEÇA com elas
    startswith_noise = [
        "CARGA HORARIA TOTAL", "CARGA HORÁRIA TOTAL", "TOTAL DO CURSO",
        "CARGA HOR",
    ]
    
    for noise in exact_noise:
        if name_upper == noise:
            return True
    
    for noise in startswith_noise:
        if name_upper.startswith(noise):
            return True
    
    # Muito curto (menos de 3 caracteres)
    if len(name_upper) < 3:
        return True
    
    # É apenas um número
    if re.match(r'^\d+$', name_upper):
        return True
    
    # Começa com número seguido de espaço (como "3" ou "800 HORAS")
    if re.match(r'^\d+\s*(h|horas?)?\s*$', name_upper, re.IGNORECASE):
        return True
    
    return False


def try_format_inline_table(text):
    """
    FORMATO A: Disciplina e dados na MESMA linha.
    Exemplos:
      "LÍNGUA PORTUGUESA 350h 37 3"
      "MATEMÁTICA 315h 38 3"
      "HISTÓRIA 72h"
    """
    subjects = []
    lines = text.split("\n")
    in_table = False
    
    for line in lines:
        line = line.strip()
        
        # Detectar início da tabela (pode estar colado: "DISCIPLINASCARGA")
        # Deve começar com DISCIPLINA (cabeçalho de tabela) - não no meio de uma frase
        if re.match(r'^DISCIPLINAS?', line, re.IGNORECASE):
            in_table = True
            continue
        
        if not in_table:
            continue
        
        # Detectar fim da tabela (só quando já estamos dentro da tabela)
        if re.search(r"^(AVALIA[CÇ][AÃ]O|CERTIFICA[CÇ][AÃ]O|CADA DISCIPLINA|CARGA HOR[AÁ]RIA TOTAL|CARGA HORARIA TOTAL)", line, re.IGNORECASE):
            break
        
        # Formato: NOME XXXh N N (4 colunas)
        match_4col = re.match(
            r"^([A-ZÀ-Úa-zà-ú][A-ZÀ-Úa-zà-ú\s\-\.]+?)\s+(\d+)h\s+(\d+)\s+(\d+)",
            line
        )
        if match_4col:
            subject_name = match_4col.group(1).strip()
            if is_header_or_noise(subject_name):
                continue
            subjects.append({
                "semester": 1,
                "subjectName": subject_name.title(),
                "workload": int(match_4col.group(2)),
                "numClasses": int(match_4col.group(3)),
                "numExams": int(match_4col.group(4))
            })
            continue
        
        # Formato: NOME XXXh (2 colunas)
        match_2col = re.match(
            r"^([A-ZÀ-Úa-zà-ú][A-ZÀ-Úa-zà-ú\s\-\.]+?)\s+(\d+)h",
            line
        )
        if match_2col:
            subject_name = match_2col.group(1).strip()
            if is_header_or_noise(subject_name):
                continue
            subjects.append({
                "semester": 1,
                "subjectName": subject_name.title(),
                "workload": int(match_2col.group(2))
            })
            continue
    
    return subjects


def try_format_alternating_lines(text):
    """
    FORMATO B: Disciplina em uma linha, carga horária na próxima linha.
    Exemplos:
      "REDAÇÃO TÉCNICA"
      "50"
      
      "INFORMÁTICA APLICADA"
      "40"
    
    Organizado por MÓDULOS ou sem módulos.
    """
    subjects = []
    lines = text.split("\n")
    current_module = 0
    in_curriculum = False
    i = 0
    
    while i < len(lines):
        line = lines[i].strip()
        
        # Detectar início da grade (MÓDULO, ESTRUTURA CURRICULAR, etc.)
        if re.search(r"(MÓDULO|MODULO)\s*(\d+)", line, re.IGNORECASE):
            match = re.search(r"(MÓDULO|MODULO)\s*(\d+)", line, re.IGNORECASE)
            current_module = int(match.group(2))
            in_curriculum = True
            i += 1
            continue
        
        if re.search(r"ESTRUTURA\s+CURRICULAR", line, re.IGNORECASE):
            in_curriculum = True
            i += 1
            continue
        
        # Detectar fim da grade
        if re.search(r"^(CARGA\s+HOR[AÁ]RIA\s+TOTAL|CARGA\s+HORARIA\s+TOTAL)", line, re.IGNORECASE):
            break
        
        # Ignorar cabeçalhos
        if is_header_or_noise(line):
            i += 1
            continue
        
        if not in_curriculum:
            i += 1
            continue
        
        # Verificar se a linha atual parece um nome de disciplina
        # (texto com letras, não é apenas número, não é cabeçalho)
        is_subject_name = (
            re.match(r'^[A-ZÀ-Úa-zà-ú]', line) and
            not re.match(r'^\d+\s*$', line) and
            not re.match(r'^\d+\s*(h|horas?)\s*$', line, re.IGNORECASE) and
            len(line) >= 3 and
            not is_header_or_noise(line)
        )
        
        if is_subject_name:
            subject_name = line.strip()
            workload = 0
            
            # Verificar se a próxima linha é um número (carga horária)
            if i + 1 < len(lines):
                next_line = lines[i + 1].strip()
                
                # Próxima linha é apenas um número (carga horária)
                workload_match = re.match(r'^(\d+)\s*h?\s*$', next_line, re.IGNORECASE)
                if workload_match:
                    workload = int(workload_match.group(1))
                    i += 1  # Pular a linha da carga horária
            
            # Usar módulo atual ou 1 como padrão
            semester = current_module if current_module > 0 else 1
            
            subject_data = {
                "semester": semester,
                "subjectName": subject_name.title(),
                "workload": workload
            }
            subjects.append(subject_data)
        
        i += 1
    
    return subjects


def try_format_semesters(text):
    """
    FORMATO C: Disciplinas agrupadas por semestres/períodos.
    Exemplos:
      "1º SEMESTRE"
      "Disciplina 1 - 60h"
      "Disciplina 2 - 80h"
      "2º SEMESTRE"
      ...
    """
    subjects = []
    lines = text.split("\n")
    current_semester = 0
    
    semester_pattern = re.compile(
        r"(?:(\d+)[ºª°]?\s*)?(?:SEMESTRE|PERÍODO|PERIODO)\s*(\d+)?",
        re.IGNORECASE
    )
    
    for line in lines:
        line = line.strip()
        
        # Detectar semestre/período
        sem_match = semester_pattern.search(line)
        if sem_match:
            # Pegar o número do semestre (pode estar antes ou depois)
            sem_num = sem_match.group(1) or sem_match.group(2)
            if sem_num:
                current_semester = int(sem_num)
            else:
                current_semester += 1
            continue
        
        if current_semester == 0:
            continue
        
        # Tentar extrair disciplina com carga horária
        # Formato: "Nome da Disciplina - XXh" ou "Nome XXXh"
        patterns = [
            r"^([A-ZÀ-Úa-zà-ú][\w\s.,-]+?)\s*[-–]\s*(\d+)\s*h",
            r"^([A-ZÀ-Úa-zà-ú][\w\s.,-]+?)\s+(\d+)\s*h",
        ]
        
        for pattern in patterns:
            match = re.match(pattern, line, re.IGNORECASE)
            if match:
                subject_name = match.group(1).strip()
                workload = int(match.group(2))
                
                if is_header_or_noise(subject_name):
                    break
                
                subjects.append({
                    "semester": current_semester,
                    "subjectName": subject_name.title() if subject_name.isupper() else subject_name,
                    "workload": workload
                })
                break
    
    return subjects


def deduplicate_subjects(subjects):
    """Remove disciplinas duplicadas mantendo a primeira ocorrência."""
    unique = []
    seen = set()
    for sub in subjects:
        key = (sub["semester"], sub["subjectName"].lower())
        if key not in seen:
            unique.append(sub)
            seen.add(key)
    return unique


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Uso: python3 extract_curriculum.py <caminho_do_pdf>"}))
    else:
        pdf_file_path = sys.argv[1]
        result = extract_curriculum_from_pdf(pdf_file_path)
        print(json.dumps(result, indent=2, ensure_ascii=False))
