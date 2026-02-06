import { useState, useEffect } from "react";
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
import { Plus, Pencil, Trash2, MoveUp, MoveDown, Save, Image as ImageIcon, X, DollarSign, BookOpen, Wallet, TrendingUp, Users, Clock, Award, Headphones, FileText, Check, GraduationCap, Star, ExternalLink, Globe, Building } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import ImageUpload from "@/components/ImageUpload";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { useLocation } from "wouter";

// Mapa de ícones disponíveis
const iconMap: { [key: string]: any } = {
  DollarSign, BookOpen, Wallet, TrendingUp, Users, Clock, Award, Headphones, FileText, Check
};

const iconOptions = [
  { value: "DollarSign", label: "Dinheiro" },
  { value: "BookOpen", label: "Livro" },
  { value: "Wallet", label: "Carteira" },
  { value: "TrendingUp", label: "Crescimento" },
  { value: "Users", label: "Pessoas" },
  { value: "Clock", label: "Relógio" },
  { value: "Award", label: "Prêmio" },
  { value: "Headphones", label: "Suporte" },
  { value: "FileText", label: "Documento" },
  { value: "Check", label: "Check" },
];

// ============ BANNER SECTION ============
function BannerSection() {
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  
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
    onSuccess: () => { toast.success("Banner criado!"); refetch(); resetForm(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const updateMutation = trpc.adminBanners.update.useMutation({
    onSuccess: () => { toast.success("Banner atualizado!"); refetch(); resetForm(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const deleteMutation = trpc.adminBanners.delete.useMutation({
    onSuccess: () => { toast.success("Banner excluído!"); refetch(); setDeleteId(null); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const reorderMutation = trpc.adminBanners.reorder.useMutation({
    onSuccess: () => { toast.success("Ordem atualizada!"); refetch(); },
  });

  const resetForm = () => {
    setEditingBanner(null);
    setShowForm(false);
    setTitle(""); setSubtitle(""); setImage(""); setCtaText(""); setCtaLink("");
    setDisplayDuration(10); setTextPosition("left"); setOverlayOpacity(50); setIsActive(true);
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setShowForm(true);
    setTitle(banner.title); setSubtitle(banner.subtitle || ""); setImage(banner.image);
    setCtaText(banner.ctaText || ""); setCtaLink(banner.ctaLink || "");
    setDisplayDuration(banner.displayDuration || 10); setTextPosition(banner.textPosition || "left");
    setOverlayOpacity(banner.overlayOpacity || 50); setIsActive(banner.isActive);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image) { toast.error("Título e imagem são obrigatórios"); return; }
    const data = { title, subtitle: subtitle || undefined, image, ctaText: ctaText || undefined, ctaLink: ctaLink || undefined, displayDuration, textPosition, overlayOpacity, isActive };
    if (editingBanner) { updateMutation.mutate({ id: editingBanner.id, ...data }); }
    else { const maxOrder = Math.max(...banners.map((b: any) => b.order), 0); createMutation.mutate({ ...data, order: maxOrder + 1 }); }
  };

  const sortedBanners = [...banners].sort((a: any, b: any) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Banners do Hero</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="gap-2"><Plus className="w-4 h-4" /> Novo Banner</Button>
      </div>

      {showForm && (
        <Card className="border-primary">
          <CardHeader><CardTitle>{editingBanner ? "Editar Banner" : "Novo Banner"}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div><Label>Título *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título do banner" /></div>
                  <div><Label>Subtítulo</Label><Textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtítulo" rows={2} /></div>
                  <div><Label>Texto do Botão</Label><Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="Ex: Quero ser Parceiro" /></div>
                  <div><Label>Link do Botão</Label><Input value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} placeholder="Ex: /parceiro" /></div>
                </div>
                <div className="space-y-4">
                  <div><Label>Imagem do Banner *</Label><ImageUpload value={image} onChange={setImage} onRemove={() => setImage("")} aspectRatio={16/9} /></div>
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
                    <div><Label>Duração (s)</Label><Input type="number" value={displayDuration} onChange={(e) => setDisplayDuration(Number(e.target.value))} min={3} max={30} /></div>
                  </div>
                  <div><Label>Opacidade do Overlay: {overlayOpacity}%</Label><Slider value={[overlayOpacity]} onValueChange={(v) => setOverlayOpacity(v[0])} min={0} max={100} step={5} /></div>
                  <div className="flex items-center gap-2"><Switch checked={isActive} onCheckedChange={setIsActive} /><Label>Banner Ativo</Label></div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit"><Save className="w-4 h-4 mr-2" /> {editingBanner ? "Atualizar" : "Criar"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {sortedBanners.map((banner: any, index: number) => (
          <div key={banner.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white">
            <img src={banner.image} alt={banner.title} className="w-32 h-20 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-semibold">{banner.title}</h3>
              <p className="text-sm text-gray-500">{banner.subtitle}</p>
              <span className={`text-xs px-2 py-1 rounded ${banner.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {banner.isActive ? "Ativo" : "Inativo"}
              </span>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" disabled={index === 0} onClick={() => reorderMutation.mutate({ id: banner.id, newOrder: banner.order - 1 })}><MoveUp className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" disabled={index === sortedBanners.length - 1} onClick={() => reorderMutation.mutate({ id: banner.id, newOrder: banner.order + 1 })}><MoveDown className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" onClick={() => handleEdit(banner)}><Pencil className="w-4 h-4" /></Button>
              <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeleteId(banner.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      {deleteId && <DeleteConfirmDialog open={true} onOpenChange={(open) => !open && setDeleteId(null)} onConfirm={() => deleteMutation.mutate({ id: deleteId })} title="Excluir Banner" description="Tem certeza que deseja excluir este banner?" />}
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

  const resetForm = () => { setEditingId(null); setShowForm(false); setName(""); setImageUrl(""); setLink(""); };

  const handleEdit = (selo: any) => {
    setEditingId(selo.id);
    setName(selo.name || "");
    setImageUrl(selo.image_url || "");
    setLink(selo.link || "");
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageUrl) { toast.error("Nome e imagem são obrigatórios!"); return; }
    if (editingId) { updateMutation.mutate({ id: editingId, name, imageUrl, link }); }
    else { addMutation.mutate({ name, imageUrl, link }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Selos e Certificações</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="gap-2"><Plus className="w-4 h-4" /> Novo Selo</Button>
      </div>

      {showForm && (
        <Card className="border-primary">
          <CardHeader><CardTitle>{editingId ? "Editar Selo" : "Novo Selo"}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Nome do Selo *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: ISO 9001" /></div>
                <div><Label>Link (opcional)</Label><Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." /></div>
              </div>
              <div><Label>Imagem do Selo *</Label><ImageUpload value={imageUrl} onChange={setImageUrl} onRemove={() => setImageUrl("")} aspectRatio={1} /></div>
              <div className="flex gap-2">
                <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}><Save className="w-4 h-4 mr-2" /> {editingId ? "Atualizar" : "Adicionar"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {selos.map((selo: any) => (
          <div key={selo.id} className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow relative group">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(selo)} className="h-7 w-7 p-0"><Pencil className="w-3 h-3" /></Button>
              <Button variant="ghost" size="sm" className="text-red-600 h-7 w-7 p-0" onClick={() => setDeleteId(selo.id)}><Trash2 className="w-3 h-3" /></Button>
            </div>
            <img src={selo.image_url} alt={selo.name} className="h-16 mx-auto object-contain mb-2" />
            <p className="text-sm font-medium truncate">{selo.name}</p>
          </div>
        ))}
      </div>

      {deleteId && <DeleteConfirmDialog open={true} onOpenChange={(open) => !open && setDeleteId(null)} onConfirm={() => deleteMutation.mutate({ id: deleteId })} title="Excluir Selo" description="Tem certeza que deseja excluir este selo?" />}
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
    onSuccess: () => { toast.success("Logo adicionado!"); refetch(); resetForm(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const updateMutation = trpc.home.updatePress.useMutation({
    onSuccess: () => { toast.success("Logo atualizado!"); refetch(); resetForm(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const deleteMutation = trpc.home.deletePress.useMutation({
    onSuccess: () => { toast.success("Logo removido!"); refetch(); setDeleteId(null); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const resetForm = () => { setEditingId(null); setShowForm(false); setName(""); setImageUrl(""); setLink(""); };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setName(item.name || "");
    setImageUrl(item.image_url || "");
    setLink(item.link || "");
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageUrl) { toast.error("Nome e imagem são obrigatórios!"); return; }
    if (editingId) { updateMutation.mutate({ id: editingId, name, imageUrl, link }); }
    else { addMutation.mutate({ name, imageUrl, link }); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Logos de Imprensa</h2>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="gap-2"><Plus className="w-4 h-4" /> Novo Logo</Button>
      </div>

      {showForm && (
        <Card className="border-primary">
          <CardHeader><CardTitle>{editingId ? "Editar Logo" : "Novo Logo"}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Nome do Veículo *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Globo" /></div>
                <div><Label>Link (opcional)</Label><Input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." /></div>
              </div>
              <div><Label>Logo do Veículo *</Label><ImageUpload value={imageUrl} onChange={setImageUrl} onRemove={() => setImageUrl("")} aspectRatio={16/9} /></div>
              <div className="flex gap-2">
                <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}><Save className="w-4 h-4 mr-2" /> {editingId ? "Atualizar" : "Adicionar"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {press.map((item: any) => (
          <div key={item.id} className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow relative group">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="h-7 w-7 p-0"><Pencil className="w-3 h-3" /></Button>
              <Button variant="ghost" size="sm" className="text-red-600 h-7 w-7 p-0" onClick={() => setDeleteId(item.id)}><Trash2 className="w-3 h-3" /></Button>
            </div>
            <img src={item.image_url} alt={item.name} className="h-12 mx-auto object-contain mb-2" />
            <p className="text-sm font-medium truncate">{item.name}</p>
          </div>
        ))}
      </div>

      {deleteId && <DeleteConfirmDialog open={true} onOpenChange={(open) => !open && setDeleteId(null)} onConfirm={() => deleteMutation.mutate({ id: deleteId })} title="Excluir Logo" description="Tem certeza que deseja excluir este logo?" />}
    </div>
  );
}

// ============ DIFERENCIAIS SECTION ============
function DiferenciaisSection() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("DollarSign");

  // Textos da seção
  const { data: settings = [], refetch: refetchSettings } = trpc.home.getHomeSettings.useQuery();
  const { data: diferenciais = [], refetch } = trpc.home.getDiferenciais.useQuery();
  
  const updateSettingsMutation = trpc.home.updateHomeSection.useMutation({
    onSuccess: () => { toast.success("Textos salvos!"); refetchSettings(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const addMutation = trpc.home.addDiferencial.useMutation({
    onSuccess: () => { toast.success("Diferencial adicionado!"); refetch(); resetForm(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const updateMutation = trpc.home.updateDiferencial.useMutation({
    onSuccess: () => { toast.success("Diferencial atualizado!"); refetch(); resetForm(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const deleteMutation = trpc.home.deleteDiferencial.useMutation({
    onSuccess: () => { toast.success("Diferencial removido!"); refetch(); setDeleteId(null); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const getValue = (key: string) => settings.find((s: any) => s.field === key)?.value || "";
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutSubtitle, setAboutSubtitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [aboutImage, setAboutImage] = useState("");

  useEffect(() => {
    setAboutTitle(getValue("about_title") || "Empresários Educacionais:");
    setAboutSubtitle(getValue("about_subtitle") || "transformem propósito em rentabilidade real");
    setAboutDescription(getValue("about_description") || "Ser parceiro da LA Educação é sair do jogo pequeno.");
    setAboutImage(getValue("about_image") || "");
  }, [settings]);

  const resetForm = () => { setEditingId(null); setShowForm(false); setTitle(""); setDescription(""); setIcon("DollarSign"); };

  const handleEdit = (item: any) => {
    setEditingId(item.id); setShowForm(true); setTitle(item.title); setDescription(item.description || ""); setIcon(item.icon || "DollarSign");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Título é obrigatório"); return; }
    if (editingId) { updateMutation.mutate({ id: editingId, title, description, icon }); }
    else { const maxOrder = Math.max(...diferenciais.map((d: any) => d.sort_order || 0), 0); addMutation.mutate({ title, description, icon, sortOrder: maxOrder + 1 }); }
  };

  const handleSaveTexts = () => {
    updateSettingsMutation.mutate({
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
      
      {/* Textos da Seção */}
      <Card>
        <CardHeader><CardTitle>Textos Principais</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div><Label>Título Principal</Label><Input value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} placeholder="Empresários Educacionais:" /></div>
              <div><Label>Subtítulo</Label><Input value={aboutSubtitle} onChange={(e) => setAboutSubtitle(e.target.value)} placeholder="transformem propósito em..." /></div>
              <div><Label>Descrição</Label><Textarea value={aboutDescription} onChange={(e) => setAboutDescription(e.target.value)} rows={4} placeholder="Ser parceiro da LA Educação..." /></div>
            </div>
            <div><Label>Imagem da Seção</Label><ImageUpload value={aboutImage} onChange={setAboutImage} onRemove={() => setAboutImage("")} aspectRatio={4/3} /></div>
          </div>
          <Button onClick={handleSaveTexts} disabled={updateSettingsMutation.isPending}><Save className="w-4 h-4 mr-2" /> Salvar Textos</Button>
        </CardContent>
      </Card>

      {/* Lista de Diferenciais */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Diferenciais (Cards)</CardTitle>
          <Button onClick={() => { resetForm(); setShowForm(true); }} size="sm" className="gap-2"><Plus className="w-4 h-4" /> Novo Diferencial</Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <Card className="border-primary mb-4">
              <CardContent className="pt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><Label>Título *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Maior Repasse do Brasil" /></div>
                    <div><Label>Descrição</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Descrição do diferencial..." /></div>
                    <div>
                      <Label>Ícone</Label>
                      <Select value={icon} onValueChange={setIcon}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((opt) => {
                            const IconComp = iconMap[opt.value];
                            return (
                              <SelectItem key={opt.value} value={opt.value}>
                                <div className="flex items-center gap-2"><IconComp className="w-4 h-4" />{opt.label}</div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
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

          <div className="grid gap-3">
            {diferenciais.map((item: any) => {
              const IconComp = iconMap[item.icon] || DollarSign;
              return (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <IconComp className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeleteId(item.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {deleteId && <DeleteConfirmDialog open={true} onOpenChange={(open) => !open && setDeleteId(null)} onConfirm={() => deleteMutation.mutate({ id: deleteId })} title="Excluir Diferencial" description="Tem certeza que deseja excluir este diferencial?" />}
    </div>
  );
}

// ============ PLATAFORMA SECTION (CRUD COMPLETO) ============
function PlataformaSection() {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Check");

  const { data: settings = [], refetch: refetchSettings } = trpc.home.getHomeSettings.useQuery();
  const { data: features = [], refetch } = trpc.home.getPlatformFeatures.useQuery();
  
  const updateSettingsMutation = trpc.home.updateHomeSection.useMutation({
    onSuccess: () => { toast.success("Textos salvos!"); refetchSettings(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const addMutation = trpc.home.addPlatformFeature.useMutation({
    onSuccess: () => { toast.success("Feature adicionada!"); refetch(); resetForm(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const updateMutation = trpc.home.updatePlatformFeature.useMutation({
    onSuccess: () => { toast.success("Feature atualizada!"); refetch(); resetForm(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const deleteMutation = trpc.home.deletePlatformFeature.useMutation({
    onSuccess: () => { toast.success("Feature removida!"); refetch(); setDeleteId(null); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const getValue = (key: string) => settings.find((s: any) => s.field === key)?.value || "";
  const [platformTitle, setPlatformTitle] = useState("");
  const [platformSubtitle, setPlatformSubtitle] = useState("");
  const [platformDescription, setPlatformDescription] = useState("");
  const [platformImage, setPlatformImage] = useState("");

  useEffect(() => {
    setPlatformTitle(getValue("platform_title") || "Plataforma Intuitiva");
    setPlatformSubtitle(getValue("platform_subtitle") || "Experiência do Aluno");
    setPlatformDescription(getValue("platform_description") || "");
    setPlatformImage(getValue("platform_image") || "");
  }, [settings]);

  const resetForm = () => { setEditingId(null); setShowForm(false); setTitle(""); setDescription(""); setIcon("Check"); };

  const handleEdit = (item: any) => {
    setEditingId(item.id); setShowForm(true); setTitle(item.title); setDescription(item.description || ""); setIcon(item.icon || "Check");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Título é obrigatório"); return; }
    if (editingId) { updateMutation.mutate({ id: editingId, title, description, icon }); }
    else { const maxOrder = Math.max(...features.map((f: any) => f.sort_order || 0), 0); addMutation.mutate({ title, description, icon, sortOrder: maxOrder + 1 }); }
  };

  const handleSaveTexts = () => {
    updateSettingsMutation.mutate({
      section: "student_experience",
      fields: [
        { key: "title", value: platformTitle },
        { key: "label", value: platformSubtitle },
        { key: "description", value: platformDescription },
        { key: "image_url", value: platformImage },
      ],
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Seção Plataforma Intuitiva</h2>
      
      <Card>
        <CardHeader><CardTitle>Textos Principais</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div><Label>Título</Label><Input value={platformTitle} onChange={(e) => setPlatformTitle(e.target.value)} placeholder="Plataforma Intuitiva" /></div>
              <div><Label>Subtítulo</Label><Input value={platformSubtitle} onChange={(e) => setPlatformSubtitle(e.target.value)} placeholder="Experiência do Aluno" /></div>
              <div><Label>Descrição</Label><Textarea value={platformDescription} onChange={(e) => setPlatformDescription(e.target.value)} rows={4} placeholder="Descrição da plataforma..." /></div>
            </div>
            <div><Label>Imagem da Plataforma</Label><ImageUpload value={platformImage} onChange={setPlatformImage} onRemove={() => setPlatformImage("")} aspectRatio={16/9} /></div>
          </div>
          <Button onClick={handleSaveTexts} disabled={updateSettingsMutation.isPending}><Save className="w-4 h-4 mr-2" /> Salvar Textos</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Features da Plataforma</CardTitle>
          <Button onClick={() => { resetForm(); setShowForm(true); }} size="sm" className="gap-2"><Plus className="w-4 h-4" /> Nova Feature</Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <Card className="border-primary mb-4">
              <CardContent className="pt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><Label>Título *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Acesso 24h" /></div>
                    <div><Label>Descrição</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Descrição da feature..." /></div>
                    <div>
                      <Label>Ícone</Label>
                      <Select value={icon} onValueChange={setIcon}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((opt) => {
                            const IconComp = iconMap[opt.value];
                            return (
                              <SelectItem key={opt.value} value={opt.value}>
                                <div className="flex items-center gap-2"><IconComp className="w-4 h-4" />{opt.label}</div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
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

          <div className="grid gap-3">
            {features.map((item: any) => {
              const IconComp = iconMap[item.icon] || Check;
              return (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg bg-white">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <IconComp className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Pencil className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeleteId(item.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate({ id: deleteId })}
        title="Excluir Feature"
        description="Tem certeza que deseja excluir esta feature da plataforma?"
      />
    </div>
  );
}

function EcossistemaSection() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [banner, setBanner] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [tipo, setTipo] = useState("");
  const [categoria, setCategoria] = useState("");

  const { data: settings = [], refetch: refetchSettings } = trpc.home.getHomeSettings.useQuery();
  const { data: institutions = [], refetch, isLoading } = trpc.home.getEcosystemInstitutions.useQuery();
  
  const updateSettingsMutation = trpc.home.updateHomeSection.useMutation({
    onSuccess: () => { toast.success("Textos salvos!"); refetchSettings(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const addMutation = trpc.home.addEcosystemInstitution.useMutation({
    onSuccess: () => { toast.success("Instituição adicionada!"); refetch(); resetForm(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const updateMutation = trpc.home.updateEcosystemInstitution.useMutation({
    onSuccess: () => { toast.success("Instituição atualizada!"); refetch(); resetForm(); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const deleteMutation = trpc.home.deleteEcosystemInstitution.useMutation({
    onSuccess: () => { toast.success("Instituição excluída!"); refetch(); setDeleteId(null); },
    onError: (e: any) => toast.error(`Erro: ${e.message}`),
  });

  const getValue = (key: string) => settings.find((s: any) => s.field === key)?.value || "";
  const [ecoTitle, setEcoTitle] = useState("");
  const [ecoSubtitle, setEcoSubtitle] = useState("");
  const [ecoDescription, setEcoDescription] = useState("");

  useEffect(() => {
    setEcoTitle(getValue("ecosystem_title") || "Por que somos o maior");
    setEcoSubtitle(getValue("ecosystem_subtitle") || "Ecossistema Educacional");
    setEcoDescription(getValue("ecosystem_description") || "À disposição de nossos parceiros e alunos...");
  }, [settings]);

  const handleSaveTexts = () => {
    updateSettingsMutation.mutate({
      section: "ecosystem",
      fields: [
        { key: "ecosystem_title", value: ecoTitle },
        { key: "ecosystem_subtitle", value: ecoSubtitle },
        { key: "ecosystem_description", value: ecoDescription },
      ],
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setShowForm(false);
    setId("");
    setName("");
    setLogo("");
    setBanner("");
    setWebsite("");
    setDescription("");
    setTipo("");
    setCategoria("");
  };

  const handleEdit = (inst: any) => {
    setEditingId(inst.id);
    setId(inst.id || "");
    setName(inst.name || "");
    setLogo(inst.logo || "");
    setBanner(inst.banner || "");
    setWebsite(inst.website || "");
    setDescription(inst.description || "");
    setTipo(inst.tipo || "");
    setCategoria(inst.categoria || "");
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !logo) { toast.error("Nome e logo são obrigatórios!"); return; }
    
    if (editingId) {
      updateMutation.mutate({ id: editingId, name, logo, website, description, tipo, categoria, banner });
    } else {
      const newId = id || name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      addMutation.mutate({ id: newId, name, logo, website, description, tipo, categoria, banner });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Seção Ecossistema</h2>
      
      <Card>
        <CardHeader><CardTitle>Textos da Seção</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Título</Label><Input value={ecoTitle} onChange={(e) => setEcoTitle(e.target.value)} placeholder="Por que somos o maior..." /></div>
          <div><Label>Subtítulo (em destaque)</Label><Input value={ecoSubtitle} onChange={(e) => setEcoSubtitle(e.target.value)} placeholder="Ecossistema Educacional" /></div>
          <div><Label>Descrição</Label><Textarea value={ecoDescription} onChange={(e) => setEcoDescription(e.target.value)} rows={3} placeholder="À disposição de nossos parceiros..." /></div>
          <Button onClick={handleSaveTexts} disabled={updateSettingsMutation.isPending}><Save className="w-4 h-4 mr-2" /> Salvar Textos</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Instituições do Ecossistema ({institutions.length})</CardTitle>
          <Button onClick={() => { resetForm(); setShowForm(true); }} size="sm" className="gap-2"><Plus className="w-4 h-4" /> Nova Instituição</Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <Card className="border-primary mb-6">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Nome da Instituição *</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Faculdade LA" /></div>
                    <div><Label>Website (opcional)</Label><Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." /></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Tipo</Label><Input value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="Ex: Faculdade, Instituto, Empresa" /></div>
                    <div><Label>Categoria</Label><Input value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Ex: Educação, Tecnologia" /></div>
                  </div>
                  <div><Label>Descrição (opcional)</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Breve descrição da instituição..." /></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Logo da Instituição *</Label><ImageUpload value={logo} onChange={setLogo} onRemove={() => setLogo("")} aspectRatio={1} /></div>
                    <div><Label>Banner (opcional)</Label><ImageUpload value={banner} onChange={setBanner} onRemove={() => setBanner("")} aspectRatio={16/9} /></div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}><Save className="w-4 h-4 mr-2" /> {editingId ? "Atualizar" : "Adicionar"}</Button>
                    <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Carregando instituições...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {institutions.map((inst: any) => (
                <Card key={inst.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Header com gradiente */}
                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-4 text-white">
                    <h3 className="text-lg font-bold truncate">{inst.name}</h3>
                    <p className="text-sm text-pink-100">{inst.tipo || "Instituição"}</p>
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    {/* Logo */}
                    <div className="flex justify-center">
                      {inst.logo ? (
                        <img src={inst.logo} alt={inst.name} className="h-16 w-auto object-contain" />
                      ) : (
                        <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Building className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Categoria */}
                    {inst.categoria && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Categoria</p>
                        <p className="text-sm text-gray-700">{inst.categoria}</p>
                      </div>
                    )}

                    {/* Descrição */}
                    {inst.description && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Descrição</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{inst.description}</p>
                      </div>
                    )}

                    {/* Status das Imagens */}
                    <div className="flex gap-2 text-xs">
                      <span className={`px-2 py-1 rounded ${inst.logo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        Logo: {inst.logo ? '✓' : '✗'}
                      </span>
                      <span className={`px-2 py-1 rounded ${inst.banner ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        Banner: {inst.banner ? '✓' : '✗'}
                      </span>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-2 pt-2 border-t border-gray-200">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEdit(inst)}>
                        <Pencil className="w-3 h-3 mr-1" /> Editar
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => setDeleteId(inst.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                      {inst.website && (
                        <a href={inst.website} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {deleteId && <DeleteConfirmDialog open={true} onOpenChange={(open) => !open && setDeleteId(null)} onConfirm={() => deleteMutation.mutate({ id: deleteId })} title="Excluir Instituição" description="Tem certeza que deseja excluir esta instituição do ecossistema?" />}
    </div>
  );
}

// ============ CURSOS SECTION ============
function CursosSection() {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-500" />
            Gerenciar Cursos
          </h2>
          <p className="text-gray-600 text-sm">Adicione, edite ou remova cursos do catálogo</p>
        </div>
        <Button 
          className="gap-2 bg-gradient-to-r from-[#9d197d] to-purple-600 hover:from-[#8a1570] hover:to-purple-700" 
          onClick={() => setLocation("/admin-la-educacao/cursos/novo")}
        >
          <Plus className="w-4 h-4" />
          Novo Curso
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Total de Cursos</p>
                <p className="text-2xl font-bold text-gray-900">{courses?.length || 0}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Cursos Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses?.filter(c => c.isActive).length || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase">Categorias</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses ? new Set(courses.map(c => c.category)).size : 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Cursos */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando cursos...</p>
          </div>
        </div>
      ) : !courses || courses.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum curso cadastrado</h3>
              <p className="text-gray-600 mb-6">Comece adicionando seu primeiro curso ao catálogo</p>
              <Button 
                className="gap-2 bg-gradient-to-r from-[#9d197d] to-purple-600" 
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
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Imagem do Curso */}
                  {course.image ? (
                    <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center shadow-lg flex-shrink-0">
                      <BookOpen className="w-10 h-10 text-purple-500" />
                    </div>
                  )}

                  {/* Informações do Curso */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                            <GraduationCap className="w-3 h-3" />
                            {course.category}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            <BookOpen className="w-3 h-3" />
                            {course.modality}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            {course.duration}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
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
                    <div className="flex gap-2 mt-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 hover:bg-purple-50 hover:text-purple-700"
                        onClick={() => setLocation(`/admin-la-educacao/cursos/${course.id}/grade`)}
                      >
                        <BookOpen className="w-3 h-3" />
                        Grade
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1 hover:bg-blue-50 hover:text-blue-700"
                        onClick={() => setLocation(`/admin-la-educacao/cursos/${course.id}`)}
                      >
                        <Pencil className="w-3 h-3" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(course.id, course.title)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-3 h-3" />
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
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="banners">Banners</TabsTrigger>
            <TabsTrigger value="selos">Selos</TabsTrigger>
            <TabsTrigger value="imprensa">Imprensa</TabsTrigger>
            <TabsTrigger value="diferenciais">Diferenciais</TabsTrigger>
            <TabsTrigger value="plataforma">Plataforma</TabsTrigger>
            <TabsTrigger value="ecossistema">Ecossistema</TabsTrigger>
            <TabsTrigger value="cursos">Cursos</TabsTrigger>
          </TabsList>

          <TabsContent value="banners" className="mt-6"><BannerSection /></TabsContent>
          <TabsContent value="selos" className="mt-6"><SelosSection /></TabsContent>
          <TabsContent value="imprensa" className="mt-6"><ImprensaSection /></TabsContent>
          <TabsContent value="diferenciais" className="mt-6"><DiferenciaisSection /></TabsContent>
          <TabsContent value="plataforma" className="mt-6"><PlataformaSection /></TabsContent>
          <TabsContent value="ecossistema" className="mt-6"><EcossistemaSection /></TabsContent>
          <TabsContent value="cursos" className="mt-6"><CursosSection /></TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
