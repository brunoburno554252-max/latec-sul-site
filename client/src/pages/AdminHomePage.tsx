import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, MoveUp, MoveDown, GraduationCap, BookOpen, Clock, Image as ImageIcon } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

function BannerSection() {
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaLink, setCtaLink] = useState('');
  const [displayDuration, setDisplayDuration] = useState(10);
  const [textPosition, setTextPosition] = useState<'left' | 'center' | 'right'>('left');
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [isActive, setIsActive] = useState(true);
  const [showContent, setShowContent] = useState(true);

  const { data: banners = [], refetch } = trpc.adminBanners.getAll.useQuery();

  const createMutation = trpc.adminBanners.create.useMutation({
    onSuccess: () => { toast.success('Banner criado!'); refetch(); resetForm(); },
    onError: (e: any) => toast.error('Erro: ' + e.message),
  });

  const updateMutation = trpc.adminBanners.update.useMutation({
    onSuccess: () => { toast.success('Banner atualizado!'); refetch(); resetForm(); },
    onError: (e: any) => toast.error('Erro: ' + e.message),
  });

  const deleteMutation = trpc.adminBanners.delete.useMutation({
    onSuccess: () => { toast.success('Banner excluído!'); refetch(); },
    onError: (e: any) => toast.error('Erro: ' + e.message),
  });

  const reorderMutation = trpc.adminBanners.reorder.useMutation({
    onSuccess: () => { toast.success('Ordem atualizada!'); refetch(); },
  });

  const resetForm = () => {
    setEditingBanner(null);
    setShowForm(false);
    setTitle(''); setSubtitle(''); setImage(''); setCtaText(''); setCtaLink('');
    setDisplayDuration(10); setTextPosition('left'); setOverlayOpacity(50); setIsActive(true); setShowContent(true);
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setShowForm(true);
    setTitle(banner.title); setSubtitle(banner.subtitle || ''); setImage(banner.image);
    setCtaText(banner.ctaText || ''); setCtaLink(banner.ctaLink || '');
    setDisplayDuration(banner.displayDuration || 10); setTextPosition(banner.textPosition || 'left');
    setOverlayOpacity(banner.overlayOpacity || 50); setIsActive(banner.isActive);
    setShowContent(banner.showContent ?? true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !image) { toast.error('Título e imagem são obrigatórios'); return; }
    const data = { title, subtitle: subtitle || undefined, image, ctaText: ctaText || undefined, ctaLink: ctaLink || undefined, displayDuration, textPosition, overlayOpacity, isActive, showContent };
    if (editingBanner) { updateMutation.mutate({ id: editingBanner.id, ...data }); }
    else { const maxOrder = banners.length > 0 ? Math.max(...banners.map((b: any) => b.order), 0) : 0; createMutation.mutate({ ...data, order: maxOrder + 1 }); }
  };

  const handleMove = (id: number, direction: 'up' | 'down') => {
    const index = sortedBanners.findIndex(b => b.id === id);
    if (direction === 'up' && index > 0) {
      reorderMutation.mutate({ id1: id, id2: sortedBanners[index - 1].id });
    } else if (direction === 'down' && index < sortedBanners.length - 1) {
      reorderMutation.mutate({ id1: id, id2: sortedBanners[index + 1].id });
    }
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
          <CardHeader><CardTitle>{editingBanner ? 'Editar Banner' : 'Novo Banner'}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div><Label>Título *</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título do banner" /></div>
                  <div><Label>Subtítulo</Label><Textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtítulo" rows={2} /></div>
                  <div><Label>Texto do Botão</Label><Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} placeholder="Ex: Quero ser Parceiro" /></div>
                  <div><Label>Link do Botão</Label><Input value={ctaLink} onChange={(e) => setCtaLink(e.target.value)} placeholder="Ex: /parceiro" /></div>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-100">
                    <div>
                      <Label htmlFor="showContent">Mostrar Texto/Botão</Label>
                      <p className="text-xs text-blue-600">Desative se a imagem já tiver texto</p>
                    </div>
                    <Switch id="showContent" checked={showContent} onCheckedChange={setShowContent} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div><Label>Imagem do Banner *</Label><ImageUpload value={image} onChange={setImage} onRemove={() => setImage('')} aspectRatio={4/1} /></div>
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
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingBanner ? 'Atualizar Banner' : 'Criar Banner'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {sortedBanners.map((banner: any) => (
          <Card key={banner.id} className={banner.isActive ? '' : 'opacity-60'}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-32 h-20 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={banner.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{banner.title || 'Sem título'}</h3>
                <p className="text-sm text-gray-500">Ordem: {banner.order} | {banner.isActive ? 'Ativo' : 'Inativo'}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleMove(banner.id, 'up')}><MoveUp className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleMove(banner.id, 'down')}><MoveDown className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(banner)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-red-600" onClick={() => { if(window.confirm('Excluir?')) deleteMutation.mutate({ id: banner.id }) }}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SelosSection() {
  const { data: selos = [], refetch } = trpc.adminSelos.getAll.useQuery();
  const [showForm, setShowForm] = useState(false);
  const [editingSelo, setEditingSelo] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);

  const createMutation = trpc.adminSelos.create.useMutation({ onSuccess: () => { toast.success('Selo criado!'); refetch(); resetForm(); } });
  const updateMutation = trpc.adminSelos.update.useMutation({ onSuccess: () => { toast.success('Selo atualizado!'); refetch(); resetForm(); } });
  const deleteMutation = trpc.adminSelos.delete.useMutation({ onSuccess: () => { toast.success('Selo excluído!'); refetch(); } });

  const resetForm = () => { setShowForm(false); setEditingSelo(null); setTitle(''); setImage(''); setIsActive(true); };
  const handleEdit = (selo: any) => { setEditingSelo(selo); setShowForm(true); setTitle(selo.title); setImage(selo.image); setIsActive(selo.isActive); };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !image) return toast.error('Preencha todos os campos');
    if (editingSelo) updateMutation.mutate({ id: editingSelo.id, title, image, isActive });
    else createMutation.mutate({ title, image, isActive, order: selos.length + 1 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Selos e Certificações</h2>
        <Button onClick={() => setShowForm(true)} className="gap-2"><Plus className="w-4 h-4" /> Novo Selo</Button>
      </div>
      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div><Label>Título</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                  <div className="flex items-center gap-2"><Switch checked={isActive} onCheckedChange={setIsActive} /><Label>Ativo</Label></div>
                </div>
                <div><Label>Imagem</Label><ImageUpload value={image} onChange={setImage} onRemove={() => setImage('')} /></div>
              </div>
              <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button><Button type="submit">Salvar</Button></div>
            </form>
          </CardContent>
        </Card>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {selos.map((selo: any) => (
          <Card key={selo.id} className={selo.isActive ? '' : 'opacity-50'}>
            <CardContent className="p-4 text-center space-y-2">
              <img src={selo.image} className="h-16 mx-auto object-contain" />
              <p className="font-medium text-sm">{selo.title}</p>
              <div className="flex justify-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(selo)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteMutation.mutate({ id: selo.id })}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ImprensaSection() {
  const { data: imprensa = [], refetch } = trpc.adminImprensa.getAll.useQuery();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [isActive, setIsActive] = useState(true);

  const createMutation = trpc.adminImprensa.create.useMutation({ onSuccess: () => { toast.success('Criado!'); refetch(); resetForm(); } });
  const updateMutation = trpc.adminImprensa.update.useMutation({ onSuccess: () => { toast.success('Atualizado!'); refetch(); resetForm(); } });
  const deleteMutation = trpc.adminImprensa.delete.useMutation({ onSuccess: () => { toast.success('Excluído!'); refetch(); } });

  const resetForm = () => { setShowForm(false); setEditing(null); setName(''); setLogo(''); setIsActive(true); };
  const handleEdit = (item: any) => { setEditing(item); setShowForm(true); setName(item.name); setLogo(item.logo); setIsActive(item.isActive); };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) updateMutation.mutate({ id: editing.id, name, logo, isActive });
    else createMutation.mutate({ name, logo, isActive, order: imprensa.length + 1 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Logos da Imprensa</h2>
        <Button onClick={() => setShowForm(true)} className="gap-2"><Plus className="w-4 h-4" /> Novo Logo</Button>
      </div>
      {showForm && (
        <Card><CardContent className="pt-6"><form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Nome</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><Label>Logo</Label><ImageUpload value={logo} onChange={setLogo} onRemove={() => setLogo('')} /></div>
          </div>
          <div className="flex items-center gap-2"><Switch checked={isActive} onCheckedChange={setIsActive} /><Label>Ativo</Label></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button><Button type="submit">Salvar</Button></div>
        </form></CardContent></Card>
      )}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {imprensa.map((item: any) => (
          <Card key={item.id} className={item.isActive ? '' : 'opacity-50'}>
            <CardContent className="p-4 text-center space-y-2">
              <img src={item.logo} className="h-8 mx-auto object-contain grayscale" />
              <div className="flex justify-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteMutation.mutate({ id: item.id })}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DiferenciaisSection() {
  const { data: diferenciais = [], refetch } = trpc.adminDiferenciais.getAll.useQuery();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [isActive, setIsActive] = useState(true);

  const createMutation = trpc.adminDiferenciais.create.useMutation({ onSuccess: () => { toast.success('Criado!'); refetch(); resetForm(); } });
  const updateMutation = trpc.adminDiferenciais.update.useMutation({ onSuccess: () => { toast.success('Atualizado!'); refetch(); resetForm(); } });
  const deleteMutation = trpc.adminDiferenciais.delete.useMutation({ onSuccess: () => { toast.success('Excluído!'); refetch(); } });

  const resetForm = () => { setShowForm(false); setEditing(null); setTitle(''); setDescription(''); setIcon(''); setIsActive(true); };
  const handleEdit = (item: any) => { setEditing(item); setShowForm(true); setTitle(item.title); setDescription(item.description); setIcon(item.icon || ''); setIsActive(item.isActive); };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) updateMutation.mutate({ id: editing.id, title, description, icon, isActive });
    else createMutation.mutate({ title, description, icon, isActive, order: diferenciais.length + 1 });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Diferenciais</h2>
        <Button onClick={() => setShowForm(true)} className="gap-2"><Plus className="w-4 h-4" /> Novo Diferencial</Button>
      </div>
      {showForm && (
        <Card><CardContent className="pt-6"><form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Título</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div><Label>Descrição</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div><Label>Ícone (Lucide name)</Label><Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Ex: GraduationCap" /></div>
          <div className="flex items-center gap-2"><Switch checked={isActive} onCheckedChange={setIsActive} /><Label>Ativo</Label></div>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button><Button type="submit">Salvar</Button></div>
        </form></CardContent></Card>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {diferenciais.map((item: any) => (
          <Card key={item.id} className={item.isActive ? '' : 'opacity-50'}>
            <CardContent className="p-4 flex justify-between items-start">
              <div><h3 className="font-bold">{item.title}</h3><p className="text-sm text-gray-500">{item.description}</p></div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deleteMutation.mutate({ id: item.id })}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PlataformaSection() {
  const { data: settings, refetch } = trpc.adminHome.getSettings.useQuery();
  const updateMutation = trpc.adminHome.updateSettings.useMutation({ onSuccess: () => { toast.success('Salvo!'); refetch(); } });
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState('');

  React.useEffect(() => { if (settings) { setTitle(settings.platformTitle || ''); setDesc(settings.platformDescription || ''); setImg(settings.platformImage || ''); } }, [settings]);

  return (
    <Card><CardContent className="pt-6 space-y-4">
      <div><Label>Título da Seção Plataforma</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <div><Label>Descrição</Label><Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} /></div>
      <div><Label>Imagem da Plataforma</Label><ImageUpload value={img} onChange={setImg} onRemove={() => setImg('')} /></div>
      <Button onClick={() => updateMutation.mutate({ platformTitle: title, platformDescription: desc, platformImage: img })}>Salvar Alterações</Button>
    </CardContent></Card>
  );
}

function EcossistemaSection() {
  const { data: settings, refetch } = trpc.adminHome.getSettings.useQuery();
  const updateMutation = trpc.adminHome.updateSettings.useMutation({ onSuccess: () => { toast.success('Salvo!'); refetch(); } });
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  React.useEffect(() => { if (settings) { setTitle(settings.ecosystemTitle || ''); setDesc(settings.ecosystemDescription || ''); } }, [settings]);

  return (
    <Card><CardContent className="pt-6 space-y-4">
      <div><Label>Título da Seção Ecossistema</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
      <div><Label>Descrição</Label><Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} /></div>
      <Button onClick={() => updateMutation.mutate({ ecosystemTitle: title, ecosystemDescription: desc })}>Salvar Alterações</Button>
    </CardContent></Card>
  );
}

function CursosSection() {
  const [, setLocation] = useLocation();
  const { data: courses = [], refetch } = trpc.adminCourses.getAll.useQuery();
  const deleteMutation = trpc.adminCourses.delete.useMutation({
    onSuccess: () => { toast.success('Curso excluído!'); refetch(); },
    onError: (e: any) => toast.error('Erro: ' + e.message),
  });

  const handleDelete = (id: number, title: string) => {
    if (window.confirm('Tem certeza que deseja excluir o curso "' + title + '"?')) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Cursos em Destaque</h2>
        <Button onClick={() => setLocation('/admin-la-educacao/cursos/novo')} className="gap-2">
          <Plus className="w-4 h-4" /> Novo Curso
        </Button>
      </div>
      {courses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
          <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Nenhum curso cadastrado ainda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {courses.map((course: any) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-32 bg-gray-100 flex-shrink-0">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 p-4 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs font-medium">
                            <GraduationCap className="w-3 h-3" /> {course.category}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            <BookOpen className="w-3 h-3" /> {course.modality}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                            <Clock className="w-3 h-3" /> {course.duration}
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${course.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                            {course.isActive ? '✓ Ativo' : '○ Inativo'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="gap-1 hover:bg-pink-50 hover:text-pink-700" onClick={() => setLocation('/admin-la-educacao/cursos/' + course.id + '/grade')}>
                        <BookOpen className="w-3 h-3" /> Grade
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 hover:bg-blue-50 hover:text-blue-700" onClick={() => setLocation('/admin-la-educacao/cursos/' + course.id)}>
                        <Pencil className="w-3 h-3" /> Editar
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1 text-red-600 hover:bg-red-50" onClick={() => handleDelete(course.id, course.title)} disabled={deleteMutation.isPending}>
                        <Trash2 className="w-3 h-3" /> Excluir
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
