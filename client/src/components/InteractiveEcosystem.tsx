import { useState } from "react";
import { X } from "lucide-react";
import cardsData from "@/data/organograma-cards.json";

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
}

export default function InteractiveEcosystem() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imageWidth = 8199;
  const imageHeight = 4576;

  // Calcular percentuais para responsividade
  const getPercentages = (card: CardInfo) => {
    return {
      left: (card.x / imageWidth) * 100,
      top: (card.y / imageHeight) * 100,
      width: (card.width / imageWidth) * 100,
      height: (card.height / imageHeight) * 100,
    };
  };

  const handleCardClick = (cardId: string) => {
    setSelectedCard(cardId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCard(null), 300);
  };

  const selectedCardData = selectedCard
    ? (cardsData[selectedCard as keyof typeof cardsData] as CardInfo)
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

        {/* Overlay com áreas clicáveis */}
        <div className="absolute inset-0 w-full h-full">
          {Object.entries(cardsData).map(([cardId, card]) => {
            const percentages = getPercentages(card as CardInfo);

            return (
              <button
                key={cardId}
                onClick={() => handleCardClick(cardId)}
                className="absolute group transition-all duration-300 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                style={{
                  left: `${percentages.left}%`,
                  top: `${percentages.top}%`,
                  width: `${percentages.width}%`,
                  height: `${percentages.height}%`,
                }}
                title={`Clique para saber mais sobre ${(card as CardInfo).nome}`}
              >
                {/* Hover indicator */}
                <div className="absolute inset-0 bg-pink-500 opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300" />
                
                {/* Label ao passar o mouse */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-pink-600 text-white px-3 py-1 rounded text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  {(card as CardInfo).nome}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedCardData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-pink-600 to-pink-700 text-white p-6 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold">{selectedCardData.nome}</h2>
                <p className="text-pink-100 mt-1">{selectedCardData.tipo}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-white hover:bg-pink-800 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Categoria e Descrição */}
              <div>
                <div className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  {selectedCardData.categoria}
                </div>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {selectedCardData.descricao}
                </p>
              </div>

              {/* Informações Adicionais (placeholder para futuras fotos e detalhes) */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Sobre {selectedCardData.nome}</h3>
                <p className="text-gray-600 text-sm">
                  Aqui você verá informações detalhadas, fotos, missão, visão e valores dessa instituição.
                  Esta seção será preenchida com conteúdo específico de cada organização.
                </p>
              </div>

              {/* Posição na estrutura */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-blue-600 font-semibold uppercase">Posição</p>
                  <p className="text-lg font-bold text-blue-900 capitalize mt-1">
                    {selectedCardData.posicao}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-xs text-purple-600 font-semibold uppercase">Tipo de Instituição</p>
                  <p className="text-lg font-bold text-purple-900 mt-1">
                    {selectedCardData.tipo}
                  </p>
                </div>
              </div>

              {/* CTA Buttons (placeholder) */}
              <div className="flex gap-3 pt-4">
                <button className="flex-1 bg-pink-600 text-white py-2 rounded-lg font-semibold hover:bg-pink-700 transition-colors">
                  Conhecer Mais
                </button>
                <button className="flex-1 border-2 border-pink-600 text-pink-600 py-2 rounded-lg font-semibold hover:bg-pink-50 transition-colors">
                  Visitar Site
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
