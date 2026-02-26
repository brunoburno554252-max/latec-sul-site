import { useState, useEffect } from "react";
import { X } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
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

interface InstituicaoInfo {
  nome: string;
  tipo: string;
  categoria: string;
  descricao: string;
  missao?: string;
  visao?: string;
  valores?: string[];
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
  const [instituicoesInfo, setInstituicoesInfo] = useState<Record<string, InstituicaoInfo>>({});

  const imageWidth = 8199;
  const imageHeight = 4576;

  // Carregar dados das instituições do banco de dados
  useEffect(() => {
    async function loadInstitutions() {
      try {
        const response = await fetch("/api/ecosystem/institutions");
        if (response.ok) {
          const data = await response.json();
          setInstituicoesInfo(data);
        }
      } catch (error) {
        console.error("Erro ao carregar instituições:", error);
      }
    }
    loadInstitutions();
  }, []);

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
    ? (cardsData[selectedCard as keyof typeof cardsData] as CardInfo)
    : null;

  const selectedInstituicaoInfo = selectedCard
    ? (instituicoesInfo[selectedCard] as InstituicaoInfo)
    : null;

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
                className="absolute pointer-events-auto flex flex-col items-center gap-2"
                style={{
                  left: `${percentages.left}%`,
                  top: `${percentages.top}%`,
                  width: `${percentages.width}%`,
                  height: `${percentages.height}%`,
                }}
              >
                <div className="flex-1 flex items-center justify-center" style={{ transform: "scale(1.2)" }}>
                  <ToggleSwitch
                    isActive={isActive}
                    onClick={() => handleToggleClick(cardId)}
                    title={`Clique para abrir ${(card as CardInfo).nome}`}
                    inverted={(card as CardInfo).inverted || false}
                  />
                </div>
                {instituicoesInfo[cardId]?.website && (
                  <a
                    href={instituicoesInfo[cardId].website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-[#1B8C3D] to-[#9b1b8e] text-white text-xs font-bold py-1.5 px-4 rounded-full hover:opacity-90 transition-opacity shadow-lg whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Conhecer mais →
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Minimalista */}
      {isModalOpen && selectedCardData && (
        <div 
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden animate-in fade-in zoom-in duration-300 flex"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Coluna Esquerda - Imagem Vertical */}
            <div className="w-96 bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
              {selectedInstituicaoInfo?.fotos && selectedInstituicaoInfo.fotos.length > 0 ? (
                <img
                  src={selectedInstituicaoInfo.fotos[0]}
                  alt={selectedInstituicaoInfo.nome}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">🏢</div>
                  <p>Sem imagem</p>
                </div>
              )}
            </div>

            {/* Coluna Direita - Informações Minimalistas */}
            <div className="flex-1 overflow-y-auto p-8 relative flex flex-col">
              {/* Botão Fechar */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition"
              >
                <X size={24} />
              </button>

              <div className="space-y-6 flex-1">
                {/* Header */}
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-1">
                    {selectedInstituicaoInfo?.nome || selectedCardData.nome}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedInstituicaoInfo?.tipo || selectedCardData.tipo}
                  </p>
                </div>

                {/* Descrição */}
                <p className="text-gray-700 leading-relaxed text-base">
                  {selectedInstituicaoInfo?.descricao || selectedCardData.descricao}
                </p>

                {/* Missão */}
                {selectedInstituicaoInfo?.missao && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                      Missão
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedInstituicaoInfo.missao}
                    </p>
                  </div>
                )}

                {/* Visão */}
                {selectedInstituicaoInfo?.visao && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                      Visão
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedInstituicaoInfo.visao}
                    </p>
                  </div>
                )}

                {/* Valores */}
                {selectedInstituicaoInfo?.valores && selectedInstituicaoInfo.valores.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                      Valores
                    </h3>
                    <p className="text-gray-700 text-sm">
                      {selectedInstituicaoInfo.valores.join(" • ")}
                    </p>
                  </div>
                )}

                {/* Cursos/Serviços/Programas */}
                {(selectedInstituicaoInfo?.cursos?.length ||
                  selectedInstituicaoInfo?.servicos?.length ||
                  selectedInstituicaoInfo?.programas?.length ||
                  selectedInstituicaoInfo?.empresas?.length) && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">
                      {selectedInstituicaoInfo?.cursos?.length
                        ? "Cursos"
                        : selectedInstituicaoInfo?.servicos?.length
                          ? "Serviços"
                          : selectedInstituicaoInfo?.programas?.length
                            ? "Programas"
                            : "Empresas"}
                    </h3>
                    <p className="text-gray-700 text-sm">
                      {(
                        selectedInstituicaoInfo?.cursos ||
                        selectedInstituicaoInfo?.servicos ||
                        selectedInstituicaoInfo?.programas ||
                        selectedInstituicaoInfo?.empresas ||
                        []
                      ).join(" • ")}
                    </p>
                  </div>
                )}
              </div>

              {/* Botão CTA - Sticky Footer */}
              <div className="pt-6 border-t border-gray-200 mt-6">
                {selectedInstituicaoInfo?.website ? (
                  <a 
                    href={selectedInstituicaoInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition text-center"
                  >
                    Conhecer Mais
                  </a>
                ) : (
                  <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition">
                    Conhecer Mais
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
