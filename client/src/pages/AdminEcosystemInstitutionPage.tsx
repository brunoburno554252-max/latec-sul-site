import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, X, Upload, Image as ImageIcon, Save } from "lucide-react";

interface InstituicaoInfo {
  nome: string;
  tipo: string;
  categoria: string;
  descricao: string;
  missao?: string;
  visao?: string;
  valores?: string[];
  fotos?: string[]; // Usado para o Logo
  banner?: string; // Novo campo para o Banner
  website?: string;
  [key: string]: any;
}

export default function AdminEcosystemInstitutionPage() {
  const [, params] = useRoute("/admin-la-educacao/ecossistema/:id");
  const institutionId = params?.id as string;

  const [formData, setFormData] = useState<InstituicaoInfo | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Carregar dados da instituição DO BANCO DE DADOS via API
  useEffect(() => {
    async function loadInstitution() {
      if (!institutionId) return;
      
      setIsLoading(true);
      try {
        const response = await fetch("/api/ecosystem/institutions");
        if (!response.ok) {
          throw new Error("Erro ao carregar instituições");
        }
        
        const institutions = await response.json();
        const institution = institutions[institutionId] as InstituicaoInfo;
        
        if (institution) {
          setFormData({
            ...institution,
            // Garantir que campos novos existam
            banner: institution.banner || "",
            fotos: institution.fotos || [],
          });
        } else {
          // Instituição não encontrada - criar nova
          setFormData({
            nome: institutionId.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
            tipo: "",
            categoria: "",
            descricao: "",
            fotos: [],
            banner: "",
            website: ""
          });
        }
      } catch (error) {
        console.error("Erro ao carregar instituição:", error);
        toast.error("Erro ao carregar dados da instituição");
        // Fallback para dados vazios
        setFormData({
          nome: institutionId.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
          tipo: "",
          categoria: "",
          descricao: "",
          fotos: [],
          banner: "",
          website: ""
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadInstitution();
  }, [institutionId]);

  const handleInputChange = (field: string, value: any) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "fotos" | "banner") => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        // Upload para /var/www/uploads/ via API
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64,
            filename: file.name,
            contentType: file.type
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Erro no upload");
        }
        
        const result = await response.json();
        console.log("[Upload] Sucesso:", result.url);
        
        if (field === "fotos") {
          handleInputChange("fotos", [result.url]);
        } else {
          handleInputChange("banner", result.url);
        }
        toast.success("Upload concluído! Imagem salva permanentemente.");
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast.error("Erro ao ler arquivo");
        setIsUploading(false);
      };
    } catch (error) {
      toast.error("Erro ao fazer upload");
      console.error(error);
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData || !institutionId) return;

    setIsSaving(true);
    try {
      // Salvar no banco de dados MySQL via API
      const response = await fetch("/api/ecosystem/save-institution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          institutionId,
          data: formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao salvar no servidor");
      }

      toast.success("✓ Alterações salvas com sucesso no banco de dados!");
      
      setTimeout(() => {
        window.location.href = "/admin-la-educacao/ecossistema";
      }, 1000);
    } catch (error) {
      toast.error("Erro ao salvar alterações");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <div className="text-green-600 font-bold">Carregando dados do banco de dados...</div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-red-600 font-bold">Erro ao carregar dados da empresa</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <a
              href="/admin-la-educacao/ecossistema"
              className="p-2 bg-white rounded-full shadow-sm text-green-600 hover:bg-green-50 transition-colors"
            >
              <ArrowLeft size={24} />
            </a>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{formData.nome}</h1>
              <p className="text-gray-500">Gerenciar conteúdo e identidade visual</p>
            </div>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-8 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-200 font-bold disabled:opacity-50"
          >
            {isSaving ? "Salvando..." : <><Save size={20} /> Salvar Alterações</>}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna da Esquerda: Imagens */}
          <div className="lg:col-span-1 space-y-6">
            {/* Logo da Empresa */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon size={20} className="text-green-600" /> Logo da Empresa
              </h3>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "fotos")}
                />
                {isUploading ? (
                  <div className="text-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                    <p className="text-xs text-gray-500">Enviando...</p>
                  </div>
                ) : formData.fotos && formData.fotos[0] ? (
                  <>
                    <img src={formData.fotos[0]} alt="Logo" className="w-full h-full object-contain p-4" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="text-white font-bold text-sm">Trocar Logo</button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-xs text-gray-500">Clique para fazer upload do logo (PNG/JPG)</p>
                  </div>
                )}
              </div>
              <input 
                type="text" 
                placeholder="URL da Imagem do Logo"
                value={formData.fotos?.[0] || ""}
                onChange={(e) => handleInputChange("fotos", [e.target.value])}
                className="mt-4 w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Banner de Fundo */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon size={20} className="text-green-600" /> Banner de Fundo
              </h3>
              <div 
                onClick={() => bannerInputRef.current?.click()}
                className="aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden relative group cursor-pointer"
              >
                <input 
                  type="file" 
                  ref={bannerInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "banner")}
                />
                {isUploading ? (
                  <div className="text-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                    <p className="text-xs text-gray-500">Enviando...</p>
                  </div>
                ) : formData.banner ? (
                  <>
                    <img src={formData.banner} alt="Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="text-white font-bold text-sm">Trocar Banner</button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-xs text-gray-500">Upload do banner de fundo</p>
                  </div>
                )}
              </div>
              <input 
                type="text" 
                placeholder="URL da Imagem do Banner"
                value={formData.banner || ""}
                onChange={(e) => handleInputChange("banner", e.target.value)}
                className="mt-4 w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          {/* Coluna da Direita: Textos */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Conteúdo da Seção</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nome da Empresa</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Negócio</label>
                    <input
                      type="text"
                      value={formData.tipo}
                      onChange={(e) => handleInputChange("tipo", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Categoria</label>
                    <input
                      type="text"
                      value={formData.categoria}
                      onChange={(e) => handleInputChange("categoria", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Descrição Detalhada</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => handleInputChange("descricao", e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                    placeholder="Escreva aqui o texto que aparecerá quando o aluno clicar na logo desta empresa..."
                  />
                  <p className="mt-2 text-xs text-gray-400">Este texto será exibido na seção de conteúdo dinâmico do site.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Link do Website (Opcional)</label>
                  <input
                    type="url"
                    value={formData.website || ""}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
