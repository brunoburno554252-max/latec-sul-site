import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import ImageUpload from "@/components/ImageUpload";

export default function AdminCourseCategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const { data: categories, refetch } = trpc.adminCategories.getAll.useQuery();

  const createMutation = trpc.adminCategories.create.useMutation({
    onSuccess: () => {
      toast.success("Categoria criada com sucesso!");
      refetch();
      closeDialog();
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const updateMutation = trpc.adminCategories.update.useMutation({
    onSuccess: () => {
      toast.success("Categoria atualizada!");
      refetch();
      closeDialog();
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deleteMutation = trpc.adminCategories.delete.useMutation({
    onSuccess: () => {
      toast.success("Categoria excluída!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const openDialog = (category?: any) => {
    if (category) {
      setEditingId(category.id);
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description || "");
      setImage(category.image || "");
    } else {
      setEditingId(null);
      setName("");
      setSlug("");
      setDescription("");
      setImage("");
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      updateMutation.mutate({ id: editingId, name, slug, description, image });
    } else {
      createMutation.mutate({ name, slug, description, image });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Categorias de Cursos</h1>
          <Button onClick={() => openDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Categoria
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Todas as Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories?.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-24 h-16 object-cover rounded mr-4 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.slug}</p>
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    )}
                    <div className="flex gap-4 mt-2">
                      <p className="text-xs text-gray-400">ID: {category.id}</p>
                      <p className="text-xs bg-blue-100 text-amber-700 px-2 py-1 rounded">
                        {category.courseCount || 0} curso{category.courseCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDialog(category)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Editar Categoria" : "Nova Categoria"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nome *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Slug *</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label>Imagem da Categoria</Label>
                <ImageUpload
                  value={image}
                  onChange={(url) => setImage(url)}
                  onRemove={() => setImage("")}
                  aspectRatio={16 / 9}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingId ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
