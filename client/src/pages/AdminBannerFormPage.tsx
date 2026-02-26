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
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import ImageUpload from "@/components/ImageUpload";

export default function AdminBannerFormPage() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const bannerId = params.id ? parseInt(params.id) : null;
  const isEditing = bannerId !== null;

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [image, setImage] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [displayDuration, setDisplayDuration] = useState(10);
  const [textPosition, setTextPosition] = useState<"left" | "center" | "right">("left");
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [isActive, setIsActive] = useState(true);
  const [showContent, setShowContent] = useState(true);

  const { data: banner } = trpc.adminBanners.getAll.useQuery(undefined, {
    enabled: isEditing,
  });

  const createMutation = trpc.adminBanners.create.useMutation({
    onSuccess: () => {
      toast.success("Banner criado com sucesso!");
      setLocation("/admin-la-educacao/banners");
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar banner: ${error.message}`);
    },
  });

  const updateMutation = trpc.adminBanners.update.useMutation({
    onSuccess: () => {
      toast.success("Banner atualizado com sucesso!");
      setLocation("/admin-la-educacao/banners");
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar banner: ${error.message}`);
    },
  });

  useEffect(() => {
    if (isEditing && banner) {
      const currentBanner = banner.find((b) => b.id === bannerId);
      if (currentBanner) {
        setTitle(currentBanner.title);
        setSubtitle(currentBanner.subtitle || "");
        setImage(currentBanner.image);
        setCtaText(currentBanner.ctaText || "");
        setCtaLink(currentBanner.ctaLink || "");
        setDisplayDuration(currentBanner.displayDuration || 10);
        setTextPosition(currentBanner.textPosition || "left");
        setOverlayOpacity(currentBanner.overlayOpacity || 50);
        setIsActive(currentBanner.isActive);
        setShowContent(currentBanner.showContent ?? true);
      }
    }
  }, [banner, bannerId, isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    if (!image) {
      toast.error("Imagem é obrigatória");
      return;
    }

    if (isEditing && bannerId) {
      updateMutation.mutate({
        id: bannerId,
        title,
        subtitle: subtitle || undefined,
        image,
        ctaText: ctaText || undefined,
        ctaLink: ctaLink || undefined,
        displayDuration,
        textPosition,
        overlayOpacity,
        isActive,
      showContent,
      });
    } else {
      // Get max order for new banner
      const maxOrder = banner ? Math.max(...banner.map(b => b.order), 0) : 0;
      createMutation.mutate({
        title,
        subtitle: subtitle || undefined,
        image,
        ctaText: ctaText || undefined,
        ctaLink: ctaLink || undefined,
        displayDuration,
        textPosition,
        overlayOpacity,
        order: maxOrder + 1,
        isActive,
      showContent,
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/admin-la-educacao/banners")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? "Editar Banner" : "Novo Banner"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing
                ? "Atualize as informações do banner"
                : "Adicione um novo banner ao hero slider"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conteúdo do Banner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Revolucionando a educação à distância"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtítulo</Label>
                    <Textarea
                      id="subtitle"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="Ex: Conectamos instituições a empreendedores e alunos ao conhecimento"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Imagem do Banner *</Label>
                    <ImageUpload
                      value={image}
                      onChange={setImage}
                      onRemove={() => setImage("")}
                      aspectRatio={4 / 1}
                    />
                    <p className="text-sm text-gray-500">
                      Recomendado: 1920x1080px (16:9)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Botão de Ação (CTA)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="ctaText">Texto do Botão</Label>
                    <Input
                      id="ctaText"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      placeholder="Ex: Quero ser Parceiro"
                    />
                    <p className="text-sm text-gray-500">
                      Deixe em branco para usar o padrão "Quero ser Parceiro"
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ctaLink">Link do Botão</Label>
                    <Input
                      id="ctaLink"
                      value={ctaLink}
                      onChange={(e) => setCtaLink(e.target.value)}
                      placeholder="Ex: /parceiro ou https://exemplo.com"
                    />
                    <p className="text-sm text-gray-500">
                      Deixe em branco para usar o padrão "/parceiro"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Settings */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Visuais</CardTitle>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 border-blue-100"><div><Label htmlFor="showContent">Mostrar Texto/Botão</Label><p className="text-xs text-amber-600">Desative se a imagem já tiver texto</p></div><Switch id="showContent" checked={showContent} onCheckedChange={setShowContent} /></div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="textPosition">Posição do Texto</Label>
                    <Select value={textPosition} onValueChange={(value: any) => setTextPosition(value)}>
                      <SelectTrigger id="textPosition">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Esquerda</SelectItem>
                        <SelectItem value="center">Centro</SelectItem>
                        <SelectItem value="right">Direita</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="overlayOpacity">Opacidade do Overlay</Label>
                      <span className="text-sm font-medium text-gray-600">{overlayOpacity}%</span>
                    </div>
                    <Slider
                      id="overlayOpacity"
                      min={0}
                      max={100}
                      step={5}
                      value={[overlayOpacity]}
                      onValueChange={(value) => setOverlayOpacity(value[0])}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Controla a transparência da camada escura sobre a imagem
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="displayDuration">Duração de Exibição</Label>
                      <span className="text-sm font-medium text-gray-600">{displayDuration}s</span>
                    </div>
                    <Slider
                      id="displayDuration"
                      min={3}
                      max={30}
                      step={1}
                      value={[displayDuration]}
                      onValueChange={(value) => setDisplayDuration(value[0])}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Tempo que o banner fica visível antes de trocar
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label htmlFor="isActive">Banner Ativo</Label>
                      <p className="text-sm text-gray-500">
                        Banners inativos não aparecem no site
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="w-full"
                >
                  {isEditing ? "Atualizar Banner" : "Criar Banner"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/admin-la-educacao/banners")}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
