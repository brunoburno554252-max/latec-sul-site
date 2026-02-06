import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, MoveUp, MoveDown, Save, Image as ImageIcon, X, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import ImageUpload from "@/components/ImageUpload";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

// ============ BANNER SECTION ============
function BannerSection() {
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  // Form states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [displayDuration, setDisplayDuration] = useState(10);
  const [textPosition, setTextPosition] = useState<"left" | "center" | "right">("left");
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [isActive, setIsActive] = useState(true);

  const { data: banners = [], refetch } = trpc.adminBanners.getAll.useQuery();
  
  const createMutation = trpc.adminBanners.create.useMutation({
    onSuccess: () => {
      toast.success("Banner criado com sucesso!");
      refetch();
      resetForm();
    },
    onError: (error: any) => toast.error(`Erro: ${error.message}`),
  });

  const updateMutation = trpc.adminBanners.update.useMutation({
    onSuccess: () => {
      toast.success("Banner atualizado!");
      refetch();
      resetForm();
    },
    onError: (error: any) => toast.error(`Erro: ${error.message}`),
  });

  const deleteMutation = trpc.adminBanners.delete.useMutation({
    onSuccess: () => {
      toast.success("Banner excluído!");
      refetch();
      setDeleteId(null);
    },
    onError: (error: any) => toast.error(`Erro: ${error.message}`),
  });

  const reorderMutation = trpc.adminBanners.reorder.useMutation({
    onSuccess: () => {
      toast.success("Ordem atualizada!");
      refetch();
    },
  });

  const resetForm = () => {
    setEditingBanner(null);
    setShowForm(false);
    setTitle("");
    setSubtitle("");
    setImage("");
    setCtaText("");
    setCtaLink("");
    setDisplayDuration(10);
    setTextPosition("left");
    setOverlayOpacity(50);
    setIsActive(true);
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setShowForm(true);
    setTitle(banner.title);
    setSubtitle(banner.subtitle || "");
    setImage(banner.image);
    setCtaText(banner.ctaText || "");
    setCtaLink(banner.ctaLink || "");
    setDisplayDuration(banner.displayDuration || 10);
    setTextPosition(banner.textPosition || "left");
    setOverlayOpacity(banner.overlayOpacity || 50);
    setIsActive(banner.isActive);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image) {
      toast.error("Título e imagem são obrigatórios");
      return;
    }

    const data = {
      title,
      subtitle: subtitle || undefined,
      image,
      ctaText: ctaText || undefined,
      ctaLink: ctaLink || undefined,
      displayDuration,
      textPosition,
      overlayOpacity,
      isActive,
    };

    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, ...data });
    } else {
      const maxOrder = Math.max(...banners.map((b: any) => b.order), 0);
      createMutation.mutate({ ...data, order: maxOrder + 1 });
    }
  };

  const sortedBanners = [...banners].sort((a: any, b: any) => a.order - b.order);
  const maxOrder = Math.max(...banners.map((b: any) => b.order), 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Banners do Hero</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Novo Banner
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>{editingBanner ? "Editar Banner" : "Novo Banner"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Título *</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título do banner" />
                  </div>
                  <div>
                    <Label>Subtítulo</Label>
                    <Textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtítulo" rows={2} />
                  </div>
                  <div>
                    <Label>Texto do Botão</Label>
                    <Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="Ex: Quero ser Parceiro" />
                  </div>
                  <div>
                    <Label>Link do Botão</Label>
                    <Input value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} placeholder="Ex: /parceiro" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label>Imagem do Banner *</Label>
                    <ImageUpload value={image} onChange={setImage} onRemove={() => setImage("")} aspectRatio={16/9} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Posição do Texto</Label>
                      <Select value={textPosition} onValueChange={(v: any) => setTextPosition(v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Esquerda</SelectItem>
                          <SelectItem value="center">Centro</SelectItem>
                          <SelectItem value="right">Direita</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={isActive} onCheckedChange={setIsActive} />
                      <Label>Ativo</Label>
                    </div>
                  </div>
                  <div>
                    <Label>Opacidade do Overlay: {overlayOpacity}%</Label>
                    <Slider min={0} max={100} step={5} value={[overlayOpacity]} onValueChange={(v) => setOverlayOpacity(v[0])} />
                  </div>
                  <div>
                    <Label>Duração: {displayDuration}s</Label>
                    <Slider min={3} max={30} value={[displayDuration]} onValueChange={(v) => setDisplayDuration(v[0])} />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" /> {editingBanner ? "Atualizar" : "Criar"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {sortedBanners.map((banner: any, index: number) => (
          <div key={banner.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
            <img src={banner.image || "/placeholder.jpg"} alt={banner.title} className="w-24 h-14 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold">{banner.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded ${banner.isActive ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>
                {banner.isActive ? "Ativo" : "Inativo"}
              </span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" disabled={index === 0} onClick={() => reorderMutation.mutate({ id: banner.id, newOrder: banner.order - 1 })}>
                <MoveUp className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" disabled={index === sortedBanners.length - 1} onClick={() => reorderMutation.mutate({ id: banner.id, newOrder: banner.order + 1 })}>
                <MoveDown className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleEdit(banner)}><Pencil className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeleteId(banner.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      {deleteId && (
        <DeleteConfirmDialog
          open={true}
          onOpenChange={(open) => !open && setDeleteId(null)}
          onConfirm={() => deleteMutation.mutate({ id: deleteId })}
          title="Excluir Banner"
          description="Tem certeza que deseja excluir este banner?"
        />
      )}
    </div>
  );
}

// ============ SELOS SECTION ============
function SelosSection() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");

  const { data: selos = [], refetch } = trpc.home.getCertifications.useQuery();
  
  const addMutation = trpc.home.addCertification.useMutation({
    onSuccess: () => { toast.success("Selo adicionado!"); refetch(); resetForm(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const updateMutation = trpc.home.updateCertification.useMutation({
    onSuccess: () => { toast.success("Selo atualizado!"); refetch(); resetForm(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const deleteMutation = trpc.home.deleteCertification.useMutation({
    onSuccess: () => { toast.success("Selo removido!"); refetch(); setDeleteId(null); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setName("");
    setImageUrl("");
    setLink("");
  };

  const handleEdit = (selo: any) => {
    setEditingId(selo.id);
    setShowForm(true);
    setName(selo.name);
    setImageUrl(selo.image_url);
    setLink(selo.link || "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !imageUrl) {
      toast.error("Nome e imagem são obrigatórios");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, name, imageUrl, link: link || undefined });
    } else {
      const maxOrder = Math.max(...selos.map((s: any) => s.sort_order || 0), 0);
      addMutation.mutate({ name, imageUrl, link: link || undefined, sortOrder: maxOrder + 1 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Selos de Qualidade</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Novo Selo
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>{editingId ? "Editar Selo" : "Novo Selo"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label>Nome do Selo *</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Certificado MEC" />
                  </div>
                  <div>
                    <Label>Link (opcional)</Label>
                    <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
                  </div>
                </div>
                <div>
                  <Label>Imagem do Selo *</Label>
                  <ImageUpload value={imageUrl} onChange={setImageUrl} onRemove={() => setImageUrl("")} aspectRatio={1} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit"><Save className="w-4 h-4 mr-2" /> {editingId ? "Atualizar" : "Adicionar"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {selos.map((selo: any) => (
          <div key={selo.id} className="border rounded-lg p-3 text-center group relative">
            <img src={selo.image_url} alt={selo.name} className="h-16 mx-auto object-contain mb-2" />
            <p className="text-xs font-medium truncate">{selo.name}</p>
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleEdit(selo)}><Pencil className="w-3 h-3" /></Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600" onClick={() => setDeleteId(selo.id)}><Trash2 className="w-3 h-3" /></Button>
            </div>
          </div>
        ))}
      </div>

      {deleteId && (
        <DeleteConfirmDialog
          open={true}
          onOpenChange={(open) => !open && setDeleteId(null)}
          onConfirm={() => deleteMutation.mutate({ id: deleteId })}
          title="Excluir Selo"
          description="Tem certeza que deseja excluir este selo?"
        />
      )}
    </div>
  );
}

// ============ IMPRENSA SECTION ============
function ImprensaSection() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");

  const { data: press = [], refetch } = trpc.home.getPress.useQuery();
  
  const addMutation = trpc.home.addPress.useMutation({
    onSuccess: () => { toast.success("Mídia adicionada!"); refetch(); resetForm(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const updateMutation = trpc.home.updatePress.useMutation({
    onSuccess: () => { toast.success("Mídia atualizada!"); refetch(); resetForm(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const deleteMutation = trpc.home.deletePress.useMutation({
    onSuccess: () => { toast.success("Mídia removida!"); refetch(); setDeleteId(null); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setName("");
    setImageUrl("");
    setLink("");
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setShowForm(true);
    setName(item.name);
    setImageUrl(item.image_url);
    setLink(item.link || "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !imageUrl) {
      toast.error("Nome e imagem são obrigatórios");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, name, imageUrl, link: link || undefined });
    } else {
      const maxOrder = Math.max(...press.map((p: any) => p.sort_order || 0), 0);
      addMutation.mutate({ name, imageUrl, link: link || undefined, sortOrder: maxOrder + 1 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Imprensa Nacional</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Nova Mídia
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>{editingId ? "Editar Mídia" : "Nova Mídia"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label>Nome da Mídia *</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: G1, ISTOÉ" />
                  </div>
                  <div>
                    <Label>Link da Notícia (opcional)</Label>
                    <Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
                  </div>
                </div>
                <div>
                  <Label>Logo da Mídia *</Label>
                  <ImageUpload value={imageUrl} onChange={setImageUrl} onRemove={() => setImageUrl("")} aspectRatio={3/1} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit"><Save className="w-4 h-4 mr-2" /> {editingId ? "Atualizar" : "Adicionar"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {press.map((item: any) => (
          <div key={item.id} className="border rounded-lg p-3 text-center group relative">
            <img src={item.image_url} alt={item.name} className="h-12 mx-auto object-contain mb-2" />
            <p className="text-xs font-medium truncate">{item.name}</p>
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleEdit(item)}><Pencil className="w-3 h-3" /></Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600" onClick={() => setDeleteId(item.id)}><Trash2 className="w-3 h-3" /></Button>
            </div>
          </div>
        ))}
      </div>

      {deleteId && (
        <DeleteConfirmDialog
          open={true}
          onOpenChange={(open) => !open && setDeleteId(null)}
          onConfirm={() => deleteMutation.mutate({ id: deleteId })}
          title="Excluir Mídia"
          description="Tem certeza que deseja excluir esta mídia?"
        />
      )}
    </div>
  );
}

// ============ ABOUT/DIFERENCIAIS SECTION ============
function DiferenciaisSection() {
  const { data: settings = [], refetch } = trpc.home.getHomeSettings.useQuery();
  const updateMutation = trpc.home.updateHomeSection.useMutation({
    onSuccess: () => { toast.success("Alterações salvas!"); refetch(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const getValue = (key: string) => settings.find((s: any) => s.field_key === key)?.field_value || "";

  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutSubtitle, setAboutSubtitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [aboutImage, setAboutImage] = useState("");

  useEffect(() => {
    setAboutTitle(getValue("about_title"));
    setAboutSubtitle(getValue("about_subtitle"));
    setAboutDescription(getValue("about_description"));
    setAboutImage(getValue("about_image"));
  }, [settings]);

  const handleSave = () => {
    updateMutation.mutate({
      section: "about",
      fields: [
        { key: "about_title", value: aboutTitle },
        { key: "about_subtitle", value: aboutSubtitle },
        { key: "about_description", value: aboutDescription },
        { key: "about_image", value: aboutImage },
      ],
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Seção Empresários Educacionais</h2>
      
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Título Principal</Label>
                <Input value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} placeholder="Empresários Educacionais:" />
              </div>
              <div>
                <Label>Subtítulo</Label>
                <Input value={aboutSubtitle} onChange={(e) => setAboutSubtitle(e.target.value)} placeholder="transformem propósito em..." />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea value={aboutDescription} onChange={(e) => setAboutDescription(e.target.value)} rows={4} placeholder="Ser parceiro da LA Educação..." />
              </div>
            </div>
            <div>
              <Label>Imagem da Seção</Label>
              <ImageUpload value={aboutImage} onChange={setAboutImage} onRemove={() => setAboutImage("")} aspectRatio={4/3} />
            </div>
          </div>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            <Save className="w-4 h-4 mr-2" /> Salvar Alterações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ PLATAFORMA SECTION ============
function PlataformaSection() {
  const { data: settings = [], refetch } = trpc.home.getHomeSettings.useQuery();
  const updateMutation = trpc.home.updateHomeSection.useMutation({
    onSuccess: () => { toast.success("Alterações salvas!"); refetch(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const getValue = (key: string) => settings.find((s: any) => s.field_key === key)?.field_value || "";

  const [platformTitle, setPlatformTitle] = useState("");
  const [platformSubtitle, setPlatformSubtitle] = useState("");
  const [platformDescription, setPlatformDescription] = useState("");
  const [platformImage, setPlatformImage] = useState("");

  useEffect(() => {
    setPlatformTitle(getValue("platform_title"));
    setPlatformSubtitle(getValue("platform_subtitle"));
    setPlatformDescription(getValue("platform_description"));
    setPlatformImage(getValue("platform_image"));
  }, [settings]);

  const handleSave = () => {
    updateMutation.mutate({
      section: "platform",
      fields: [
        { key: "platform_title", value: platformTitle },
        { key: "platform_subtitle", value: platformSubtitle },
        { key: "platform_description", value: platformDescription },
        { key: "platform_image", value: platformImage },
      ],
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Seção Plataforma Intuitiva</h2>
      
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Título</Label>
                <Input value={platformTitle} onChange={(e) => setPlatformTitle(e.target.value)} placeholder="Plataforma Intuitiva" />
              </div>
              <div>
                <Label>Subtítulo</Label>
                <Input value={platformSubtitle} onChange={(e) => setPlatformSubtitle(e.target.value)} placeholder="Experiência do Aluno" />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea value={platformDescription} onChange={(e) => setPlatformDescription(e.target.value)} rows={4} placeholder="Descrição da plataforma..." />
              </div>
            </div>
            <div>
              <Label>Imagem da Plataforma</Label>
              <ImageUpload value={platformImage} onChange={setPlatformImage} onRemove={() => setPlatformImage("")} aspectRatio={16/9} />
            </div>
          </div>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            <Save className="w-4 h-4 mr-2" /> Salvar Alterações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ ECOSSISTEMA SECTION ============
function EcossistemaSection() {
  const { data: settings = [], refetch } = trpc.home.getHomeSettings.useQuery();
  const { data: institutions = [], refetch: refetchInst } = trpc.home.getEcosystemInstitutions.useQuery();
  
  const updateMutation = trpc.home.updateHomeSection.useMutation({
    onSuccess: () => { toast.success("Alterações salvas!"); refetch(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const getValue = (key: string) => settings.find((s: any) => s.field_key === key)?.field_value || "";

  const [ecoTitle, setEcoTitle] = useState("");
  const [ecoSubtitle, setEcoSubtitle] = useState("");
  const [ecoDescription, setEcoDescription] = useState("");

  useEffect(() => {
    setEcoTitle(getValue("ecosystem_title"));
    setEcoSubtitle(getValue("ecosystem_subtitle"));
    setEcoDescription(getValue("ecosystem_description"));
  }, [settings]);

  const handleSave = () => {
    updateMutation.mutate({
      section: "ecosystem",
      fields: [
        { key: "ecosystem_title", value: ecoTitle },
        { key: "ecosystem_subtitle", value: ecoSubtitle },
        { key: "ecosystem_description", value: ecoDescription },
      ],
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Seção Ecossistema</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Textos da Seção</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Título</Label>
            <Input value={ecoTitle} onChange={(e) => setEcoTitle(e.target.value)} placeholder="Por que somos o maior..." />
          </div>
          <div>
            <Label>Subtítulo</Label>
            <Input value={ecoSubtitle} onChange={(e) => setEcoSubtitle(e.target.value)} placeholder="Ecossistema Educacional" />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea value={ecoDescription} onChange={(e) => setEcoDescription(e.target.value)} rows={3} placeholder="À disposição de nossos parceiros..." />
          </div>
          <Button onClick={handleSave} disabled={updateMutation.isPending}>
            <Save className="w-4 h-4 mr-2" /> Salvar Textos
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instituições do Ecossistema</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Para gerenciar as instituições do ecossistema (adicionar, editar, remover logos), acesse a seção dedicada no menu lateral.
          </p>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {institutions.map((inst: any) => (
              <div key={inst.id} className="border rounded p-2 text-center">
                <img src={inst.logo} alt={inst.name} className="h-10 mx-auto object-contain" />
                <p className="text-xs mt-1 truncate">{inst.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ MAIN PAGE ============
export default function AdminHomePage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar Página Home</h1>
          <p className="text-gray-600 mt-1">Gerencie todos os elementos da página inicial</p>
        </div>

        <Tabs defaultValue="banners" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="selos">Selos</TabsTrigger>
            <TabsTrigger value="imprensa">Imprensa</TabsTrigger>
            <TabsTrigger value="diferenciais">Diferenciais</TabsTrigger>
            <TabsTrigger value="plataforma">Plataforma</TabsTrigger>
            <TabsTrigger value="ecossistema">Ecossistema</TabsTrigger>
          </TabsList>

          <TabsContent value="banners" className="mt-6">
            <BannerSection />
          </TabsContent>

          <TabsContent value="selos" className="mt-6">
            <SelosSection />
          </TabsContent>

          <TabsContent value="imprensa" className="mt-6">
            <ImprensaSection />
          </TabsContent>

          <TabsContent value="diferenciais" className="mt-6">
            <DiferenciaisSection />
          </TabsContent>

          <TabsContent value="plataforma" className="mt-6">
            <PlataformaSection />
          </TabsContent>

          <TabsContent value="ecossistema" className="mt-6">
            <EcossistemaSection />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
