import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingUp, DollarSign, Users, Package, Clock, Headphones, BookOpen, Award } from "lucide-react";
import { trpc } from "@/lib/trpc";

// Mapa de ícones disponíveis
const iconMap: Record<string, any> = {
  DollarSign,
  Package,
  Clock,
  TrendingUp,
  Users,
  CheckCircle2,
  Headphones,
  BookOpen,
  Award,
};

export default function About() {
  // Buscar configurações da seção About do banco
  const { data: aboutSettings = [] } = trpc.home.getHomeSection.useQuery({ section: "about" });
  // Buscar diferenciais do banco
  const { data: diferenciais = [] } = trpc.home.getDiferenciais.useQuery();

  // Função auxiliar para pegar valor de um campo
  const getFieldValue = (field: string, defaultValue: string = "") => {
    const item = (aboutSettings as any[]).find((s: any) => s.field === field);
    return item?.value || defaultValue;
  };

  // Valores do banco (SEM fallback - se vazio, fica vazio)
  const title = getFieldValue("title");
  const subtitle = getFieldValue("subtitle");
  const description = getFieldValue("description");
  const sectionTitle = getFieldValue("section_title");
  
  // IMAGEM - puxar do banco
  const sectionImage = getFieldValue("image");
  
  // CONTADOR - puxar do banco
  const counterNumber = getFieldValue("counter_number");
  const counterText = getFieldValue("counter_text");
  
  // BOTÃO - puxar do banco
  const buttonText = getFieldValue("button_text");
  const buttonLink = getFieldValue("button_link");

  // Usar diferenciais do banco ou fallback
  const benefits = (diferenciais as any[]).length > 0
    ? (diferenciais as any[]).map((d: any) => {
        const IconComponent = iconMap[d.icon] || CheckCircle2;
        return {
          icon: <IconComponent className="text-white" size={20} />,
          title: d.title,
          desc: d.description,
        };
      })
    : [
        {
          icon: <DollarSign className="text-white" size={20} />,
          title: "REPASSE",
          desc: "Possibilitamos LUCROS de até 1000%."
        },
        {
          icon: <Package className="text-white" size={20} />,
          title: "CATÁLOGO",
          desc: "Temos hoje o MAIOR catálogo para revenda de cursos do Brasil, com quase 4.000 opções de todas as modalidades."
        },
        {
          icon: <Clock className="text-white" size={20} />,
          title: "FLUXO DE CAIXA",
          desc: "Parceiro recebe e repassa, aqui o parceiro não precisa aguardar mais de 30 dias para receber."
        },
        {
          icon: <TrendingUp className="text-white" size={20} />,
          title: "PRECIFICAÇÃO",
          desc: "Parceiro tem total autonomia, para precificar, pois aqui ele é dono do seu próprio negócio."
        },
        {
          icon: <Users className="text-white" size={20} />,
          title: "CONSULTORIA COMERCIAL/MARKETING",
          desc: "Trabalhamos com gestores regionais, altamente capacitados para prestar consultoria gratuita aos parceiros."
        }
      ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          {/* Image Composition */}
          <div className="w-full lg:w-1/2 relative order-2 lg:order-1">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src={sectionImage} 
                alt="Sede da LATec Sul" 
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-60"></div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-accent/30 rounded-full blur-3xl z-0"></div>
            <div className="absolute -top-10 -right-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl z-0"></div>
            
            {/* Floating Stat Card */}
            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 z-20 hidden md:block animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 max-w-xs">
              <div className="flex flex-col gap-2">
                <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#1B8C3D] to-[#D4A017]">
                  {counterNumber}
                </span>
                <span className="text-gray-600 font-bold text-lg leading-tight">
                  {counterText}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            {title && (
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 mb-8 leading-tight">
                {title.split(/(Empresários Educacionais:|rentabilidade)/g).map((part, i) => {
                  if (part === "Empresários Educacionais:" || part === "rentabilidade") {
                    return <span key={i} className="text-primary">{part}</span>;
                  }
                  return part;
                })}
              </h2>
            )}
            
            {subtitle && (
              <p className="text-gray-700 text-lg mb-4 leading-relaxed font-semibold">
                {subtitle}
              </p>
            )}

            {description && (
              <p className="text-gray-600 text-lg mb-10 leading-relaxed">
                {description}
              </p>
            )}

            {sectionTitle && (
              <h3 className="text-xl font-bold text-primary mb-6">
                {sectionTitle}
              </h3>
            )}

            {/* Grid de 2 colunas para os diferenciais */}
            <div className="grid grid-cols-2 gap-5 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B8C3D] to-[#D4A017] flex items-center justify-center shrink-0 shadow-md shadow-accent/30 group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-0.5">{benefit.title}</h4>
                    <p className="text-xs text-gray-600">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {buttonText && buttonLink && (
              <Button 
                className="bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] hover:opacity-90 text-white font-bold px-10 h-16 rounded-full shadow-xl shadow-[#D4A017]/30 transition-all hover:-translate-y-1 w-full sm:w-auto text-lg"
                onClick={() => window.location.href = buttonLink}
              >
                {buttonText}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
