import { useState } from "react";
import { Search, Loader2, CheckCircle2, AlertCircle, FileText, Download, ShieldCheck, KeyRound, QrCode, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface CertificateData {
  aluno: string;
  curso: string;
  status: string;
  dataSolicitacao: string;
  arquivos: any[];
  message: string;
}

interface ValidateResponse {
  success: boolean;
  data?: CertificateData;
  error?: string;
}

type ActiveTab = "menu" | "rastreio" | "validacao";

export default function CertificateTrackingPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("menu");
  const [searchKey, setSearchKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ValidateResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Formatar a chave enquanto digita (XXXX-XXXX-XXXX)
  const handleKeyChange = (value: string) => {
    const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    let formatted = "";
    for (let i = 0; i < clean.length && i < 12; i++) {
      if (i > 0 && i % 4 === 0) formatted += "-";
      formatted += clean[i];
    }
    setSearchKey(formatted);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const key = searchKey.trim();
    if (!key || key.length < 10) return;

    setIsLoading(true);
    setResult(null);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/certificate-keys/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      const data: ValidateResponse = await response.json();

      if (response.status === 429) {
        setErrorMsg("Muitas tentativas. Aguarde 1 minuto antes de tentar novamente.");
      } else if (!response.ok || !data.success) {
        setErrorMsg(data.error || "Chave inválida ou expirada.");
      } else {
        setResult(data);
      }
    } catch (err) {
      setErrorMsg("Erro ao conectar ao servidor. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToMenu = () => {
    setActiveTab("menu");
    setSearchKey("");
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Validação e Rastreio</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Consulte a autenticidade e o status de emissão do seu certificado ou diploma LA. Educação.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 -mt-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">

              {/* Menu de Opções */}
              {activeTab === "menu" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
                  {/* Botão Rastreio */}
                  <Card 
                    className="shadow-xl border-none cursor-pointer hover:scale-[1.02] transition-all duration-300 group"
                    onClick={() => setActiveTab("rastreio")}
                  >
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        <KeyRound className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Rastreio</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Acompanhe o status de emissão do seu certificado ou diploma utilizando sua chave de acesso.
                      </p>
                      <div className="mt-6">
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-[#1B8C3D] group-hover:gap-3 transition-all">
                          Acessar <span className="text-lg">→</span>
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Botão Validação */}
                  <Card 
                    className="shadow-xl border-none cursor-pointer hover:scale-[1.02] transition-all duration-300 group"
                    onClick={() => setActiveTab("validacao")}
                  >
                    <CardContent className="p-8 text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#D4A017] to-[#1a3a7a] rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                        <QrCode className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Validação</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Verifique a autenticidade de um certificado ou diploma através do código QR ou código de validação.
                      </p>
                      <div className="mt-6">
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-[#D4A017] group-hover:gap-3 transition-all">
                          Acessar <span className="text-lg">→</span>
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Aba Rastreio */}
              {activeTab === "rastreio" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  {/* Botão Voltar */}
                  <button 
                    onClick={handleBackToMenu}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium mb-6 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </button>

                  <Card className="shadow-xl border-none">
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                        <KeyRound className="w-6 h-6 text-primary" />
                        Rastreio de Certificado
                      </CardTitle>
                      <CardDescription>
                        Insira a chave de acesso que você recebeu para verificar o status do seu certificado
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 mt-4">
                        <div className="relative flex-grow">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <Input 
                            placeholder="XXXX-XXXX-XXXX" 
                            className="pl-10 h-12 text-lg border-2 focus:border-primary font-mono tracking-widest uppercase"
                            value={searchKey}
                            onChange={(e) => handleKeyChange(e.target.value)}
                            maxLength={14}
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="h-12 px-8 bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] hover:from-[#146B2F] hover:to-[#B8860B]/90 text-white font-bold text-lg" 
                          disabled={isLoading || searchKey.length < 10}
                        >
                          {isLoading ? <Loader2 className="animate-spin mr-2" /> : "RASTREAR"}
                        </Button>
                      </form>
                      <p className="text-xs text-gray-400 mt-3 text-center">
                        A chave de acesso foi enviada para o seu WhatsApp quando o certificado foi encaminhado à certificadora.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Results Section */}
                  <div className="mt-10">
                    {isLoading && (
                      <div className="text-center py-12">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">Validando chave de acesso...</p>
                      </div>
                    )}

                    {errorMsg && (
                      <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-red-900 mb-2">Acesso Negado</h3>
                        <p className="text-red-700">{errorMsg}</p>
                      </div>
                    )}

                    {result && result.success && result.data && (
                      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-green-500 p-6 text-white flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-8 h-8" />
                            <div>
                              <h3 className="text-xl font-bold">Registro Localizado</h3>
                              <p className="text-white/80 text-sm">{result.data.message}</p>
                            </div>
                          </div>
                          <div className="hidden md:block">
                            <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                              Sistema Oficial
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nome do Aluno</label>
                                <p className="text-xl font-bold text-gray-900 mt-1">{result.data.aluno}</p>
                              </div>
                              <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Curso</label>
                                <p className="text-lg font-medium text-gray-700 mt-1">{result.data.curso}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-6">
                              <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Status do Certificado</label>
                                <div className="mt-2">
                                  <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold ${
                                    result.data.status === "Concluído" || result.data.status === "Entregue Aluno/Parceiro"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-blue-100 text-amber-700"
                                  }`}>
                                    {result.data.status}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Data de Solicitação</label>
                                <p className="text-lg font-medium text-gray-700 mt-1">{result.data.dataSolicitacao}</p>
                              </div>
                            </div>
                          </div>

                          {/* Download Section if available */}
                          {result.data.arquivos && result.data.arquivos.length > 0 && (
                            <div className="mt-10 pt-8 border-t border-gray-100">
                              <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                Documentos Disponíveis para Download
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {result.data.arquivos.map((file: any, index: number) => (
                                  <a 
                                    key={index}
                                    href={file.urlMachine} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors group"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:text-primary">
                                        <FileText className="w-5 h-5" />
                                      </div>
                                      <span className="text-sm font-bold text-gray-700">Certificado / Diploma #{index + 1}</span>
                                    </div>
                                    <Download className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Aba Validação (Futura) */}
              {activeTab === "validacao" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  {/* Botão Voltar */}
                  <button 
                    onClick={handleBackToMenu}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium mb-6 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </button>

                  <Card className="shadow-xl border-none">
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                        <QrCode className="w-6 h-6 text-[#D4A017]" />
                        Validação de Certificado
                      </CardTitle>
                      <CardDescription>
                        Verifique a autenticidade de um certificado ou diploma LA. Educação
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-12">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-2xl mb-6">
                          <QrCode className="w-12 h-12 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Em Breve</h3>
                        <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
                          O sistema de validação de certificados por QR Code estará disponível em breve. 
                          Você poderá verificar a autenticidade de qualquer certificado ou diploma emitido pela LA. Educação.
                        </p>
                        <div className="mt-8">
                          <span className="inline-flex items-center gap-2 bg-blue-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium">
                            <ShieldCheck className="w-4 h-4" />
                            Funcionalidade em desenvolvimento
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
