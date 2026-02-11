import PyPDF2
import re
import json
import sys


def extract_curriculum_from_pdf(pdf_path):
    """
    Extrai a grade curricular (disciplinas, carga horária, aulas, provas)
    de PDFs de cursos da LA Educação.
    
    Suporta dois formatos:
    1. PDFs com semestres/módulos/períodos
    2. PDFs com tabela direta de PLANO DE ESTUDOS (como EJA)
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

    course_name = "Curso Não Identificado"
    subjects = []

    # Tentar extrair o nome do curso
    # Padrão 1: "PROJETO XXX" na primeira página
    project_match = re.search(r"PROJETO\s+([\w\s]+?)(?:\n|PREMIUM|FOMENTANDO)", text, re.IGNORECASE)
    if project_match:
        course_name = project_match.group(1).strip()
    
    # Padrão 2: "Curso de XXX"
    course_match = re.search(r"Curso\s+(?:de|em)\s+([\w\s-]+?)(?:\n\n|\nSEMESTRE|\nMÓDULO|\nPERÍODO)", text, re.IGNORECASE)
    if course_match:
        course_name = course_match.group(1).strip()

    # ============================================================
    # MÉTODO 1: Tabela direta com DISCIPLINAS + CARGA HORÁRIA
    # Formato: NOME_DISCIPLINA XXXh N N
    # ============================================================
    # Primeiro, limpar o texto: separar linhas e processar individualmente
    lines = text.split("\n")
    in_table = False
    
    for line in lines:
        line = line.strip()
        
        # Detectar início da tabela (cabeçalho com DISCIPLINAS)
        if re.search(r"DISCIPLINAS", line, re.IGNORECASE):
            in_table = True
            continue
        
        # Detectar fim da tabela (seção AVALIAÇÃO ou outra seção)
        if re.search(r"^(AVALIAÇÃO|CERTIFICAÇÃO|CADA DISCIPLINA)", line, re.IGNORECASE):
            in_table = False
            continue
        
        if not in_table:
            continue
        
        # Tentar extrair: NOME XXXh N N (pode ter texto extra no final)
        match_4col = re.match(
            r"^([A-ZÀ-Úa-zà-ú][A-ZÀ-Úa-zà-ú\s]+?)\s+(\d+)h\s+(\d+)\s+(\d+)",
            line
        )
        if match_4col:
            subject_name = match_4col.group(1).strip()
            workload = int(match_4col.group(2))
            num_classes = int(match_4col.group(3))
            num_exams = int(match_4col.group(4))
            
            # Ignorar cabeçalhos
            if subject_name.upper() in ["DISCIPLINAS", "DISCIPLINA", "CARGA", "CARGA HORÁRIA", ""]:
                continue
            # Ignorar se o nome contém palavras do cabeçalho
            if re.search(r"QDE DE|HORÁRIA", subject_name, re.IGNORECASE):
                continue
            
            subjects.append({
                "semester": 1,
                "subjectName": subject_name.title(),
                "workload": workload,
                "numClasses": num_classes,
                "numExams": num_exams
            })
            continue
        
        # Tentar extrair: NOME XXXh (apenas 2 colunas)
        match_2col = re.match(
            r"^([A-ZÀ-Úa-zà-ú][A-ZÀ-Úa-zà-ú\s]+?)\s+(\d+)h\s*$",
            line
        )
        if match_2col:
            subject_name = match_2col.group(1).strip()
            workload = int(match_2col.group(2))
            
            if subject_name.upper() in ["DISCIPLINAS", "DISCIPLINA", "CARGA", ""]:
                continue
            
            subjects.append({
                "semester": 1,
                "subjectName": subject_name.title(),
                "workload": workload
            })

    # ============================================================
    # MÉTODO 2: Tabela com apenas DISCIPLINA + CARGA HORÁRIA (sem aulas/provas)
    # Formato: NOME_DISCIPLINA XXXh
    # ============================================================
    if not subjects:
        simple_pattern = re.compile(
            r"^([A-ZÀ-Ú][A-ZÀ-Ú\s.,-]+?)\s+(\d+)\s*h",
            re.MULTILINE
        )
        simple_matches = simple_pattern.findall(text)

        if simple_matches:
            for match in simple_matches:
                subject_name = match[0].strip()
                workload = int(match[1])

                if subject_name.upper() in ["DISCIPLINAS", "DISCIPLINA", "CARGA", ""]:
                    continue
                if len(subject_name) < 3:
                    continue

                subjects.append({
                    "semester": 1,
                    "subjectName": subject_name.title(),
                    "workload": workload
                })

    # ============================================================
    # MÉTODO 3: Formato com semestres/módulos/períodos
    # ============================================================
    if not subjects:
        semester_pattern = re.compile(r"(?:SEMESTRE|MÓDULO|PERÍODO)\s*(\d+)", re.IGNORECASE)
        subject_pattern = re.compile(r"^\s*([A-ZÀ-Ú][\w\s.,-]+?)\s+(\d+)\s*h", re.MULTILINE | re.IGNORECASE)

        current_semester = 0
        lines = text.split("\n")
        for line in lines:
            semester_match = semester_pattern.search(line)
            if semester_match:
                current_semester = int(semester_match.group(1))
                continue

            if current_semester > 0:
                subject_match = subject_pattern.search(line)
                if subject_match:
                    subject_name = subject_match.group(1).strip()
                    workload = int(subject_match.group(2))
                    subjects.append({
                        "semester": current_semester,
                        "subjectName": subject_name,
                        "workload": workload
                    })

    # Filtrar disciplinas duplicadas
    unique_subjects = []
    seen_subjects = set()
    for sub in subjects:
        key = (sub["semester"], sub["subjectName"].lower())
        if key not in seen_subjects:
            unique_subjects.append(sub)
            seen_subjects.add(key)

    # Calcular total de semestres
    total_semesters = max((s["semester"] for s in unique_subjects), default=1)

    return {
        "courseName": course_name,
        "totalSemesters": total_semesters,
        "subjects": unique_subjects
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Uso: python3 extract_curriculum.py <caminho_do_pdf>"}))
    else:
        pdf_file_path = sys.argv[1]
        result = extract_curriculum_from_pdf(pdf_file_path)
        print(json.dumps(result, indent=2, ensure_ascii=False))
