import PyPDF2
import re
import json
import sys

def extract_curriculum_from_pdf(pdf_path):
    text = ""
    try:
        with open(pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text += page.extract_text()
    except FileNotFoundError:
        return {"error": f"Erro: O arquivo {pdf_path} não foi encontrado."}
    except Exception as e:
        return {"error": f"Erro ao ler o PDF: {e}"}

    course_name = "Curso Não Identificado"
    total_semesters = 0
    subjects = []

    # Tentar extrair o nome do curso (pode ser adaptado para padrões específicos)
    # Mais específico para evitar capturar linhas inteiras
    course_name_match = re.search(r"Curso de\s+([\w\s-]+?)(?=\n\n|\nSEMESTRE|\nMÓDULO|\nPERÍODO)", text, re.IGNORECASE)
    if course_name_match:
        course_name = course_name_match.group(1).strip()

    # Expressões regulares para identificar semestres/módulos e disciplinas
    # Adapte estas regex conforme os padrões mais comuns nos seus PDFs
    semester_pattern = re.compile(r"(?:SEMESTRE|MÓDULO|PERÍODO)\s*(\d+)", re.IGNORECASE)
    # Ajustado para capturar o nome da disciplina de forma mais robusta antes da carga horária
    subject_pattern = re.compile(r"^\s*([A-ZÀ-Ú][\w\s.,-]+?)\s+(\d+)\s*h", re.MULTILINE | re.IGNORECASE)

    current_semester = 0
    lines = text.split("\n")

    for line in lines:
        semester_match = semester_pattern.search(line)
        if semester_match:
            current_semester = int(semester_match.group(1))
            if current_semester > total_semesters:
                total_semesters = current_semester
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

    # Filtrar disciplinas duplicadas (pode ocorrer devido a quebras de linha)
    unique_subjects = []
    seen_subjects = set()
    for sub in subjects:
        key = (sub["semester"], sub["subjectName"].lower())
        if key not in seen_subjects:
            unique_subjects.append(sub)
            seen_subjects.add(key)

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
