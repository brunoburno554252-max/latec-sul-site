import React, { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Save, X, Building2, Calendar, Quote, Image, History, ArrowUp, ArrowDown } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

const ImageIcon = Image;

export default function AboutSection() {
  // Hero State
  const { data: hero, refetch: refetchHero } = trpc.adminAbout.getHero.useQuery();
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDesc, setHeroDesc] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [heroBadgeText, setHeroBadgeText] = useState('');
  const [heroBadgeValue, setHeroBadgeValue] = useState('');

  // Timeline State
  const { data: timeline, refetch: refetchTimeline } = trpc.adminAbout.getTimeline.useQuery();
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<any>(null);
  const [tlYear, setTlYear] = useState('');
  const [tlTitle, setTlTitle] = useState('');
  const [tlDesc, setTlDesc] = useState('');
  const [tlTag, setTlTag] = useState('');
  const [tlImage, setTlImage] = useState('');
  const [tlOrder, setTlOrder] = useState('');

  // Units State
  const { data: units, refetch: refetchUnits } = trpc.adminAbout.getUnits.useQuery();
  const [showUnitForm, setShowUnitForm] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any>(null);
  const [unitName, setUnitName] = useState('');
  const [unitImage, setUnitImage] = useState('');

  // Story State (Nossa História)
  const { data: story, refetch: refetchStory } = trpc.adminAbout.getStory.useQuery();
  const [storyTitle, setStoryTitle] = useState('Uma trajetória de crescimento, inovação e compromisso com a educação brasileira');
  const [storyContent, setStoryContent] = useState('');

  // Footer Quote State
  const { data: footerQuote, refetch: refetchFooter } = trpc.adminAbout.getFooterQuote.useQuery();
  const [quoteText, setQuoteText] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');
  const [quoteRole, setQuoteRole] = useState('');

  useEffect(() => {
    if (hero) {
      setHeroTitle(hero.title || '');
      setHeroDesc(hero.description || '');
      setHeroImage(hero.imageUrl || '');
      setHeroBadgeText(hero.badgeText || '');
      setHeroBadgeValue(hero.badgeValue || '');
    }
  }, [hero]);

  useEffect(() => {
    if (story) {
      setStoryTitle(story.title || '');
      setStoryContent(story.content || '');
    }
  }, [story]);

  useEffect(() => {
    if (footerQuote) {
      setQuoteText(footerQuote.quote || '');
      setQuoteAuthor(footerQuote.author || '');
      setQuoteRole(footerQuote.authorRole || '');
    }
  }, [footerQuote]);

  const updateHeroMutation = trpc.adminAbout.updateHero.useMutation({
    onSuccess: () => { toast.success('Seção Inicial atualizada!'); refetchHero(); },
    onError: (e) => toast.error('Erro ao atualizar Hero: ' + e.message)
  });

  const timelineMutation = trpc.adminAbout.createTimeline.useMutation({ 
    onSuccess: () => { toast.success('Marco criado!'); refetchTimeline(); resetTimelineForm(); },
    onError: (e) => toast.error('Erro ao criar marco: ' + e.message)
  });
  const updateTimelineMutation = trpc.adminAbout.updateTimeline.useMutation({ 
    onSuccess: () => { toast.success('Marco atualizado!'); refetchTimeline(); resetTimelineForm(); },
    onError: (e) => toast.error('Erro ao atualizar marco: ' + e.message)
  });
  const deleteTimelineMutation = trpc.adminAbout.deleteTimeline.useMutation({ 
    onSuccess: () => { toast.success('Marco excluído!'); refetchTimeline(); },
    onError: (e) => toast.error('Erro ao excluir marco: ' + e.message)
  });

  const unitMutation = trpc.adminAbout.createUnit.useMutation({ 
    onSuccess: () => { toast.success('Unidade criada!'); refetchUnits(); resetUnitForm(); },
    onError: (e) => toast.error('Erro ao criar unidade: ' + e.message)
  });
  const updateUnitMutation = trpc.adminAbout.updateUnit.useMutation({ 
    onSuccess: () => { toast.success('Unidade atualizada!'); refetchUnits(); resetUnitForm(); },
    onError: (e) => toast.error('Erro ao atualizar unidade: ' + e.message)
  });
  const deleteUnitMutation = trpc.adminAbout.deleteUnit.useMutation({ 
    onSuccess: () => { toast.success('Unidade excluída!'); refetchUnits(); },
    onError: (e) => toast.error('Erro ao excluir unidade: ' + e.message)
  });

  const updateStoryMutation = trpc.adminAbout.updateStory.useMutation({
    onSuccess: () => { toast.success('Nossa História atualizada!'); refetchStory(); },
    onError: (e) => toast.error('Erro ao atualizar história: ' + e.message)
  });

  const updateFooterMutation = trpc.adminAbout.updateFooterQuote.useMutation({
    onSuccess: () => { toast.success('Frase final atualizada!'); refetchFooter(); },
    onError: (e) => toast.error('Erro ao atualizar frase: ' + e.message)
  });

  const resetTimelineForm = () => { setShowTimelineForm(false); setEditingTimeline(null); setTlYear(''); setTlTitle(''); setTlDesc(''); setTlTag(''); setTlImage(''); setTlOrder(''); };
  const resetUnitForm = () => { setShowUnitForm(false); setEditingUnit(null); setUnitName(''); setUnitImage(''); };

  // Ordenar timeline por orderIndex
  const sortedTimeline = timeline ? [...timeline].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)) : [];

  return (
    <div className="space-y-10 pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-900">Gestão da Página Sobre Nós</h2>
        <p className="text-gray-500 text-lg">Edite todo o conteúdo, textos e imagens que aparecem na página institucional.</p>
      </div>

      {/* HERO SECTION */}
      <Card className="border-pink-200 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-pink-600 to-pink-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-6 h-6" /> 1. Seção Inicial (Banner Rosa)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Título Principal</Label>
                <Input 
                  value={heroTitle} 
                  onChange={(e) => setHeroTitle(e.target.value)} 
                  placeholder="Ex: Sobre a LA Educação"
                  className="h-12 text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base font-semibold">Descrição / História</Label>
                <Textarea 
                  value={heroDesc} 
                  onChange={(e) => setHeroDesc(e.target.value)} 
                  rows={8} 
                  placeholder="Descreva a história ou o propósito inicial..."
                  className="text-base leading-relaxed"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Texto do Badge (Ex: Nossa Sede)</Label>
                  <Input value={heroBadgeText} onChange={(e) => setHeroBadgeText(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Valor do Badge (Ex: +1000 m²)</Label>
                  <Input value={heroBadgeValue} onChange={(e) => setHeroBadgeValue(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base font-semibold">Imagem de Destaque (Sede)</Label>
                <div className="border-2 border-dashed border-pink-100 rounded-2xl p-2 bg-pink-50/30">
                  <ImageUpload value={heroImage} onChange={setHeroImage} onRemove={() => setHeroImage('')} aspectRatio={16/9} />
                </div>
                <p className="text-xs text-gray-400 mt-1 italic">* Esta imagem aparece ao lado do texto no banner rosa.</p>
              </div>
              <Button 
                className="w-full h-14 bg-pink-600 hover:bg-pink-700 text-lg font-bold shadow-md transition-all" 
                onClick={() => updateHeroMutation.mutate({ id: hero?.id || 1, title: heroTitle, description: heroDesc, imageUrl: heroImage, badgeText: heroBadgeText, badgeValue: heroBadgeValue })}
              >
                <Save className="w-5 h-5 mr-2" /> Salvar Alterações do Banner
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TIMELINE SECTION */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b pb-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <History className="w-7 h-7 text-blue-600" /> 2. Linha do Tempo (Trajetória)
            </h3>
            <p className="text-gray-500">Gerencie os marcos históricos que aparecem nos cards alternados. Use o campo "Posição" para ordenar.</p>
          </div>
          <Button onClick={() => { resetTimelineForm(); setShowTimelineForm(true); }} className="bg-blue-600 hover:bg-blue-700 h-11 px-6 font-bold">
            <Plus className="w-5 h-5 mr-2" /> Adicionar Novo Marco
          </Button>
        </div>

        {showTimelineForm && (
          <Card className="border-blue-200 shadow-xl bg-blue-50/10 animate-in fade-in slide-in-from-top-4 duration-300">
            <CardHeader className="border-b bg-blue-50/50">
              <CardTitle className="text-blue-800 flex items-center gap-2">
                {editingTimeline ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingTimeline ? `Editando Marco: ${editingTimeline.year}` : 'Cadastrar Novo Marco Histórico'}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="font-semibold">Ano ou Período</Label>
                      <Input value={tlYear} onChange={(e) => setTlYear(e.target.value)} placeholder="Ex: 2020 - 2021" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Tag</Label>
                      <Input value={tlTag} onChange={(e) => setTlTag(e.target.value)} placeholder="Ex: Idealização" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold text-orange-600">Posição *</Label>
                      <Input type="number" value={tlOrder} onChange={(e) => setTlOrder(e.target.value)} placeholder="Ex: 1, 2, 3..." className="border-orange-300" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Título do Marco</Label>
                    <Input value={tlTitle} onChange={(e) => setTlTitle(e.target.value)} placeholder="Ex: A ideia ganha forma" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-semibold">Descrição Detalhada</Label>
                    <Textarea value={tlDesc} onChange={(e) => setTlDesc(e.target.value)} rows={5} placeholder="Conte o que aconteceu neste período..." />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="font-semibold">Imagem do Marco (Opcional)</Label>
                    <div className="border-2 border-dashed border-blue-100 rounded-2xl p-2 bg-white">
                      <ImageUpload 
                        value={tlImage} 
                        onChange={setTlImage} 
                        onRemove={() => setTlImage('')} 
                        aspectRatio={16/9} 
                      />
                    </div>
                    <p className="text-xs text-gray-500 italic">Você pode remover a imagem clicando no botão "Remover" que aparece ao passar o mouse.</p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1 h-12 font-bold" onClick={resetTimelineForm}>
                      <X className="w-4 h-4 mr-2" /> Cancelar
                    </Button>
                    <Button className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 font-bold" onClick={() => {
                      if (!tlOrder) {
                        toast.error('Por favor, preencha o campo "Posição"');
                        return;
                      }
                      const data = { 
                        year: tlYear, 
                        title: tlTitle, 
                        description: tlDesc, 
                        tag: tlTag, 
                        imageUrl: tlImage || undefined,
                        orderIndex: parseInt(tlOrder) || 0
                      };
                      if (editingTimeline) updateTimelineMutation.mutate({ id: editingTimeline.id, ...data });
                      else timelineMutation.mutate(data);
                    }}>
                      <Save className="w-4 h-4 mr-2" /> {editingTimeline ? 'Atualizar Marco' : 'Criar Marco'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedTimeline && sortedTimeline.length > 0 ? sortedTimeline.map((item: any, idx: number) => (
            <Card key={item.id} className="overflow-hidden group border-gray-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-md">
              <div className="flex h-full">
                <div className="w-1/3 bg-gray-100 relative overflow-hidden border-r flex items-center justify-center">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full" onClick={() => {
                      setEditingTimeline(item); 
                      setTlYear(item.year); 
                      setTlTitle(item.title); 
                      setTlDesc(item.description); 
                      setTlTag(item.tag || ''); 
                      setTlImage(item.imageUrl || ''); 
                      setTlOrder(item.orderIndex?.toString() || '');
                      setShowTimelineForm(true);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="icon" variant="destructive" className="h-10 w-10 rounded-full" onClick={() => { if(confirm('Tem certeza que deseja excluir este marco histórico?')) deleteTimelineMutation.mutate({ id: item.id }) }}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div className="w-2/3 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded-md uppercase tracking-wider">{item.year}</span>
                      <span className="text-[10px] font-medium text-gray-400 uppercase">Pos: {item.orderIndex || idx + 1}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 line-clamp-1 mb-2">{item.title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            </Card>
          )) : (
            <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">Nenhum marco histórico cadastrado.</p>
              <p className="text-sm">Clique em "Adicionar Novo Marco" para começar.</p>
            </div>
          )}
        </div>
      </div>

      {/* UNITS SECTION */}
      <div className="space-y-6">
        <div className="flex justify-between items-end border-b pb-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Building2 className="w-7 h-7 text-purple-600" /> 3. Nossas Unidades
            </h3>
            <p className="text-gray-500">Fotos e nomes das sedes e polos do grupo.</p>
          </div>
          <Button onClick={() => { resetUnitForm(); setShowUnitForm(true); }} className="bg-purple-600 hover:bg-purple-700 h-11 px-6 font-bold">
            <Plus className="w-5 h-5 mr-2" /> Adicionar Unidade
          </Button>
        </div>

        {showUnitForm && (
          <Card className="border-purple-200 shadow-xl bg-purple-50/10 animate-in fade-in slide-in-from-top-4 duration-300">
            <CardContent className="pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Nome da Unidade / Sede</Label>
                  <Input 
                    value={unitName} 
                    onChange={(e) => setUnitName(e.target.value)} 
                    placeholder="Ex: Sede Administrativa I - Maringá"
                    className="h-12"
                  />
                  <div className="pt-4 space-y-3">
                    <Button className="w-full h-12 bg-purple-600 hover:bg-purple-700 font-bold" onClick={() => {
                      if (editingUnit) updateUnitMutation.mutate({ id: editingUnit.id, name: unitName, imageUrl: unitImage || undefined });
                      else unitMutation.mutate({ name: unitName, imageUrl: unitImage || undefined });
                    }}>
                      <Save className="w-4 h-4 mr-2" /> {editingUnit ? 'Atualizar Unidade' : 'Salvar Unidade'}
                    </Button>
                    <Button variant="ghost" className="w-full h-10 text-gray-500" onClick={resetUnitForm}>Cancelar</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Foto da Unidade</Label>
                  <div className="border-2 border-dashed border-purple-100 rounded-2xl p-2 bg-white">
                    <ImageUpload value={unitImage} onChange={setUnitImage} onRemove={() => setUnitImage('')} aspectRatio={16/9} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {units && units.length > 0 ? units.map((unit: any) => (
            <Card key={unit.id} className="overflow-hidden group border-gray-200 hover:border-purple-300 transition-all shadow-sm">
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {unit.imageUrl ? (
                  <img src={unit.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon className="w-12 h-12" /></div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full" onClick={() => { setEditingUnit(unit); setUnitName(unit.name); setUnitImage(unit.imageUrl || ''); setShowUnitForm(true); }}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="destructive" className="h-10 w-10 rounded-full" onClick={() => { if(confirm('Excluir esta unidade?')) deleteUnitMutation.mutate({ id: unit.id }) }}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
              <CardContent className="p-4 bg-white">
                <h4 className="font-bold text-gray-800 truncate text-center">{unit.name}</h4>
              </CardContent>
            </Card>
          )) : (
            <div className="col-span-full py-16 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
              <p>Nenhuma unidade cadastrada.</p>
            </div>
          )}
        </div>
      </div>

      {/* NOSSA HISTORIA */}
      <Card className="border-orange-200 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-400 text-white">
          <CardTitle className="flex items-center gap-2">
            <History className="w-6 h-6" /> 3.5 Nossa Historia
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-semibold">Titulo da Secao</Label>
            <Input 
              value={storyTitle} 
              onChange={(e) => setStoryTitle(e.target.value)} 
              placeholder="Ex: Uma trajetoria de crescimento, inovacao e compromisso com a educacao brasileira"
              className="h-12 bg-white text-lg font-bold"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-base font-semibold">Conteudo / Descricao</Label>
            <Textarea 
              value={storyContent} 
              onChange={(e) => setStoryContent(e.target.value)} 
              rows={8} 
              placeholder="Descreva a historia e a trajetoria da instituicao..."
              className="text-base leading-relaxed bg-white"
            />
          </div>
          <Button 
            className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white text-lg font-bold shadow-md transition-all" 
            onClick={() => updateStoryMutation.mutate({ title: storyTitle, content: storyContent })}
          >
            <Save className="w-5 h-5 mr-2" /> Atualizar Nossa Historia
          </Button>
        </CardContent>
      </Card>

      {/* FOOTER QUOTE */}
      <Card className="border-gray-200 shadow-lg bg-gray-50/30">
        <CardHeader className="border-b bg-white">
          <CardTitle className="flex items-center gap-2 text-gray-700">
            <Quote className="w-6 h-6 text-primary" /> 4. Frase de Impacto Final
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-8 space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-semibold">A Frase (Citação)</Label>
            <Textarea 
              value={quoteText} 
              onChange={(e) => setQuoteText(e.target.value)} 
              rows={4} 
              className="text-xl italic font-medium text-gray-700 leading-relaxed bg-white"
              placeholder="Digite a frase inspiradora que encerra a página..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-semibold">Autor da Frase</Label>
              <Input value={quoteAuthor} onChange={(e) => setQuoteAuthor(e.target.value)} placeholder="Ex: Fredison Carneiro" className="h-12 bg-white" />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Cargo / Papel do Autor</Label>
              <Input value={quoteRole} onChange={(e) => setQuoteRole(e.target.value)} placeholder="Ex: Fundador do Grupo LA Educação" className="h-12 bg-white" />
            </div>
          </div>
          <Button 
            className="w-full h-14 bg-gray-900 hover:bg-black text-white text-lg font-bold shadow-lg transition-all" 
            onClick={() => updateFooterMutation.mutate({ id: footerQuote?.id || 1, quote: quoteText, author: quoteAuthor, authorRole: quoteRole })}
          >
            <Save className="w-5 h-5 mr-2" /> Atualizar Frase de Impacto
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
