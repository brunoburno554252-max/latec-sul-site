import React, { useState, useEffect } from "react";

// Mapeamento das chaves do JSON para os IDs usados no menu
const menuMapping = [
  { id: "mde", key: "mde" },
  { id: "la-faculdades", key: "faculdade_la" },
  { id: "la-bank", key: "la_bank" },
  { id: "la-tecnologia", key: "la_tecnologia" },
  { id: "latec-sul", key: "la_tec_sul" },
  { id: "latec", key: "la_tec" },
  { id: "astortc", key: "astor_tec" },
  { id: "capacita", key: "capacita_cidade" },
  { id: "aizu", key: "izul" },
];

// Fallback para banners caso não estejam definidos no banco
const bannerFallbacks: Record<string, string> = {
  mde: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1600",
  faculdade_la: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1600",
  la_bank: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1600",
  la_tecnologia: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600",
  la_tec_sul: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1600",
  la_tec: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1600",
  astor_tec: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600",
  capacita_cidade: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1600",
  izul: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600",
};

// Fallback para logos (caminhos locais)
const logoFallbacks: Record<string, string> = {
  mde: "/assets/logos-grupo/MDE - PNG.png",
  faculdade_la: "/assets/logos-grupo/Logo_LAFACULDADES_principal.png",
  la_bank: "/assets/logos-grupo/Logo_LABank_Principal.png",
  la_tecnologia: "/assets/logos-grupo/LA TECNOLOGIA COLORIDO HORIZONTAL.png",
  la_tec_sul: "/assets/logos-grupo/Logo_LATecSul_Principal.png",
  la_tec: "/assets/logos-grupo/Logo_LATec_Principal.png",
  astor_tec: "/assets/logos-grupo/AstorTec_Oficial.png",
  capacita_cidade: "/assets/logos-grupo/Design sem nome.png",
  izul: "/assets/logos-grupo/Aizul.png",
};

interface MenuItem {
  id: string;
  key: string;
  name: string;
  logo: string;
  banner: string;
  description: string;
  website: string;
}

export default function EcosystemMenu() {
  const [instituicoesInfo, setInstituicoesInfo] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTabId, setActiveTabId] = useState(menuMapping[0].id);

  // Carregar dados das instituições do banco de dados
  useEffect(() => {
    async function loadInstitutions() {
      try {
        const response = await fetch("/api/ecosystem/institutions");
        if (response.ok) {
          const data = await response.json();
          setInstituicoesInfo(data);
        }
      } catch (error) {
        console.error("Erro ao carregar instituições:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadInstitutions();
  }, []);

  // Processar os itens do menu a partir dos dados do banco
  const menuItems: MenuItem[] = menuMapping.map(item => {
    const data = instituicoesInfo[item.key];
    return {
      id: item.id,
      key: item.key,
      name: data?.nome || item.id.toUpperCase(),
      logo: data?.fotos?.[0] || logoFallbacks[item.key],
      banner: data?.banner || bannerFallbacks[item.key],
      description: data?.descricao || "Descrição em breve.",
      website: data?.website || ""
    };
  });

  // Encontrar o item ativo atualizado
  const activeTab = menuItems.find(item => item.id === activeTabId) || menuItems[0];

  return (
    <section id="ecossistema" className="w-full bg-white overflow-hidden">
      {/* Header da Seção */}
      <div className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Por que somos o maior <span className="text-primary">Ecossistema Educacional</span> do Brasil?
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            À disposição de nossos parceiros e alunos, reunimos uma estrutura completa que integra educação, tecnologia, finanças, marketing e impacto social, tudo dentro de um único ecossistema.
          </p>
        </div>
      </div>

      {/* Seta Animada */}
      <div className="flex justify-center py-4 bg-white">
        <svg 
          className="w-6 h-6 text-primary animate-bounce" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      {/* Menu Rosa Claro */}
      <div className="bg-[#F0FFF4] py-8 border-y border-green-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-nowrap justify-between items-center gap-4 md:gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTabId(item.id)}
                className={`group flex flex-col items-center transition-all duration-300 hover:scale-110 flex-shrink-0 outline-none ${
                  activeTab.id === item.id ? "scale-110" : "opacity-70 hover:opacity-100"
                }`}
              >
                <div className="h-14 md:h-20 lg:h-24 w-auto flex items-center justify-center px-2">
                  <img
                    src={item.logo}
                    alt={item.name}
                    className={`max-h-full w-auto object-contain transition-all duration-500 ${
                      activeTab.id === item.id ? "drop-shadow-md" : "drop-shadow-sm"
                    }`}
                    onError={(e) => {
                      // Fallback se a imagem não carregar
                      const target = e.target as HTMLImageElement;
                      if (logoFallbacks[item.key] && target.src !== logoFallbacks[item.key]) {
                        target.src = logoFallbacks[item.key];
                      }
                    }}
                  />
                </div>
                <div className={`mt-2 h-1 w-full rounded-full transition-all duration-300 ${
                  activeTab.id === item.id ? "bg-gradient-to-r from-[#1B8C3D] to-[#D4A017]" : "bg-transparent"
                }`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo Dinâmico com Banner de Fundo Real */}
      <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden" key={activeTab.id}>
        {/* Banner de Fundo com Overlay Gradiente */}
        <div className="absolute inset-0 z-0">
          <img 
            src={activeTab.banner} 
            alt="Background" 
            className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (bannerFallbacks[activeTab.key] && target.src !== bannerFallbacks[activeTab.key]) {
                target.src = bannerFallbacks[activeTab.key];
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/95 backdrop-blur-[2px]"></div>
        </div>

        {/* Conteúdo Centralizado */}
        <div className="container mx-auto px-4 relative z-10 py-24">
          <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-12 duration-700">
            <div className="flex justify-center mb-12">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100/50 backdrop-blur-md">
                <img 
                  src={activeTab.logo} 
                  alt={activeTab.name} 
                  className="h-28 md:h-40 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (logoFallbacks[activeTab.key] && target.src !== logoFallbacks[activeTab.key]) {
                      target.src = logoFallbacks[activeTab.key];
                    }
                  }}
                />
              </div>
            </div>
            <h3 className="text-4xl md:text-6xl font-heading font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
              Sobre a <span className="text-primary">{activeTab.name}</span>
            </h3>
            <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/50 shadow-xl">
              <p className="text-gray-800 text-xl md:text-3xl leading-relaxed font-medium">
                {activeTab.description}
              </p>
            </div>
            {activeTab.website && (
              <div className="mt-10">
                <a 
                  href={activeTab.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] hover:from-[#146B2F] hover:to-[#B8860B]/90 text-white font-semibold px-8 py-4 rounded-full shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105"
                >
                  Conhecer mais
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            )}
            <div className="mt-10 flex justify-center">
              <div className="h-2.5 w-32 bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] rounded-full shadow-xl shadow-primary/30"></div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}
