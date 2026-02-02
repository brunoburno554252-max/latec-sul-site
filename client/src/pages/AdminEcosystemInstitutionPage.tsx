import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, Upload, X } from "lucide-react";
import instituicoesInfo from "@/data/instituicoes-info.json";

interface InstituicaoInfo {
  nome: string;
  tipo: string;
  categoria: string;
  descricao: string;
  missao: string;
  visao: string;
  valores: string[];
  cursos?: string[];
  servicos?: string[];
  programas?: string[];
  empresas?: string[];
  fotos?: string[];
  website?: string;
}

export default function AdminEcosystemInstitutionPage() {
  const [, params] = useRoute("/admin-la-educacao/ecossistema/:id");
  const institutionId = params?.id as string;

  const [formData, setFormData] = useState<InstituicaoInfo | null>(null);
  const [newValor, setNewValor] = useState("");
  const [newItem, setNewItem] = useState("");
  const [itemType, setItemType] = useState<"cursos" | "servicos" | "programas" | "empresas">("cursos");
  const [isSaving, setIsSaving] = useState(false);

  // Carregar dados da instituição
  useEffect(() => {
    if (institutionId) {
      const institution = instituicoesInfo[institutionId as keyof typeof instituicoesInfo] as InstituicaoInfo;
      if (institution) {
        setFormData(institution);
      }
    }
  }, [institutionId]);

  const handleInputChange = (field: string, value: any) => {
    if (formData) {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleAddValor = () => {
    if (newValor.trim() && formData) {
      setFormData({
        ...formData,
        valores: [...formData.valores, newValor],
      });
      setNewValor("");
    }
  };

  const handleRemoveValor = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        valores: formData.valores.filter((_, i) => i !== index),
      });
    }
  };

  const handleAddItem = () => {
    if (newItem.trim() && formData) {
      const items = formData[itemType] || [];
      setFormData({
        ...formData,
        [itemType]: [...items, newItem],
      });
      setNewItem("");
    }
  };

  const handleRemoveItem = (type: string, index: number) => {
    if (formData) {
      const items = formData[type as keyof InstituicaoInfo] as string[];
      setFormData({
        ...formData,
        [type]: items.filter((_, i) => i !== index),
      });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !formData) return;

    const newFotos = [...(formData.fotos || [])];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        newFotos.push(base64);
        
        if (i === files.length - 1) {
          setFormData({
            ...formData,
            fotos: newFotos,
          });
          toast.success(`${files.length} imagem(ns) adicionada(s)`);
        }
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (formData) {
      setFormData({
        ...formData,
        fotos: (formData.fotos || []).filter((_, i) => i !== index),
      });
    }
  };

  const handleSave = async () => {
    if (!formData || !institutionId) return;

    setIsSaving(true);
    try {
      // Salvar no localStorage por enquanto (depois integrar com API)
      const allInstitutions = { ...instituicoesInfo };
      allInstitutions[institutionId as keyof typeof instituicoesInfo] = formData;

      // Aqui você faria uma chamada para salvar no servidor
      // await fetch("/api/ecosystem/save-institution", { ... })

      toast.success("✓ Instituição salva com sucesso!");
      
      // Recarregar a página após 1 segundo
      setTimeout(() => {
        window.location.href = "/admin-la-educacao/ecossistema";
      }, 1000);
    } catch (error) {
      toast.error("Erro ao salvar instituição");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <a
            href="/admin-la-educacao/ecossistema"
            className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold"
          >
            <ArrowLeft size={20} />
            Voltar
          </a>
          <h1 className="text-4xl font-bold text-gray-900">Editar: {formData.nome}</h1>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Informações Básicas</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
                <input
                  type="text"
                  value={formData.tipo}
                  onChange={(e) => handleInputChange("tipo", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Categoria</label>
                <input
                  type="text"
                  value={formData.categoria}
                  onChange={(e) => handleInputChange("categoria", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.website || ""}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => handleInputChange("descricao", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Missão e Visão */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Missão e Visão</h2>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Missão</label>
              <textarea
                value={formData.missao}
                onChange={(e) => handleInputChange("missao", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Visão</label>
              <textarea
                value={formData.visao}
                onChange={(e) => handleInputChange("visao", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Valores */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Valores Fundamentais</h2>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newValor}
                onChange={(e) => setNewValor(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddValor()}
                placeholder="Adicionar novo valor..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                onClick={handleAddValor}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
              >
                Adicionar
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.valores.map((valor, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <span>{valor}</span>
                  <button
                    onClick={() => handleRemoveValor(idx)}
                    className="hover:text-green-900"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cursos/Serviços/Programas/Empresas */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Cursos, Serviços, Programas e Empresas</h2>
            
            <div className="space-y-4">
              {["cursos", "servicos", "programas", "empresas"].map((type) => (
                <div key={type}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                    {type}
                  </label>
                  <div className="space-y-2">
                    {(formData[type as keyof InstituicaoInfo] as string[] || []).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                        <span>{item}</span>
                        <button
                          onClick={() => handleRemoveItem(type, idx)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-2">
                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="cursos">Cursos</option>
                  <option value="servicos">Serviços</option>
                  <option value="programas">Programas</option>
                  <option value="empresas">Empresas</option>
                </select>
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddItem()}
                  placeholder="Adicionar novo item..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddItem}
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>

          {/* Imagens */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Imagens</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <label className="cursor-pointer flex flex-col items-center gap-2">
                <Upload size={32} className="text-gray-400" />
                <span className="text-gray-600 font-semibold">Clique para adicionar imagens</span>
                <span className="text-sm text-gray-500">ou arraste e solte</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {(formData.fotos || []).map((foto, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={foto}
                    alt={`Foto ${idx + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 pt-8 border-t border-gray-200">
            <a
              href="/admin-la-educacao/ecossistema"
              className="flex-1 bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-bold hover:bg-gray-400 transition text-center"
            >
              Cancelar
            </a>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-pink-700 disabled:bg-pink-400 transition"
            >
              {isSaving ? "⏳ Salvando..." : "💾 Salvar Alterações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
