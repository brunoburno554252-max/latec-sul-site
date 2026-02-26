import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, Eye, Star, FileText, Calendar, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function AdminBlogPage() {
  const [, setLocation] = useLocation();
  const { data: posts, isLoading, refetch } = trpc.adminBlog.getAll.useQuery();
  const deleteMutation = trpc.adminBlog.delete.useMutation();
  const toggleFeaturedMutation = trpc.adminBlog.toggleFeatured.useMutation();

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Tem certeza que deseja excluir o post "${title}"?`)) return;

    try {
      await deleteMutation.mutateAsync({ id });
      toast.success("Post excluído com sucesso!");
      refetch();
    } catch (error) {
      toast.error("Erro ao excluir post");
    }
  };

  const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
    try {
      await toggleFeaturedMutation.mutateAsync({ id, featured: !currentFeatured });
      toast.success(currentFeatured ? "Removido dos destaques" : "Adicionado aos destaques");
      refetch();
    } catch (error) {
      toast.error("Erro ao atualizar destaque");
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Carregando posts...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const publishedPosts = posts?.filter(p => p.isPublished) || [];
  const draftPosts = posts?.filter(p => !p.isPublished) || [];
  const featuredPosts = posts?.filter(p => p.featured) || [];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] bg-clip-text text-transparent">
                Gerenciar Blog
              </h1>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-gray-600 text-lg">Crie, edite ou remova posts e notícias</p>
          </div>
          <Button 
            className="gap-2 bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] hover:from-[#146B2F] hover:to-[#B8860B] text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-6 text-base font-semibold" 
            onClick={() => setLocation("/admin-la-educacao/blog/novo")}
          >
            <Plus className="w-5 h-5" />
            Novo Post
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Total de Posts</p>
                  <p className="text-3xl font-bold text-gray-900">{posts?.length || 0}</p>
                </div>
                <div className="w-14 h-14 bg-[#D4A017] rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Publicados</p>
                  <p className="text-3xl font-bold text-gray-900">{publishedPosts.length}</p>
                </div>
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-yellow-50 to-yellow-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Em Destaque</p>
                  <p className="text-3xl font-bold text-gray-900">{featuredPosts.length}</p>
                </div>
                <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Star className="w-7 h-7 text-white fill-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">Rascunhos</p>
                  <p className="text-3xl font-bold text-gray-900">{draftPosts.length}</p>
                </div>
                <div className="w-14 h-14 bg-gray-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Posts */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Lista de Posts</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-[#1B8C3D] via-green-500 to-transparent rounded-full"></div>
          </div>

          {!posts || posts.length === 0 ? (
            <Card className="border-0 shadow-md">
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum post cadastrado</h3>
                  <p className="text-gray-600 mb-6">Comece criando seu primeiro post no blog</p>
                  <Button 
                    className="gap-2 bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] hover:from-[#146B2F] hover:to-[#B8860B] text-white" 
                    onClick={() => setLocation("/admin-la-educacao/blog/novo")}
                  >
                    <Plus className="w-4 h-4" />
                    Criar Primeiro Post
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <Card 
                  key={post.id}
                  className="border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Imagem do Post */}
                      {post.image ? (
                        <div className="w-40 h-28 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-40 h-28 rounded-2xl bg-gradient-to-br from-green-100 to-green-100 flex items-center justify-center shadow-lg flex-shrink-0">
                          <FileText className="w-10 h-10 text-green-500" />
                        </div>
                      )}

                      {/* Informações do Post */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                📁 {post.category}
                              </span>
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                <Calendar className="w-4 h-4" />
                                {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("pt-BR") : "Não publicado"}
                              </span>
                              <span
                                className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold ${
                                  post.isPublished
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {post.isPublished ? "✓ Publicado" : "○ Rascunho"}
                              </span>
                              {post.featured && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-semibold">
                                  <Star className="w-4 h-4 fill-yellow-600" />
                                  Destaque
                                </span>
                              )}
                            </div>
                            {post.excerpt && (
                              <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
                            )}
                          </div>
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex gap-2 mt-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`gap-2 transition-colors ${
                              post.featured 
                                ? 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100 text-yellow-700' 
                                : 'hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300'
                            }`}
                            onClick={() => handleToggleFeatured(post.id, post.featured || false)}
                            disabled={toggleFeaturedMutation.isPending}
                          >
                            <Star className={`w-4 h-4 ${post.featured ? 'fill-yellow-600' : ''}`} />
                            {post.featured ? 'Destaque' : 'Destacar'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2 hover:bg-green-50 hover:text-green-700 hover:border-green-300 transition-colors"
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                          >
                            <Eye className="w-4 h-4" />
                            Ver
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2 hover:bg-blue-50 hover:text-amber-700 hover:border-blue-300 transition-colors"
                            onClick={() => setLocation(`/admin-la-educacao/blog/${post.id}`)}
                          >
                            <Pencil className="w-4 h-4" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
                            onClick={() => handleDelete(post.id, post.title)}
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
