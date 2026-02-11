import { useState, useEffect } from "react";
import { Search, CheckCircle2, XCircle, AlertCircle, Loader2, Building2, Sparkles, ChevronRight, User, FileText, Hash } from "lucide-react";
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
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#da1069] to-[#3559AC] py-16 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Consulte Nossos Parceiros
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Verifique se o seu polo de ensino é oficialmente credenciado pela LA. Educação
            </p>
          </div>
        </section>

        {/* Seção de Busca */}
        <section className="py-12 md:py-20 bg-gray-50 -mt-10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Card de Busca */}
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#da1069]/10 to-[#da1069]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Search className="w-6 h-6 text-[#da1069]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Buscar Parceiro</h2>
                    <p className="text-sm text-gray-500">Digite pelo menos 3 caracteres para iniciar</p>
                  </div>
                </div>
                
                {/* Campo de Busca */}
                <div className="relative mt-6">
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <div className="w-12 h-12 ml-1 bg-gradient-to-br from-[#da1069] to-[#9b1b8e] rounded-full flex items-center justify-center">
                      {isLoading || isTyping ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      ) : (
                        <Search className="w-5 h-5 text-white" />
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Nome, CNPJ/CPF ou ID do Parceiro..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-16 pr-12 py-4 border-2 border-gray-200 rounded-full text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#da1069] focus:ring-0 transition-all"
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

                {/* Dicas de busca */}
                <div className="flex flex-wrap gap-3 mt-5 justify-center">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
                    <div className="w-8 h-8 bg-[#da1069]/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-[#da1069]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Por Nome</p>
                      <p className="text-xs text-gray-400">Ex: ECID</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
                    <div className="w-8 h-8 bg-[#da1069]/10 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[#da1069]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Por CNPJ/CPF</p>
                      <p className="text-xs text-gray-400">Ex: 12.345.678/0001-00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
                    <div className="w-8 h-8 bg-[#da1069]/10 rounded-full flex items-center justify-center">
                      <Hash className="w-4 h-4 text-[#da1069]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Por ID</p>
                      <p className="text-xs text-gray-400">Ex: 537</p>
                    </div>
                  </div>
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
                <div className="mt-8 space-y-6">
                  {isLoading ? (
                    <div className="text-center py-10">
                      <Loader2 className="w-10 h-10 text-[#da1069] animate-spin mx-auto mb-4" />
                      <p className="text-gray-500">Consultando base de dados...</p>
                    </div>
                  ) : error ? (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
                      <p className="text-red-600 font-medium">Ocorreu um erro ao realizar a consulta. Tente novamente em instantes.</p>
                    </div>
                  ) : filteredResults.length > 0 ? (
                    <>
                      {/* Contador de resultados */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#da1069]/10 to-purple-100 rounded-full flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-[#da1069]" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900">
                            {filteredResults.length} resultado{filteredResults.length !== 1 ? 's' : ''}
                          </p>
                          <p className="text-sm text-gray-500">para "{debouncedTerm}"</p>
                        </div>
                      </div>

                      {/* Cards de resultado */}
                      <div className="grid grid-cols-1 gap-5">
                        {filteredResults.map((licenciado: any) => (
                          <div key={licenciado.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Header verde */}
                            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 flex items-center gap-2">
                              <CheckCircle2 className="w-5 h-5 text-white" />
                              <span className="text-white font-semibold text-sm">Parceiro Credenciado e Autorizado</span>
                            </div>
                            
                            {/* Conteúdo */}
                            <div className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900">{licenciado.nome}</h3>
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <ChevronRight className="w-5 h-5 text-gray-400" />
                                </div>
                              </div>
                              
                              {/* Dados em colunas */}
                              <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">ID do Parceiro</p>
                                  <p className="text-lg font-bold text-emerald-600">{licenciado.id}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">CNPJ/CPF</p>
                                  <p className="text-base font-mono font-medium text-gray-800">{licenciado.cnpj_cpf}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
                      <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhum parceiro encontrado</h3>
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
