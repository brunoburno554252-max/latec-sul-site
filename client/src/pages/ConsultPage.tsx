import { useState, useEffect } from "react";
import { Search, CheckCircle2, XCircle, MapPin, Phone, Mail, AlertCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ConsultPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setIsTyping(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  const shouldSearch = debouncedTerm.trim().length >= 3;
  
  const { data, isLoading, error } = trpc.licenciados.search.useQuery(
    { term: debouncedTerm },
    { 
      enabled: shouldSearch,
      retry: 1,
      refetchOnWindowFocus: false
    }
  );
  
  const filteredResults = data?.data || [];
  const showResults = shouldSearch;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1">
        {/* Barra Rosa de Título */}
        <div className="bg-gradient-to-r from-[#da1069] to-[#3559AC] py-6 shadow-md">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
              Consulte Polo Parceiro
            </h1>
          </div>
        </div>

        {/* Seção de Busca Simplificada */}
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Card de Busca */}
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
                <div className="text-center mb-10">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                    Verifique suas credenciais LA Educação
                  </h2>
                  <p className="text-gray-500">
                    Busque por nome, CNPJ, ID ou código do polo
                  </p>
                </div>
                
                {/* Campo de Busca */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {isLoading || isTyping ? (
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    ) : (
                      <Search className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Digite aqui para buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-0 transition-all"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm("")}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <XCircle className="w-6 h-6 text-gray-300 hover:text-gray-500 transition-colors" />
                    </button>
                  )}
                </div>

                {/* Mensagem de Ajuda */}
                {!showResults && searchTerm.length > 0 && searchTerm.length < 3 && (
                  <div className="mt-4 flex items-center gap-2 text-amber-600 justify-center">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Digite pelo menos 3 caracteres</span>
                  </div>
                )}
              </div>

              {/* Resultados da Busca */}
              {showResults && (
                <div className="mt-10 space-y-6">
                  {isLoading ? (
                    <div className="text-center py-10">
                      <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                      <p className="text-gray-500">Consultando base de dados...</p>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
                      <p className="text-red-600 font-medium">Ocorreu um erro ao realizar a consulta.</p>
                    </div>
                  ) : filteredResults.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredResults.map((licenciado: any) => (
                        <div key={licenciado.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="bg-green-100 p-2 rounded-full">
                              <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">{licenciado.nome}</h3>
                              <p className="text-sm text-gray-500 font-mono">{licenciado.cnpj_cpf}</p>
                              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {licenciado.polo}</span>
                                {licenciado.telefone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {licenciado.telefone}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase">
                              Credenciado Ativo
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
                      <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhum polo encontrado</h3>
                      <p className="text-gray-500">Verifique os dados digitados e tente novamente.</p>
                    </div>
                  )}
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
