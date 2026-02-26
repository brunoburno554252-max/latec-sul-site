import { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, RefreshCw } from "lucide-react";
import cardsData from "@/data/organograma-cards-final.json";

interface CardInfo {
  nome: string;
  tipo: string;
  categoria: string;
  posicao: string;
  x: number;
  y: number;
  width: number;
  height: number;
  descricao: string;
  inverted?: boolean;
}

interface InstitutionInfo {
  nome: string;
  tipo: string;
  categoria: string;
  descricao: string;
  fotos?: string[];
  banner?: string;
  website?: string;
}

export default function AdminEcosystemPage() {
  const [, setLocation] = useLocation();
  const [instituicoesInfo, setInstituicoesInfo] = useState<Record<string, InstitutionInfo>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados das instituições do banco de dados
  const loadInstitutions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/ecosystem/institutions");
      if (!response.ok) {
        throw new Error("Erro ao carregar instituições");
      }
      const data = await response.json();
      setInstituicoesInfo(data);
    } catch (error) {
      console.error("Erro ao carregar instituições:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInstitutions();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Ecossistema</h1>
            <p className="text-gray-600 mt-2">
              Edite as informações das instituições e configure a posição dos botões
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadInstitutions}
              variant="outline"
              className="font-bold py-2 px-4 rounded-lg"
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              Atualizar
            </Button>
            <Button
              onClick={() => setLocation("/admin-la-educacao/ecossistema/editor")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              🖼️ Editor de Posições
            </Button>
          </div>
        </div>

        {/* Abas */}
        <div className="flex gap-4 border-b border-gray-200">
          <button className="px-6 py-3 border-b-2 border-green-600 text-green-600 font-bold">
            📋 Instituições
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Carregando instituições do banco de dados...</p>
            </div>
          </div>
        ) : (
          /* Lista de Instituições */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(cardsData).map(([cardId, card]) => {
              const cardInfo = card as CardInfo;
              const institutionInfo = instituicoesInfo[cardId] as InstitutionInfo | undefined;

              return (
                <div
                  key={cardId}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition border border-gray-200 overflow-hidden"
                >
                  {/* Header do Card */}
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
                    <h3 className="text-lg font-bold">{institutionInfo?.nome || cardInfo.nome}</h3>
                    <p className="text-sm text-green-100">{institutionInfo?.tipo || cardInfo.tipo}</p>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-4 space-y-3">
                    {/* Logo Preview */}
                    {institutionInfo?.fotos && institutionInfo.fotos[0] && (
                      <div className="flex justify-center">
                        <img 
                          src={institutionInfo.fotos[0]} 
                          alt={institutionInfo.nome}
                          className="h-16 w-auto object-contain"
                        />
                      </div>
                    )}

                    {/* Categoria */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Categoria</p>
                      <p className="text-sm text-gray-700">{institutionInfo?.categoria || cardInfo.categoria}</p>
                    </div>

                    {/* Descrição */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Descrição</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{institutionInfo?.descricao || cardInfo.descricao}</p>
                    </div>

                    {/* Posição */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span>X: {cardInfo.x}, Y: {cardInfo.y}</span>
                    </div>

                    {/* Status das Imagens */}
                    <div className="flex gap-2 text-xs">
                      <span className={`px-2 py-1 rounded ${institutionInfo?.fotos?.[0] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        Logo: {institutionInfo?.fotos?.[0] ? '✓' : '✗'}
                      </span>
                      <span className={`px-2 py-1 rounded ${institutionInfo?.banner ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        Banner: {institutionInfo?.banner ? '✓' : '✗'}
                      </span>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setLocation(`/admin-la-educacao/ecossistema/${cardId}`)}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition font-semibold text-sm"
                      >
                        <Edit size={16} />
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
