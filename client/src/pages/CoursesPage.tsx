import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, Clock, Award } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";

export default function CoursesPage() {
  const searchString = useSearch();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Buscar categorias do banco de dados
  const { data: categoriesFromDb } = trpc.categories.getAll.useQuery();
  const { data: coursesFromDb, isLoading } = trpc.courses.getAll.useQuery();
  
  // Calcular contadores de cursos por categoria
  const categoryCounts = useMemo(() => {
    if (!coursesFromDb) return {};
    
    const counts: Record<string, number> = {
      "Todos": coursesFromDb.length
    };
    
    coursesFromDb.forEach(course => {
      if (course.category) {
        counts[course.category] = (counts[course.category] || 0) + 1;
      }
    });
    
    return counts;
  }, [coursesFromDb]);
  
  // Criar lista de categorias com "Todos" no início
  const categories = ["Todos", ...(categoriesFromDb?.map(c => c.name) || [])];

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const categoryParam = params.get("categoria");
    
    if (categoryParam) {
      switch(categoryParam) {
        case "graduacao-ead":
          setSelectedCategory("Graduação");
          break;
        case "pos-graduacao":
          setSelectedCategory("Pós-Graduação");
          break;
        case "cursos-tecnicos":
          setSelectedCategory("Técnico");
          break;
        case "profissionalizantes":
          setSelectedCategory("Cursos Livres");
          break;
        case "eja":
          setSelectedCategory("EJA");
          break;
        default:
          setSelectedCategory("Todos");
      }
    }
  }, [searchString]);
  
  const filteredCourses = (coursesFromDb || []).filter(course => {
    const matchesCategory = selectedCategory === "Todos" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-[#da1069]/10 to-pink-100 text-[#da1069] px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">Catálogo Completo</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-6 leading-tight">Nossos Cursos</h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Explore nosso catálogo completo e encontre o curso ideal para transformar sua carreira. Todos os cursos são reconhecidos pelo MEC.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white p-8 rounded-3xl shadow-lg border-2 border-gray-100">
            <div className="flex flex-wrap gap-3">
              {categories.map(category => {
                const count = categoryCounts[category] || 0;
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-6 py-2.5 font-bold text-sm transition-all duration-300 ${
                      selectedCategory === category 
                        ? "bg-gradient-to-r from-[#da1069] to-[#3559AC] hover:from-[#da1069]/90 hover:to-pink-600/90 text-white shadow-lg shadow-[#da1069]/30 scale-105" 
                        : "hover:bg-gray-100 hover:border-[#da1069]/30 hover:text-[#da1069]"
                    }`}
                  >
                    {category}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                      selectedCategory === category 
                        ? "bg-white/20" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {count}
                    </span>
                  </Button>
                );
              })}
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input 
                placeholder="Buscar por nome do curso..." 
                className="pl-12 pr-4 py-6 rounded-2xl border-2 border-gray-200 focus:border-[#da1069] focus:ring-2 focus:ring-[#da1069]/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group border-2 border-gray-100 hover:border-[#da1069]/20">
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10"></div>
                  <img 
                    src={course.image || "/placeholder-course.jpg"} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <span className="absolute top-4 right-4 z-20 bg-gradient-to-r from-[#da1069] to-[#3559AC] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                    {course.category}
                  </span>
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Award size={14} className="text-[#da1069]" />
                      <span className="text-xs font-bold text-gray-800">MEC</span>
                    </div>
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#da1069] transition-colors leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100 pt-5 mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#da1069]/10 to-pink-50 flex items-center justify-center">
                        <Clock size={16} className="text-[#da1069]" />
                      </div>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                        <BookOpen size={16} className="text-[#2a468a]" />
                      </div>
                      <span className="font-medium">{course.modality}</span>
                    </div>
                  </div>
                  <Link href={`/cursos/${course.slug}`}>
                    <Button className="w-full bg-gradient-to-r from-[#da1069] to-[#3559AC] hover:from-[#da1069]/90 hover:to-pink-600/90 text-white font-bold rounded-xl py-6 text-base shadow-lg shadow-[#da1069]/30 hover:shadow-xl hover:shadow-[#da1069]/40 transition-all duration-300">
                      VER DETALHES
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-20">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum curso encontrado</h3>
              <p className="text-gray-500">Tente ajustar seus filtros ou busca.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
