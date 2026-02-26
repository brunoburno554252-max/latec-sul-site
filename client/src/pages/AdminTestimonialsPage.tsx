import { useState } from "react";
import { trpc } from "@/lib/trpc";
import ImageUpload from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Edit, Plus, Star, Quote, Video, Play, Users, TrendingUp } from "lucide-react";

export default function AdminTestimonialsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    location: "",
    testimonial: "",
    rating: 5,
    image: "",
    videoUrl: "",
    courseName: "",
    isActive: true,
    order: 0,
  });

  const utils = trpc.useUtils();
  const { data: testimonials, isLoading } = trpc.adminTestimonials.getAll.useQuery();

  const createMutation = trpc.adminTestimonials.create.useMutation({
    onSuccess: () => {
      toast.success("Depoimento criado com sucesso!");
      utils.adminTestimonials.getAll.invalidate();
      utils.testimonials.getAll.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(`Erro ao criar depoimento: ${error.message}`);
    },
  });

  const updateMutation = trpc.adminTestimonials.update.useMutation({
    onSuccess: () => {
      toast.success("Depoimento atualizado com sucesso!");
      utils.adminTestimonials.getAll.invalidate();
      utils.testimonials.getAll.invalidate();
      resetForm();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar depoimento: ${error.message}`);
    },
  });

  const deleteMutation = trpc.adminTestimonials.delete.useMutation({
    onSuccess: () => {
      toast.success("Depoimento excluído com sucesso!");
      utils.adminTestimonials.getAll.invalidate();
      utils.testimonials.getAll.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao excluir depoimento: ${error.message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      company: "",
      location: "",
      testimonial: "",
      rating: 5,
      image: "",
      videoUrl: "",
      courseName: "",
      isActive: true,
      order: 0,
    });
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (testimonial: any) => {
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      location: testimonial.location || "",
      testimonial: testimonial.testimonial,
      rating: testimonial.rating,
      image: testimonial.image || "",
      videoUrl: testimonial.videoUrl || "",
      courseName: testimonial.courseName || "",
      isActive: testimonial.isActive,
      order: testimonial.order,
    });
    setEditingId(testimonial.id);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este depoimento?")) {
      deleteMutation.mutate({ id });
    }
  };

  // Estatísticas
  const totalTestimonials = testimonials?.length || 0;
  const activeTestimonials = testimonials?.filter((t: any) => t.isActive).length || 0;
  const withVideo = testimonials?.filter((t: any) => t.videoUrl).length || 0;

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-green-50/50 to-green-50/50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <Quote className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
              Depoimentos dos Parceiros
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Gerencie os depoimentos exibidos na seção "O que nossos Parceiros dizem"
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="gap-2 bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 shadow-lg shadow-green-500/30"
        >
          <Plus className="w-4 h-4" />
          Novo Depoimento
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total de Depoimentos</p>
              <p className="text-3xl font-bold text-gray-900">{totalTestimonials}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Depoimentos Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{activeTestimonials}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
              <Video className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Com Vídeo</p>
              <p className="text-3xl font-bold text-gray-900">{withVideo}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Depoimentos */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {testimonials && testimonials.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {testimonials.map((testimonial: any) => (
              <div key={testimonial.id} className="p-6 hover:bg-green-50/50 transition-colors">
                <div className="flex items-start gap-6">
                  {/* Avatar/Image */}
                  <div className="flex-shrink-0 relative">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-green-100"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-500 flex items-center justify-center border-4 border-green-100">
                        <span className="text-2xl font-bold text-white">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {testimonial.videoUrl && (
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{testimonial.name}</h3>
                        <p className="text-sm text-green-600 font-medium">
                          {testimonial.role} • {testimonial.company}
                        </p>
                        {testimonial.location && (
                          <p className="text-xs text-gray-500">{testimonial.location}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {testimonial.courseName && (
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            {testimonial.courseName}
                          </span>
                        )}
                        {!testimonial.isActive && (
                          <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full font-medium">
                            Inativo
                          </span>
                        )}
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < testimonial.rating 
                                  ? "text-yellow-400 fill-yellow-400" 
                                  : "text-gray-300"
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4 line-clamp-2 italic">"{testimonial.testimonial}"</p>

                    {testimonial.videoUrl && (
                      <div className="flex items-center gap-2 mb-4 text-sm text-green-600">
                        <Video className="w-4 h-4" />
                        <span className="truncate max-w-md">{testimonial.videoUrl}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(testimonial)}
                        className="gap-2 border-green-200 text-green-600 hover:bg-green-50"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(testimonial.id)}
                        className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </Button>
                      <span className="text-xs text-gray-400 ml-auto">Ordem: {testimonial.order}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Quote className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum depoimento cadastrado</h3>
            <p className="text-gray-600 mb-4">
              Adicione depoimentos dos parceiros para exibir na página inicial
            </p>
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
              className="gap-2 bg-gradient-to-r from-green-600 to-green-600"
            >
              <Plus className="w-4 h-4" />
              Adicionar Primeiro Depoimento
            </Button>
          </div>
        )}
      </div>

      {/* Dialog de Criação/Edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Quote className="w-5 h-5 text-green-600" />
              {editingId ? "Editar Depoimento" : "Novo Depoimento"}
            </DialogTitle>
            <DialogDescription>
              Preencha as informações do depoimento do parceiro
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome do Parceiro *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: João Silva"
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Cargo *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Ex: Diretor Acadêmico"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Empresa/Instituição *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Ex: Centro Educacional ABC"
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: São Paulo, SP"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="testimonial">Depoimento *</Label>
              <Textarea
                id="testimonial"
                value={formData.testimonial}
                onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                rows={4}
                placeholder="Digite o depoimento do parceiro..."
                required
              />
            </div>

            <div>
              <Label htmlFor="courseName">Curso Relacionado</Label>
              <Input
                id="courseName"
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                placeholder="Ex: Marketing Digital, Contabilidade Financeira"
              />
              <p className="text-xs text-gray-500 mt-1">
                Nome do curso que o parceiro fez ou está relacionado (aparece como badge)
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <Video className="w-5 h-5 text-green-600" />
                <Label className="text-green-700 font-semibold">Vídeo do Depoimento</Label>
              </div>
              <Input
                id="videoUrl"
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
              />
              <p className="text-xs text-green-600 mt-2">
                Cole a URL do YouTube, Vimeo ou link direto do vídeo. O vídeo será exibido em modal quando o usuário clicar.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="rating">Avaliação</Label>
                <Select
                  value={formData.rating.toString()}
                  onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ 5 Estrelas</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ 4 Estrelas</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ 3 Estrelas</SelectItem>
                    <SelectItem value="2">⭐⭐ 2 Estrelas</SelectItem>
                    <SelectItem value="1">⭐ 1 Estrela</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="order">Ordem de Exibição</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-end">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Ativo</Label>
                </div>
              </div>
            </div>

            <div>
              <Label>Foto do Parceiro</Label>
              <ImageUpload
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
                onRemove={() => setFormData({ ...formData, image: "" })}
                aspectRatio={1}
              />
              <p className="text-xs text-gray-500 mt-1">
                Foto do parceiro (opcional, se não fornecida será usado avatar com inicial)
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending || updateMutation.isPending}
                className="bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700"
              >
                {editingId ? "Atualizar" : "Criar"} Depoimento
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
