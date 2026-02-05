import React, { useState } from "react";

const menuItems = [
  { 
    id: "mde", 
    name: "MDE", 
    logo: "/assets/logos-grupo/MDE - PNG.png",
    banner: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1600",
    description: "O MDE (Método de Desenvolvimento Educacional) é o nosso braço focado em metodologias inovadoras de ensino, garantindo que o aprendizado seja eficiente, moderno e focado em resultados reais para o aluno."
  },
  { 
    id: "la-faculdades", 
    name: "LA Faculdades", 
    logo: "/assets/logos-grupo/Logo_LAFACULDADES_principal.png",
    banner: "https://images.unsplash.com/photo-1523050335392-9bc567597280?auto=format&fit=crop&q=80&w=1600",
    description: "A LA Faculdades oferece cursos de graduação e pós-graduação com excelência acadêmica, todos reconhecidos pelo MEC, preparando profissionais para os desafios do mercado de trabalho atual."
  },
  { 
    id: "la-bank", 
    name: "LA Bank", 
    logo: "/assets/logos-grupo/Logo_LABank_Principal.png",
    banner: "https://images.unsplash.com/photo-1550565118-3d1428df732f?auto=format&fit=crop&q=80&w=1600",
    description: "O LA Bank é a nossa solução financeira integrada, facilitando o acesso ao crédito estudantil e oferecendo serviços bancários pensados exclusivamente para o ecossistema educacional."
  },
  { 
    id: "la-tecnologia", 
    name: "LA Tecnologia", 
    logo: "/assets/logos-grupo/LA TECNOLOGIA COLORIDO HORIZONTAL.png",
    banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1600",
    description: "Focada em soluções de ponta, a LA Tecnologia desenvolve as plataformas e ferramentas que sustentam todo o nosso ecossistema, garantindo estabilidade, segurança e inovação constante."
  },
  { 
    id: "latec-sul", 
    name: "LATEC SUL", 
    logo: "/assets/logos-grupo/Logo_LATecSul_Principal.png",
    banner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1600",
    description: "O LATEC SUL é o nosso centro de tecnologia e inovação focado na região Sul do Brasil, adaptando nossas soluções às necessidades específicas do mercado regional."
  },
  { 
    id: "latec", 
    name: "LATEC", 
    logo: "/assets/logos-grupo/Logo_LATec_Principal.png",
    banner: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1600",
    description: "O LATEC é o nosso Laboratório de Tecnologia Educacional, onde pesquisamos e desenvolvemos novas formas de integrar tecnologia ao processo de ensino-aprendizagem."
  },
  { 
    id: "astortc", 
    name: "ASTORTC", 
    logo: "/assets/logos-grupo/AstorTec_Oficial.png",
    banner: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1600",
    description: "A ASTORTC é especializada em treinamentos corporativos e técnicos de alta performance, ajudando empresas a capacitarem seus colaboradores com o que há de mais moderno no setor."
  },
  { 
    id: "capacita", 
    name: "CAPACITA", 
    logo: "/assets/logos-grupo/Design sem nome.png",
    banner: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1600",
    description: "O programa CAPACITA foca em cursos profissionalizantes de curta duração, permitindo uma rápida inserção ou reinserção no mercado de trabalho através de habilidades práticas."
  },
  { 
    id: "aizu", 
    name: "AIZU", 
    logo: "/assets/logos-grupo/Aizul.png",
    banner: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1600",
    description: "O Instituto AIZU é o nosso pilar de impacto social e educação humanizada, focando no desenvolvimento integral do ser humano além das competências técnicas."
  },
];

export default function EcosystemMenu() {
  const [activeTab, setActiveTab] = useState(menuItems[0]);

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

      {/* Menu Rosa Claro */}
      <div className="bg-[#FFF0F5] py-8 border-y border-pink-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-nowrap justify-between items-center gap-4 md:gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item)}
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
                  />
                </div>
                <div className={`mt-2 h-1 w-full rounded-full transition-all duration-300 ${
                  activeTab.id === item.id ? "bg-primary" : "bg-transparent"
                }`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo Dinâmico com Banner de Fundo */}
      <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden" key={activeTab.id}>
        {/* Banner de Fundo com Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={activeTab.banner} 
            alt="Background" 
            className="w-full h-full object-cover animate-in fade-in zoom-in duration-1000"
          />
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
        </div>

        {/* Conteúdo Centralizado */}
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex justify-center mb-10">
              <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100">
                <img 
                  src={activeTab.logo} 
                  alt={activeTab.name} 
                  className="h-24 md:h-32 object-contain"
                />
              </div>
            </div>
            <h3 className="text-3xl md:text-5xl font-heading font-extrabold text-gray-900 mb-8 leading-tight">
              Sobre a <span className="text-primary">{activeTab.name}</span>
            </h3>
            <p className="text-gray-700 text-lg md:text-2xl leading-relaxed font-medium">
              {activeTab.description}
            </p>
            <div className="mt-12 flex justify-center">
              <div className="h-2 w-24 bg-primary rounded-full shadow-lg shadow-primary/20"></div>
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
