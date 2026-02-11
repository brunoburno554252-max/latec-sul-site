import { exec } from "child_process";
import { promises as fs } from "fs";
import { join } from "path";
import { nanoid } from "nanoid";

interface CurriculumSubject {
  semester: number;
  subjectName: string;
  workload: number;
  description?: string;
}

interface ParsedCurriculum {
  subjects: CurriculumSubject[];
  courseName?: string;
  totalSemesters?: number;
}

export async function processCurriculumPDF(pdfBuffer: Buffer): Promise<ParsedCurriculum> {
  const tempPdfPath = join("/tmp", `${nanoid()}.pdf`);
  const pythonScriptPath = "/var/www/faculdade-site/extract_curriculum.py";

  try {
    await fs.writeFile(tempPdfPath, pdfBuffer);

    const { stdout, stderr } = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
      exec(`python3 ${pythonScriptPath} ${tempPdfPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return reject(error);
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
        }
        resolve({ stdout, stderr });
      });
    });

    const parsedResult = JSON.parse(stdout);

    if (parsedResult.error) {
      throw new Error(parsedResult.error);
    }

    if (!parsedResult.subjects || parsedResult.subjects.length === 0) {
      throw new Error("Nenhuma disciplina foi encontrada no PDF. Verifique se o documento contém uma grade curricular válida.");
    }

    return parsedResult as ParsedCurriculum;
  } catch (error: any) {
    throw new Error(`Falha ao processar PDF: ${error.message}`);
  } finally {
    await fs.unlink(tempPdfPath).catch(console.error);
  }
}
