import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUpload from "@/components/ImageUpload";
import RichTextEditor from "@/components/RichTextEditor";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function AdminBlogFormPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const postId = params.id ? parseInt(params.id) : null;
  const isEditing = postId !== null;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "Equipe LA. Educação",
    category: "Notícias",
    image: "",
    gallery: [] as string[],
    readTime: "5 min",
    isPublished: true,
    externalLink: "",
    publishedAt: new Date().toISOString().split('T')[0],
  });

  const { data: postData } = trpc.adminBlog.getById.useQuery(
    { id: postId! },
    { enabled: isEditing }
  );

  // Carregar dados do post quando estiver editando
  useEffect(() => {
    if (postData) {
      setFormData({
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content,
        author: postData.author,
        category: postData.category,
        image: postData.image || "",
        gallery: (postData as any).gallery || [],
        readTime: postData.readTime || "5 min",
        isPublished: postData.isPublished,
        externalLink: postData.externalLink || "",
        publishedAt: postData.publishedAt ? new Date(postData.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    }
  }, [postData]);

  const createMutation = trpc.adminBlog.create.useMutation();
  const updateMutation = trpc.adminBlog.update.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        publishedAt: new Date(formData.publishedAt),
      };

      if (isEditing) {
        await updateMutation.mutateAsync({ id: postId, ...data });
        toast.success("Post atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Post criado com sucesso!");
      }
      setLocation("/admin-la-educacao/blog");
    } catch (error) {
      toast.error("Erro ao salvar post");
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title, slug: generateSlug(title) });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/admin-la-educacao/blog")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Editar Post" : "Novo Post"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Post *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL) *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500">
              URL amigável: /blog/{formData.slug}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Resumo/Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              placeholder="Breve resumo do post que aparecerá na listagem"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Notícias">Notícias</SelectItem>
                  <SelectItem value="Educação">Educação</SelectItem>
                  <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                  <SelectItem value="Carreira">Carreira</SelectItem>
                  <SelectItem value="Institucional">Institucional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Autor *</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="readTime">Tempo de Leitura</Label>
              <Input
                id="readTime"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                placeholder="Ex: 5 min"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Imagem de Destaque</Label>
            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              onRemove={() => setFormData({ ...formData, image: "" })}
              aspectRatio={16 / 9}
            />
          </div>

          <div className="space-y-2">
            <Label>Galeria de Imagens (Instagram Style)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.gallery.map((url, index) => (
                <div key={index} className="relative">
                  <ImageUpload
                    value={url}
                    onChange={(newUrl) => {
                      const newGallery = [...formData.gallery];
                      newGallery[index] = newUrl;
                      setFormData({ ...formData, gallery: newGallery });
                    }}
                    onRemove={() => {
                      const newGallery = formData.gallery.filter((_, i) => i !== index);
                      setFormData({ ...formData, gallery: newGallery });
                    }}
                    aspectRatio={1}
                  />
                </div>
              ))}
              <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
                   onClick={() => setFormData({ ...formData, gallery: [...formData.gallery, ""] })}>
                <span className="text-sm text-gray-500">+ Adicionar Foto</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">Adicione as fotos que aparecerão no carrossel do post.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo do Post *</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => setFormData({ ...formData, content })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="publishedAt">Data de Publicação *</Label>
            <Input
              id="publishedAt"
              type="date"
              value={formData.publishedAt}
              onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="externalLink">Link da Matéria Completa</Label>
            <Input
              id="externalLink"
              type="url"
              value={formData.externalLink}
              onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
              placeholder="Ex: https://www.youtube.com/watch?v=... ou https://www.record.com.br/..."
            />
            <p className="text-xs text-gray-500">
              Cole o link do vídeo ou da matéria completa que será exibido como botão no final do post
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="isPublished">Publicar imediatamente</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending
                ? "Salvando..."
                : isEditing
                ? "Atualizar Post"
                : "Criar Post"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/admin-la-educacao/blog")}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
