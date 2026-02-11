import React, { useState } from 'react';
import { useParams, Link } from 'wouter';
import { trpc } from '../lib/trpc';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Calendar, 
  GraduationCap, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  BookOpen,
  Briefcase,
  Target,
  ChevronDown,
  ChevronUp,
  Loader2,
  FileText,
  Laptop
} from 'lucide-react';
import { cn } from '../lib/utils';

export function CourseDetailsPage() {
  const params = useParams();
  const slug = params.slug;
  
  // Buscar curso do banco de dados
  const { data: course, isLoading, error } = trpc.courses.getBySlug.useQuery(
    { slug: slug || '' },
    { enabled: !!slug }
  );
  
  const [activeTab, setActiveTab] = useState<'details' | 'curriculum'>('details');
  const [openPeriod, setOpenPeriod] = useState<number | null>(0);

  const togglePeriod = (index: number) => {
    setOpenPeriod(openPeriod === index ? null : index);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#da1069] mx-auto mb-4" />
            <p className="text-gray-600">Carregando curso...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error or not found
  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Curso não encontrado</h1>
            <Link href="/cursos" className="text-[#da1069] hover:underline">
              Voltar para lista de cursos
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Agrupar disciplinas por semestre
  const curriculumBySemester = course.curriculum?.reduce((acc: any[], subject: any) => {
    const semester = subject.semester;
    if (!acc[semester - 1]) {
      acc[semester - 1] = {
        period: `${semester}º Semestre`,
        subjects: []
      };
    }
    acc[semester - 1].subjects.push({
      name: subject.subjectName,
      hours: subject.workload,
      description: subject.description
    });
    return acc;
  }, []) || [];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-[#da1069] text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-sm mb-4 opacity-80">
            <Link href="/" className="hover:underline">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/cursos" className="hover:underline">Cursos</Link>
            <ChevronRight className="w-4 h-4" />
            <span>{course.name}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.name}</h1>
          <div className="flex flex-wrap gap-4">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {course.modality}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {course.type}
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Imagem do Curso */}
            {course.image && (
              <div className="rounded-2xl overflow-hidden shadow-lg h-64 md:h-80 w-full">
                <img 
                  src={course.image} 
                  alt={course.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Navegação por Abas */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-2 bg-gray-50/50 border-b border-gray-100">
                <div className="flex p-1 bg-gray-100/80 rounded-xl">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={cn(
                      "flex-1 py-3 px-6 text-sm font-bold rounded-lg transition-all duration-300 shadow-sm",
                      activeTab === 'details' 
                        ? "bg-white text-[#da1069] shadow-md transform scale-[1.02]" 
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 shadow-none"
                    )}
                  >
                    Detalhes do Curso
                  </button>
                  <button
                    onClick={() => setActiveTab('curriculum')}
                    className={cn(
                      "flex-1 py-3 px-6 text-sm font-bold rounded-lg transition-all duration-300 shadow-sm",
                      activeTab === 'curriculum' 
                        ? "bg-white text-[#da1069] shadow-md transform scale-[1.02]" 
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 shadow-none"
                    )}
                  >
                    Grade Curricular
                  </button>
                </div>
              </div>

              <div className="p-6 md:p-10">
                {activeTab === 'details' ? (
                  <div className="space-y-8 animate-in fade-in duration-300">
                    {/* Sobre o Curso */}
                    {course.description && (
                      <section>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <BookOpen className="w-6 h-6 text-[#da1069]" />
                          Sobre o Curso
                        </h3>
                        <div 
                          className="text-gray-600 leading-relaxed text-lg prose prose-lg max-w-none"
                          dangerouslySetInnerHTML={{ __html: course.description }}
                        />
                      </section>
                    )}

                    {/* Objetivos */}
                    {course.objectives && (
                      <section>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Target className="w-6 h-6 text-[#da1069]" />
                          Objetivos
                        </h3>
                        <div 
                          className="text-gray-600 leading-relaxed text-lg prose prose-lg max-w-none"
                          dangerouslySetInnerHTML={{ __html: course.objectives }}
                        />
                      </section>
                    )}

                    {/* Ementa */}
                    {course.syllabus && (
                      <section>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <FileText className="w-6 h-6 text-[#da1069]" />
                          Ementa do Curso
                        </h3>
                        <div 
                          className="text-gray-600 leading-relaxed text-lg prose prose-lg max-w-none"
                          dangerouslySetInnerHTML={{ __html: course.syllabus }}
                        />
                      </section>
                    )}

                    {/* Mercado de Trabalho */}
                    {course.jobMarket && (
                      <section>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Briefcase className="w-6 h-6 text-[#da1069]" />
                          Mercado de Trabalho
                        </h3>
                        <div 
                          className="text-gray-600 leading-relaxed text-lg prose prose-lg max-w-none"
                          dangerouslySetInnerHTML={{ __html: course.jobMarket }}
                        />
                      </section>
                    )}

                    {/* Requisitos para Matrícula */}
                    {course.requirements && (
                      <section>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-6 h-6 text-[#da1069]" />
                          Requisitos para Matrícula
                        </h3>
                        <div 
                          className="text-gray-600 leading-relaxed text-lg prose prose-lg max-w-none"
                          dangerouslySetInnerHTML={{ __html: course.requirements }}
                        />
                      </section>
                    )}

                    {/* Requisitos Técnicos */}
                    {course.technicalRequirements && (
                      <section>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Laptop className="w-6 h-6 text-[#da1069]" />
                          Requisitos Técnicos
                        </h3>
                        <div 
                          className="text-gray-600 leading-relaxed text-lg prose prose-lg max-w-none"
                          dangerouslySetInnerHTML={{ __html: course.technicalRequirements }}
                        />
                      </section>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Estrutura Curricular</h3>
                        <p className="text-gray-500">Conheça todas as disciplinas do curso organizadas por semestre</p>
                      </div>
                      {curriculumBySemester.length > 0 && (
                        <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#da1069]/10 to-pink-50 px-4 py-2 rounded-xl border border-[#da1069]/20">
                          <BookOpen className="w-5 h-5 text-[#da1069]" />
                          <span className="text-sm font-bold text-[#da1069]">{curriculumBySemester.length} Semestres</span>
                        </div>
                      )}
                    </div>
                    
                    {curriculumBySemester.length > 0 ? (
                      <div className="space-y-4">
                        {curriculumBySemester.map((period: any, index: number) => (
                          <div key={index} className="border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#da1069]/20 transition-all duration-300 bg-white group/card">
                            <div 
                              onClick={() => togglePeriod(index)}
                              className={cn(
                                "px-6 py-5 flex justify-between items-center cursor-pointer transition-all duration-300",
                                openPeriod === index 
                                  ? "bg-gray-50/80" 
                                  : "bg-white hover:bg-gray-50"
                              )}
                            >
                              <div className="flex items-center gap-5">
                                <div className={cn(
                                  "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-300 shadow-md",
                                  openPeriod === index 
                                    ? "bg-gradient-to-br from-[#da1069] to-[#3559AC] text-white rotate-3 scale-110" 
                                    : "bg-gradient-to-br from-gray-100 to-gray-50 text-gray-500 group-hover/card:from-[#da1069]/10 group-hover/card:to-pink-50 group-hover/card:text-[#da1069]"
                                )}>
                                  {index + 1}º
                                </div>
                                <div>
                                  <h4 className={cn(
                                    "font-bold text-lg transition-colors",
                                    openPeriod === index ? "text-[#da1069]" : "text-gray-800 group-hover/card:text-[#da1069]"
                                  )}>
                                    {period.period}
                                  </h4>
                                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                                    {period.subjects.length} disciplinas
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
                                  <Clock className="w-3.5 h-3.5 text-[#da1069]" />
                                  {period.subjects.reduce((acc: number, sub: any) => acc + sub.hours, 0)}h
                                </div>
                                <div className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                                  openPeriod === index ? "bg-[#da1069]/10 rotate-180" : "bg-gray-100 group-hover/card:bg-[#da1069]/10"
                                )}>
                                  <ChevronDown className={cn(
                                    "w-5 h-5 transition-colors",
                                    openPeriod === index ? "text-[#da1069]" : "text-gray-400 group-hover/card:text-[#da1069]"
                                  )} />
                                </div>
                              </div>
                            </div>
                            
                            <div className={cn(
                              "transition-all duration-500 ease-in-out overflow-hidden",
                              openPeriod === index ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                            )}>
                              <div className="p-4 bg-gray-50/30">
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                                  {period.subjects.map((subject: any, subIndex: number) => (
                                    <div key={subIndex} className="px-6 py-5 hover:bg-gradient-to-r hover:from-[#da1069]/5 hover:to-pink-50/50 transition-all duration-200 group/item cursor-pointer">
                                      <div className="flex justify-between items-start gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#da1069]/10 to-pink-50 flex items-center justify-center flex-shrink-0 group-hover/item:from-[#da1069]/20 group-hover/item:to-pink-100 transition-all">
                                            <BookOpen className="w-5 h-5 text-[#da1069]" />
                                          </div>
                                          <div className="flex-1">
                                            <h5 className="font-bold text-gray-900 group-hover/item:text-[#da1069] transition-colors">
                                              {subject.name}
                                            </h5>
                                            {subject.description && (
                                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                {subject.description}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-bold text-[#da1069] bg-gradient-to-r from-[#da1069]/10 to-pink-50 px-3 py-1.5 rounded-lg flex-shrink-0">
                                          <Clock className="w-4 h-4" />
                                          {subject.hours}h
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">
                          Grade curricular ainda não cadastrada.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Informações do Curso</h3>
              
              <div className="space-y-4">
                {course.duration && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-[#da1069] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Duração</p>
                      <p className="font-semibold text-gray-900">{course.duration}</p>
                    </div>
                  </div>
                )}
                
                {course.modality && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#da1069] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Modalidade</p>
                      <p className="font-semibold text-gray-900">{course.modality}</p>
                    </div>
                  </div>
                )}
                
                {course.type && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-[#da1069] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Tipo</p>
                      <p className="font-semibold text-gray-900">{course.type}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-gray-100">
                <Link href="/seja-parceiro">
                  <button className="w-full bg-gradient-to-r from-[#da1069] to-[#3559AC] text-white py-3 px-6 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-300">
                    Quero ser Parceiro
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
