import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, BookOpen, Clock, GraduationCap, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function AdminCoursesPage() {
  const [, setLocation] = useLocation();
  const { data: courses, isLoading, refetch } = trpc.adminCourses.getAll.useQuery();
  const deleteMutation = trpc.adminCourses.delete.useMutation();

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir o curso "${title}"?`)) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Curso excluído com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao excluir curso");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Carregando cursos...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] bg-clip-text text-transparent">
                Gerenciar Cursos
              </h1>
              <GraduationCap className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-gray-600 text-lg">Adicione, edite ou remova cursos do catálogo</p>
          </div>
          <Button 
            className="gap-2 bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] hover:from-[#146B2F] hover:to-[#B8860B] text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-6 text-base font-semibold" 
            onClick={() => setLocation("/admin-la-educacao/cursos/novo")}
          >
            <Plus className="w-5 h-5" />
            Novo Curso
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Total de Cursos</p>
                  <p className="text-3xl font-bold text-gray-900">{courses?.length || 0}</p>
                </div>
                <div className="w-14 h-14 bg-[#D4A017] rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Cursos Ativos</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {courses?.filter(c => c.isActive).length || 0}
                  </p>
                </div>
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Categorias</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {courses ? new Set(courses.map(c => c.category)).size : 0}
                  </p>
                </div>
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Cursos */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Lista de Cursos</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-[#1B8C3D] via-green-500 to-transparent rounded-full"></div>
          </div>

          {!courses || courses.length === 0 ? (
            <Card className="border-0 shadow-md">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum curso cadastrado</h3>
                  <p className="text-gray-600 mb-6">Comece adicionando seu primeiro curso ao catálogo</p>
                  <Button 
                    className="gap-2 bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] hover:from-[#146B2F] hover:to-[#B8860B] text-white" 
                    onClick={() => setLocation("/admin-la-educacao/cursos/novo")}
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Primeiro Curso
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {courses.map((course) => (
                <Card 
                  key={course.id}
                  className="border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Imagem do Curso */}
                      {course.image ? (
                        <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                          <img 
                            src={course.image} 
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-green-100 to-green-100 flex items-center justify-center shadow-lg flex-shrink-0">
                          <BookOpen className="w-12 h-12 text-green-500" />
                        </div>
                      )}

                      {/* Informações do Curso */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                            <div className="flex flex-wrap gap-3">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                <GraduationCap className="w-4 h-4" />
                                {course.category}
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-amber-700 rounded-lg text-sm font-medium">
                                <BookOpen className="w-4 h-4" />
                                {course.modality}
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                <Clock className="w-4 h-4" />
                                {course.duration}
                              </span>
                              <span
                                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold ${
                                  course.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {course.isActive ? "✓ Ativo" : "○ Inativo"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-colors"
                            onClick={() => setLocation(`/admin-la-educacao/cursos/${course.id}/grade`)}
                          >
                            <BookOpen className="w-4 h-4" />
                            Grade Curricular
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2 hover:bg-blue-50 hover:text-amber-700 hover:border-blue-300 transition-colors"
                            onClick={() => setLocation(`/admin-la-educacao/cursos/${course.id}`)}
                          >
                            <Pencil className="w-4 h-4" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
                            onClick={() => handleDelete(course.id, course.title)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
