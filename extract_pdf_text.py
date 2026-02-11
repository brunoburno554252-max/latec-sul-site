import PyPDF2
import sys

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with open(pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                text += page.extract_text()
        return text
    except FileNotFoundError:
        return f"Erro: O arquivo {pdf_path} não foi encontrado."
    except Exception as e:
        return f"Erro ao processar o PDF: {e}"

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python3 extract_pdf_text.py <caminho_do_pdf>")
    else:
        pdf_file_path = sys.argv[1]
        extracted_text = extract_text_from_pdf(pdf_file_path)
        print(extracted_text)
