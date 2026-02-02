import AdminLayout from "@/components/AdminLayout";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Edit, MapPin } from "lucide-react";
import cardsData from "@/data/organograma-cards-final.json";
import instituicoesInfo from "@/data/instituicoes-info.json";

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

export default function AdminEcosystemPage() {
  const [, setLocation] = useLocation();

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
          <Button
            onClick={() => setLocation("/admin-la-educacao/ecossistema/editor")}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            🖼️ Editor de Posições
          </Button>
        </div>

        {/* Abas */}
        <div className="flex gap-4 border-b border-gray-200">
          <button className="px-6 py-3 border-b-2 border-pink-600 text-pink-600 font-bold">
            📋 Instituições
          </button>
        </div>

        {/* Lista de Instituições */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(cardsData).map(([cardId, card]) => {
            const cardInfo = card as CardInfo;
            const institutionInfo = instituicoesInfo[cardId as keyof typeof instituicoesInfo] as any;

            return (
              <div
                key={cardId}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition border border-gray-200 overflow-hidden"
              >
                {/* Header do Card */}
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-4 text-white">
                  <h3 className="text-lg font-bold">{cardInfo.nome}</h3>
                  <p className="text-sm text-pink-100">{cardInfo.tipo}</p>
                </div>

                {/* Conteúdo */}
                <div className="p-4 space-y-3">
                  {/* Categoria */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Categoria</p>
                    <p className="text-sm text-gray-700">{cardInfo.categoria}</p>
                  </div>

                  {/* Descrição */}
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Descrição</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{cardInfo.descricao}</p>
                  </div>

                  {/* Posição */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span>X: {cardInfo.x}, Y: {cardInfo.y}</span>
                  </div>

                  {/* Imagens */}
                  {institutionInfo?.fotos && institutionInfo.fotos.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Imagens</p>
                      <p className="text-sm text-gray-700">{institutionInfo.fotos.length} imagem(ns)</p>
                    </div>
                  )}

                  {/* Botões de Ação */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setLocation(`/admin-la-educacao/ecossistema/${cardId}`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-pink-600 text-white py-2 px-3 rounded-lg hover:bg-pink-700 transition font-semibold text-sm"
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
      </div>
    </AdminLayout>
  );
}
