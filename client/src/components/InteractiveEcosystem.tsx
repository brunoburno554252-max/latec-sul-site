import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import { trpc } from "@/lib/trpc";
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

export default function InteractiveEcosystem() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeToggles, setActiveToggles] = useState<Record<string, boolean>>({});
  const [cardsData, setCardsData] = useState<Record<string, CardInfo>>({});

  const imageWidth = 8199;
  const imageHeight = 4576;

  // Buscar coordenadas do servidor
  const { data: coordinates, isLoading } = trpc.ecosystem.getCoordinates.useQuery(undefined, {
    refetchInterval: 5000, // Atualizar a cada 5 segundos
  });

  // Atualizar cardsData quando as coordenadas chegarem do servidor
  useEffect(() => {
    if (coordinates) {
      setCardsData(coordinates);
    }
  }, [coordinates]);

  // Calcular percentuais para responsividade
  const getPercentages = (card: CardInfo) => {
    return {
      left: (card.x / imageWidth) * 100,
      top: (card.y / imageHeight) * 100,
      width: (card.width / imageWidth) * 100,
      height: (card.height / imageHeight) * 100,
    };
  };

  const handleToggleClick = (cardId: string) => {
    setSelectedCard(cardId);
    setIsModalOpen(true);
    setActiveToggles((prev) => ({
      ...prev,
      [cardId]: true,
    }));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (selectedCard) {
      setActiveToggles((prev) => ({
        ...prev,
        [selectedCard]: false,
      }));
    }
    setTimeout(() => setSelectedCard(null), 300);
  };

  const selectedCardData = selectedCard
    ? (cardsData[selectedCard] as CardInfo)
    : null;

  const selectedInstituicaoInfo = selectedCard
    ? (instituicoesInfo[selectedCard as keyof typeof instituicoesInfo] as InstituicaoInfo)
    : null;

  if (isLoading) {
    return (
      <div className="relative w-full bg-white">
        <img
          src="/ecossistema-organograma.png"
          alt="Ecossistema LA Educação"
          className="w-full h-auto"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Container da imagem com overlay interativo */}
      <div className="relative w-full bg-white">
        <img
          src="/ecossistema-organograma.png"
          alt="Ecossistema LA Educação"
          className="w-full h-auto"
          loading="lazy"
        />

        {/* Overlay com botões toggle switches */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {Object.entries(cardsData).map(([cardId, card]) => {
            const percentages = getPercentages(card as CardInfo);
            const isActive = activeToggles[cardId] || false;

            return (
              <div
                key={cardId}
                className="absolute pointer-events-auto"
                style={{
                  left: `${percentages.left}%`,
                  top: `${percentages.top}%`,
                  width: `${percentages.width}%`,
                  height: `${percentages.height}%`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ToggleSwitch
                  isActive={isActive}
                  onClick={() => handleToggleClick(cardId)}
                  title={`Clique para abrir ${(card as CardInfo).nome}`}
                  inverted={(card as CardInfo).inverted || false}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Horizontal com Fundo Semi-transparente */}
      {isModalOpen && selectedCardData && selectedInstituicaoInfo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Layout Horizontal */}
            <div className="flex flex-col lg:flex-row relative">
              {/* Lado Esquerdo - Informações Principais */}
              <div className="flex-1 bg-gradient-to-br from-pink-50 to-white p-8 border-b lg:border-b-0 lg:border-r border-pink-100">
                <div className="space-y-4">
                  {/* Header */}
                  <div>
                    <div className="inline-block bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-3">
                      {selectedInstituicaoInfo.categoria}
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-1">
                      {selectedInstituicaoInfo.nome}
                    </h2>
                    <p className="text-lg text-pink-600 font-semibold">
                      {selectedInstituicaoInfo.tipo}
                    </p>
                  </div>

                  {/* Descrição */}
                  <p className="text-gray-700 leading-relaxed text-base">
                    {selectedInstituicaoInfo.descricao}
                  </p>

                  {/* Missão e Visão em Cards */}
                  <div className="space-y-3 pt-2">
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">Missão</p>
                      <p className="text-sm text-blue-900 mt-1">
                        {selectedInstituicaoInfo.missao}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                      <p className="text-xs text-purple-600 font-bold uppercase tracking-wide">Visão</p>
                      <p className="text-sm text-purple-900 mt-1">
                        {selectedInstituicaoInfo.visao}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lado Direito - Detalhes e Valores */}
              <div className="flex-1 p-8 space-y-6">
                {/* Valores */}
                {selectedInstituicaoInfo.valores && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                      Valores Fundamentais
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInstituicaoInfo.valores.map((valor, idx) => (
                        <span
                          key={idx}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold"
                        >
                          {valor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cursos/Serviços/Programas */}
                {(selectedInstituicaoInfo.cursos ||
                  selectedInstituicaoInfo.servicos ||
                  selectedInstituicaoInfo.programas ||
                  selectedInstituicaoInfo.empresas) && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                      {selectedInstituicaoInfo.cursos
                        ? "Cursos Oferecidos"
                        : selectedInstituicaoInfo.servicos
                          ? "Serviços"
                          : selectedInstituicaoInfo.programas
                            ? "Programas"
                            : "Empresas do Grupo"}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        selectedInstituicaoInfo.cursos ||
                        selectedInstituicaoInfo.servicos ||
                        selectedInstituicaoInfo.programas ||
                        selectedInstituicaoInfo.empresas ||
                        []
                      ).map((item, idx) => (
                        <div key={idx} className="flex items-start text-sm text-gray-700">
                          <span className="inline-block w-2 h-2 bg-pink-600 rounded-full mr-2 mt-1 flex-shrink-0"></span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botões CTA */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-pink-700 transition-colors text-sm">
                    Conhecer Mais
                  </button>
                  {selectedInstituicaoInfo.website && (
                    <a
                      href={selectedInstituicaoInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 border-2 border-pink-600 text-pink-600 py-2 px-4 rounded-lg font-semibold hover:bg-pink-50 transition-colors text-sm text-center"
                    >
                      Visitar Site
                    </a>
                  )}
                </div>
              </div>

              {/* Botão Fechar */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-full transition-colors z-10"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
