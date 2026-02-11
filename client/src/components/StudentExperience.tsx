import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Video, BookOpen, Award, Users, Clock, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

// Mapa de ícones disponíveis
const iconMap: Record<string, any> = {
  Monitor,
  Smartphone,
  Video,
  BookOpen,
  Award,
  Users,
  Clock,
  CheckCircle2,
};

export default function StudentExperience() {
  // Buscar configurações da seção Student Experience do banco
  const { data: studentSettings = [] } = trpc.home.getHomeSection.useQuery({ section: "student_experience" });
  // Buscar features da plataforma do banco
  const { data: platformFeaturesData = [] } = trpc.home.getPlatformFeatures.useQuery();

  // Função auxiliar para pegar valor de um campo
  const getFieldValue = (field: string, defaultValue: string = "") => {
    const item = (studentSettings as any[]).find((s: any) => s.field === field);
    return item?.value || defaultValue;
  };

  // Valores padrão (fallback)
  const label = getFieldValue("label", "EXPERIÊNCIA DO ALUNO");
  const title = getFieldValue("title", "Plataforma intuitiva e repleta de recursos");
  const description = getFieldValue("description", "Seus alunos terão acesso a uma plataforma moderna, extremamente fácil de usar e com inúmeras vantagens que transformam o aprendizado em uma experiência envolvente e eficiente.");

  // Usar features do banco ou fallback
  const platformFeatures = (platformFeaturesData as any[]).length > 0
    ? (platformFeaturesData as any[]).map((f: any) => {
        const IconComponent = iconMap[f.icon] || CheckCircle2;
        return {
          icon: <IconComponent className="text-white" size={20} />,
          title: f.title,
          desc: f.description,
        };
      })
    : [
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
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Seção da Plataforma para Alunos - Layout Invertido */}
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          {/* Content (Now Left on Desktop) */}
          <div className="w-full lg:w-1/2 order-1">
            <span className="text-accent font-bold tracking-widest text-sm uppercase mb-3 block">{label}</span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 mb-8 leading-tight">
              {title.split(/(intuitiva)/gi).map((part, i) => {
                if (part.toLowerCase() === "intuitiva") {
                  return <span key={i} className="text-accent">{part}</span>;
                }
                return part;
              })}
            </h2>
            
            <p className="text-gray-600 text-lg mb-10 leading-relaxed">
              {description}
            </p>

            <div className="grid grid-cols-2 gap-5 mb-12">
              {platformFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#da1069] to-[#3559AC] flex items-center justify-center shrink-0 shadow-md shadow-accent/30 group-hover:scale-110 transition-transform duration-300">
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
              className="bg-gradient-to-r from-[#da1069] to-[#3559AC] hover:opacity-90 text-white font-bold px-10 h-16 rounded-full shadow-xl shadow-[#3559AC]/30 transition-all hover:-translate-y-1 w-full sm:w-auto text-lg"
              onClick={() => window.location.href = '/cursos'}
            >
              CONHECER CURSOS
            </Button>
          </div>

          {/* Image (Now Right on Desktop) */}
          <div className="w-full lg:w-1/2 relative order-2">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="/images/plataforma-alunos.jpg" 
                alt="Plataforma de Estudos LA Educação" 
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-accent/60 to-transparent opacity-30"></div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-accent/30 rounded-full blur-3xl z-0"></div>
            <div className="absolute -top-10 -left-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl z-0"></div>
            
            {/* Floating Badge - Students Count */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 z-20 hidden md:block animate-in fade-in slide-in-from-left-4 duration-1000 delay-300">
              <div className="flex flex-col items-center text-center">
                {/* Student Avatars */}
                <div className="flex -space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#da1069] to-[#3559AC] border-2 border-white flex items-center justify-center overflow-hidden">
                    <Users className="text-white" size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-[#2a468a] border-2 border-white flex items-center justify-center overflow-hidden">
                    <Users className="text-white" size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white flex items-center justify-center overflow-hidden">
                    <Users className="text-white" size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white flex items-center justify-center overflow-hidden">
                    <Users className="text-white" size={18} />
                  </div>
                </div>
                {/* Count */}
                <p className="text-2xl font-extrabold bg-gradient-to-r from-[#da1069] to-[#3559AC] bg-clip-text text-transparent mb-1">+15000</p>
                <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">ALUNOS</p>
                <p className="text-xs text-gray-500 mt-1">Transformando vidas</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
