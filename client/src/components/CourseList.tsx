import { useState } from "react";
import { BookOpen, Monitor, Briefcase, ArrowRight, GraduationCap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const categories = [
  {
    id: 1,
    title: "Graduação EAD",
    description: "Flexibilidade total para conquistar seu diploma superior reconhecido pelo MEC.",
    icon: <GraduationCap size={32} className="text-white" />,
    color: "bg-pink-600",
    image: "/images/course-law.jpg",
    link: "/cursos?categoria=graduacao-ead",
    types: ["Bacharelado", "Licenciatura"]
  },
  {
    id: 2,
    title: "Pós-Graduação",
    description: "Especialize-se e destaque-se no mercado de trabalho com cursos de excelência.",
    icon: <BookOpen size={32} className="text-white" />,
    color: "bg-pink-600",
    image: "/images/course-health.jpg",
    link: "/cursos?categoria=pos-graduacao",
    types: ["Pós-Graduação"]
  },
  {
    id: 3,
    title: "Cursos Técnicos",
    description: "Formação rápida e prática para ingressar imediatamente na profissão.",
    icon: <Monitor size={32} className="text-white" />,
    color: "bg-[#2a468a]",
    image: "/images/course-engineering.jpg",
    link: "/cursos?categoria=cursos-tecnicos",
    types: ["Tecnólogo"]
  },
  {
    id: 4,
    title: "Profissionalizantes",
    description: "Desenvolva habilidades específicas e turbine seu currículo em pouco tempo.",
    icon: <Briefcase size={32} className="text-white" />,
    color: "bg-orange-500",
    image: "/images/hero-students.jpg",
    link: "/cursos?categoria=profissionalizantes",
    types: ["Cursos Livres"]
  }
];

export default function CourseList() {
  const { data: coursesData = [], isLoading } = trpc.courses.getAll.useQuery();

  // Helper function to count courses by category
  const getCourseCount = (categoryTypes: string[]) => {
    return coursesData.filter((c: any) => categoryTypes.includes(c.type)).length;
  };

  const totalCourses = coursesData.length;

  if (isLoading) {
    return (
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-bold tracking-widest text-sm uppercase mb-3 block">Catálogo Exclusivo</span>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 mb-6">
            Explore <span className="text-primary">milhares de cursos</span> em diversas áreas
          </h2>
          <p className="text-gray-600 text-lg">
            Do técnico à pós-graduação, temos a formação ideal para impulsionar sua carreira ou o seu negócio educacional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link key={category.id} href={category.link}>
              <div 
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 cursor-pointer h-full flex flex-col"
              >
                {/* Image Header */}
                <div className="h-48 overflow-hidden relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute top-4 right-4 w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center shadow-lg z-20 group-hover:rotate-12 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="text-white/90 text-sm font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      {getCourseCount(category.types)} Cursos
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-heading font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-500 mb-6 leading-relaxed text-sm flex-grow">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center text-primary font-bold text-sm group/link mt-auto">
                    VER OPÇÕES 
                    <ArrowRight size={16} className="ml-2 transition-transform group-hover/link:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/cursos">
            <Button size="lg" className="bg-gradient-to-r from-[#da1069] to-[#3559AC] hover:from-[#c4105e] hover:to-[#2a468a]/90 text-white font-bold px-10 h-14 rounded-full shadow-lg shadow-[#3559AC]/30 transition-all hover:scale-105">
              VER CATÁLOGO COMPLETO
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
