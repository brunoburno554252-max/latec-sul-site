import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CurriculumSubject {
  semester: number;
  subjectName: string;
  workload: number;
  description?: string;
}

interface CurriculumPDFImportProps {
  courseId: number;
  onSuccess: () => void;
}

export default function CurriculumPDFImport({ courseId, onSuccess }: CurriculumPDFImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<CurriculumSubject[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingSubjects, setEditingSubjects] = useState<CurriculumSubject[]>([]);

  const importMutation = trpc.adminCurriculum.importFromPDF.useMutation();
  const saveMutation = trpc.adminCurriculum.saveParsedCurriculum.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast.error("Por favor, selecione um arquivo PDF");
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 10MB");
        return;
      }
      setFile(selectedFile);
      setExtractedData(null);
    }
  };

  const handleProcessPDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const base64Data = base64.split(",")[1];

        try {
          const result = await importMutation.mutateAsync({
            courseId,
            pdfBase64: base64Data,
          });

          if (result.success && result.data.subjects) {
            setExtractedData(result.data.subjects);
            setEditingSubjects(result.data.subjects);
            toast.success(`${result.data.subjects.length} disciplinas extraídas com sucesso!`);
          } else {
            toast.error("Nenhuma disciplina encontrada no PDF");
          }
        } catch (error: any) {
          toast.error(`Erro ao processar PDF: ${error.message}`);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Erro ao ler arquivo");
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!editingSubjects || editingSubjects.length === 0) {
      toast.error("Nenhuma disciplina para salvar");
      return;
    }

    try {
      await saveMutation.mutateAsync({
        courseId,
        subjects: editingSubjects,
      });
      toast.success("Grade curricular importada com sucesso!");
      setIsOpen(false);
      setFile(null);
      setExtractedData(null);
      setEditingSubjects([]);
      onSuccess();
    } catch (error: any) {
      toast.error(`Erro ao salvar: ${error.message}`);
    }
  };

  const handleSubjectChange = (index: number, field: keyof CurriculumSubject, value: any) => {
    const updated = [...editingSubjects];
    updated[index] = { ...updated[index], [field]: value };
    setEditingSubjects(updated);
  };

  const handleRemoveSubject = (index: number) => {
    setEditingSubjects(editingSubjects.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setFile(null);
    setExtractedData(null);
    setEditingSubjects([]);
  };

  // Group subjects by semester
  const subjectsBySemester = editingSubjects.reduce((acc: any, subject) => {
    if (!acc[subject.semester]) {
      acc[subject.semester] = [];
    }
    acc[subject.semester].push(subject);
    return acc;
  }, {});

  const semesters = Object.keys(subjectsBySemester).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Upload className="w-4 h-4" />
        Importar de PDF
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Importar Grade Curricular de PDF</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Upload Section */}
            {!extractedData && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                      <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <Label htmlFor="pdf-upload" className="cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">
                          Clique para selecionar um arquivo PDF
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Máximo 10MB
                        </p>
                      </Label>
                      <Input
                        id="pdf-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>

                    {file && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFile(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    <Button
                      onClick={handleProcessPDF}
                      disabled={!file || isProcessing}
                      className="w-full"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processando PDF...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Processar PDF
                        </>
                      )}
                    </Button>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex gap-2">
                        <AlertCircle className="w-5 h-5 text-[#B8860B] flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                          <p className="font-medium mb-1">Dicas para melhor resultado:</p>
                          <ul className="list-disc list-inside space-y-1 text-xs">
                            <li>Use PDFs com texto selecionável (não escaneados)</li>
                            <li>Certifique-se que a grade está organizada por semestres/períodos</li>
                            <li>Inclua cargas horárias das disciplinas</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Preview Section */}
            {extractedData && editingSubjects.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">
                      {editingSubjects.length} disciplinas extraídas
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Carregar outro PDF
                  </Button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Revise os dados extraídos</strong> antes de salvar. Você pode editar qualquer informação.
                  </p>
                </div>

                {semesters.map((semester) => (
                  <Card key={semester}>
                    <CardHeader>
                      <h3 className="font-semibold text-lg">
                        {semester}º Semestre ({subjectsBySemester[semester].length} disciplinas)
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {subjectsBySemester[semester].map((subject: CurriculumSubject, idx: number) => {
                        const globalIndex = editingSubjects.indexOf(subject);
                        return (
                          <div key={globalIndex} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="grid grid-cols-2 gap-3 flex-1">
                                <div>
                                  <Label className="text-xs">Disciplina</Label>
                                  <Input
                                    value={subject.subjectName}
                                    onChange={(e) =>
                                      handleSubjectChange(globalIndex, "subjectName", e.target.value)
                                    }
                                    className="mt-1"
                                  />
                                </div>
                                <div>
                                  <Label className="text-xs">Carga Horária (h)</Label>
                                  <Input
                                    type="number"
                                    value={subject.workload}
                                    onChange={(e) =>
                                      handleSubjectChange(globalIndex, "workload", parseInt(e.target.value))
                                    }
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveSubject(globalIndex)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            {subject.description && (
                              <div>
                                <Label className="text-xs">Descrição</Label>
                                <Textarea
                                  value={subject.description}
                                  onChange={(e) =>
                                    handleSubjectChange(globalIndex, "description", e.target.value)
                                  }
                                  rows={2}
                                  className="mt-1"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                ))}

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={saveMutation.isPending}
                    className="flex-1"
                  >
                    {saveMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Salvar Grade Curricular
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
