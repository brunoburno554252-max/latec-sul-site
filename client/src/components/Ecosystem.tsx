import { Rocket, ShieldCheck, Globe } from "lucide-react";

export default function Ecosystem() {
  const blocks = [
    {
      title: "Expansão Acelerada",
      subtitle: "Crescimento Estratégico",
      desc: "Nossa estrutura permite que você escale seu negócio educacional com velocidade e segurança em qualquer região do país, com suporte completo em todas as etapas.",
      image: "/assets/ecosystem/support-team.jpg",
      icon: <Rocket className="text-white" size={24} />,
      reverse: false
    },
    {
      title: "Credibilidade Consolidada",
      subtitle: "Segurança e Confiança",
      desc: "Faça parte de um ecossistema com marcas reconhecidas nacionalmente e total conformidade com o MEC, garantindo a melhor formação para seus alunos.",
      image: "/assets/ecosystem/instituto-aizu.jpg",
      icon: <ShieldCheck className="text-white" size={24} />,
      reverse: true
    },
    {
      title: "Atuação Nacional",
      subtitle: "Presença em todo o Brasil",
      desc: "Estamos presentes em todos os estados brasileiros, conectando milhares de alunos ao futuro através de uma tecnologia educacional de ponta.",
      image: "/assets/ecosystem/atuacao-nacional.png",
      icon: <Globe className="text-white" size={24} />,
      reverse: false
    }
  ];

  return (
    <section id="ecossistema" className="w-full bg-white">
      {/* Header da Seção */}
      <div className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Por que somos o maior <span className="text-primary">Ecossistema Educacional</span> do Brasil?
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            À disposição de nossos parceiros e alunos, reunimos uma estrutura completa que integra educação, tecnologia, finanças, marketing e impacto social.
          </p>
        </div>
      </div>

      {/* Blocos Alternados */}
      <div className="space-y-32 pb-32">
        {blocks.map((block, index) => (
          <div key={index} className="container mx-auto px-4">
            <div className={`flex flex-col lg:flex-row items-center gap-16 lg:gap-24 ${block.reverse ? 'lg:flex-row-reverse' : ''}`}>
              {/* Imagem */}
              <div className="w-full lg:w-1/2 relative">
                <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                  <img 
                    src={block.image} 
                    alt={block.title} 
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-30"></div>
                </div>
                {/* Elementos Decorativos */}
                <div className={`absolute -bottom-10 ${block.reverse ? '-right-10' : '-left-10'} w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0`}></div>
              </div>

              {/* Texto */}
              <div className="w-full lg:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] flex items-center justify-center shadow-lg shadow-primary/30">
                    {block.icon}
                  </div>
                  <span className="text-primary font-bold tracking-widest text-sm uppercase">{block.subtitle}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-heading font-extrabold text-gray-900 mb-6 leading-tight">
                  {block.title}
                </h3>
                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                  {block.desc}
                </p>
                <div className="h-1.5 w-20 bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
