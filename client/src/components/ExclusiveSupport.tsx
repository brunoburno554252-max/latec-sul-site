import { Button } from "@/components/ui/button";
import { Headphones, Clock, Shield, Sparkles, Monitor, Smartphone, Video, BookOpen, Award, Users } from "lucide-react";

export default function ExclusiveSupport() {
  const supportFeatures = [
    {
      icon: <Headphones className="text-white" size={24} />,
      title: "Atendimento Personalizado",
      desc: "Central exclusiva dedicada apenas aos nossos parceiros licenciados."
    },
    {
      icon: <Clock className="text-white" size={24} />,
      title: "Suporte Prioritário",
      desc: "Respostas rápidas e soluções ágeis para suas necessidades."
    },
    {
      icon: <Shield className="text-white" size={24} />,
      title: "Acompanhamento Contínuo",
      desc: "Equipe especializada monitora seu crescimento e oferece orientação estratégica."
    },
    {
      icon: <Sparkles className="text-white" size={24} />,
      title: "Treinamento Exclusivo",
      desc: "Capacitação constante para você e sua equipe dominarem as melhores práticas."
    }
  ];

  const platformFeatures = [
    {
      icon: <Monitor className="text-white" size={20} />,
      title: "Interface Intuitiva",
      desc: "Navegação simples e clara."
    },
    {
      icon: <Smartphone className="text-white" size={20} />,
      title: "Multiplataforma",
      desc: "Acesso em qualquer dispositivo."
    },
    {
      icon: <Video className="text-white" size={20} />,
      title: "Aulas ao Vivo",
      desc: "Interação em tempo real."
    },
    {
      icon: <BookOpen className="text-white" size={20} />,
      title: "Material Completo",
      desc: "PDFs, slides e exercícios."
    },
    {
      icon: <Award className="text-white" size={20} />,
      title: "Progresso Visual",
      desc: "Acompanhe seu desempenho."
    },
    {
      icon: <Users className="text-white" size={20} />,
      title: "Fóruns Ativos",
      desc: "Comunidade engajada."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-primary/5 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Seção de Suporte aos Licenciados */}
        <div className="flex flex-col lg:flex-row items-center gap-20 mb-32">
          {/* Content */}
          <div className="w-full lg:w-1/2">
            <span className="text-primary font-bold tracking-widest text-sm uppercase mb-3 block">Suporte Exclusivo</span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 mb-8 leading-tight">
              Uma equipe <span className="text-primary">dedicada</span> ao seu sucesso
            </h2>
            
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Nossos parceiros licenciados contam com uma central de atendimento personalizada, totalmente focada em oferecer suporte estratégico, operacional e comercial para maximizar seus resultados.
            </p>

            <div className="space-y-6 mb-12">
              {supportFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1B8C3D] to-[#D4A017] flex items-center justify-center shrink-0 shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              className="bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] hover:opacity-90 text-white font-bold px-10 h-16 rounded-full shadow-xl shadow-[#D4A017]/30 transition-all hover:-translate-y-1 w-full sm:w-auto text-lg"
              onClick={() => window.location.href = '/parceiro'}
            >
              QUERO ESSE SUPORTE
            </Button>
          </div>

          {/* Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="/images/central-atendimento-v2.jpg" 
                alt="Central de Atendimento LA Educação" 
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-40"></div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/30 rounded-full blur-3xl z-0"></div>
            <div className="absolute -top-10 -left-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl z-0"></div>
            
            {/* Floating Badge */}
            <div className="absolute -top-6 -left-6 bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 z-20 hidden md:block animate-in fade-in slide-in-from-left-4 duration-1000 delay-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <Headphones className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Disponível</p>
                  <p className="text-xs text-gray-500">24/7 para você</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção da Plataforma para Alunos */}
        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* Image */}
          <div className="w-full lg:w-1/2 relative order-2 lg:order-1">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="/images/plataforma-alunos.jpg" 
                alt="Plataforma de Estudos LA Educação" 
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/60 to-transparent opacity-30"></div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent/30 rounded-full blur-3xl z-0"></div>
            <div className="absolute -top-10 -right-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl z-0"></div>
            
            {/* Floating Badge - Students Count */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 z-20 hidden md:block animate-in fade-in slide-in-from-right-4 duration-1000 delay-300">
              <div className="flex flex-col items-center text-center">
                {/* Student Avatars */}
                <div className="flex -space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B8C3D] to-[#D4A017] border-2 border-white flex items-center justify-center overflow-hidden">
                    <Users className="text-white" size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-[#B8860B] border-2 border-white flex items-center justify-center overflow-hidden">
                    <Users className="text-white" size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white flex items-center justify-center overflow-hidden">
                    <Users className="text-white" size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white flex items-center justify-center overflow-hidden">
                    <Users className="text-white" size={18} />
                  </div>
                </div>
                {/* Count */}
                <p className="text-2xl font-extrabold bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] bg-clip-text text-transparent mb-1">+15000</p>
                <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">ALUNOS</p>
                <p className="text-xs text-gray-500 mt-1">Transformando vidas</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <span className="text-accent font-bold tracking-widest text-sm uppercase mb-3 block">Experiência do Aluno</span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 mb-8 leading-tight">
              Plataforma <span className="text-accent">intuitiva</span> e repleta de recursos
            </h2>
            
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              Seus alunos terão acesso a uma plataforma moderna, extremamente fácil de usar e com inúmeras vantagens que transformam o aprendizado em uma experiência envolvente e eficiente.
            </p>

            <div className="grid grid-cols-2 gap-5 mb-12">
              {platformFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B8C3D] to-[#D4A017] flex items-center justify-center shrink-0 shadow-md shadow-accent/30 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-0.5">{feature.title}</h4>
                    <p className="text-xs text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              className="bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] hover:opacity-90 text-white font-bold px-10 h-16 rounded-full shadow-xl shadow-[#D4A017]/30 transition-all hover:-translate-y-1 w-full sm:w-auto text-lg"
              onClick={() => window.location.href = '/cursos'}
            >
              CONHECER CURSOS
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
