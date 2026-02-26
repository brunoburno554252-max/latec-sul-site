import { useState, useMemo } from "react";
import { BookOpen, Monitor, Briefcase, ArrowRight, GraduationCap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

// Icon mapping for categories
const categoryIcons: Record<string, React.ReactNode> = {
  "graduacao-ead": <GraduationCap size={32} className="text-white" />,
  "pos-graduacao": <BookOpen size={32} className="text-white" />,
  "cursos-tecnicos": <Monitor size={32} className="text-white" />,
  "profissionalizantes": <Briefcase size={32} className="text-white" />,
  "eja": <BookOpen size={32} className="text-white" />,
};

// Color mapping for categories
const categoryColors: Record<string, string> = {
  "graduacao-ead": "bg-green-600",
  "pos-graduacao": "bg-green-600",
  "cursos-tecnicos": "bg-[#B8860B]",
  "profissionalizantes": "bg-orange-500",
  "eja": "bg-amber-600",
};

export default function CourseList() {
  const { data: coursesData = [], isLoading: loadingCourses } = trpc.courses.getAll.useQuery();
  const { data: dbCategories = [], isLoading: loadingCategories } = trpc.home.getCategories.useQuery();

  // Helper function to count courses by category name
  const getCourseCount = (categoryName: string) => {
    return coursesData.filter((c: any) => 
      c.category === categoryName && c.isActive
    ).length;
  };

  const isLoading = loadingCourses || loadingCategories;

  // Filter categories: only show those with image AND at least one course
  const displayCategories = useMemo(() => {
    return dbCategories
      .filter((cat: any) => cat.image) // Only categories with image
      .map((dbCat: any) => {
        const courseCount = getCourseCount(dbCat.name);
        return {
          id: dbCat.id,
          title: dbCat.name,
          description: dbCat.description || "Explore nossos cursos nesta categoria",
          icon: categoryIcons[dbCat.slug] || <BookOpen size={32} className="text-white" />,
          color: categoryColors[dbCat.slug] || "bg-primary",
          image: dbCat.image,
          link: `/cursos?categoria=${dbCat.slug}`,
          slug: dbCat.slug,
          courseCount: courseCount
        };
      })
      .sort((a: any, b: any) => b.courseCount - a.courseCount); // Sort by course count descending
  }, [dbCategories, coursesData]);

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

  // Don't render section if no categories with images
  if (displayCategories.length === 0) {
    return null;
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
          {displayCategories.map((category: any) => (
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
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute top-4 right-4 w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center shadow-lg z-20 group-hover:rotate-12 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="text-white/90 text-sm font-bold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      {category.courseCount} Curso{category.courseCount !== 1 ? 's' : ''}
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
            <Button size="lg" className="bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] hover:from-[#146B2F] hover:to-[#B8860B]/90 text-white font-bold px-10 h-14 rounded-full shadow-lg shadow-[#D4A017]/30 transition-all hover:scale-105">
              VER CATÁLOGO COMPLETO
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
