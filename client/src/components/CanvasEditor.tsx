import { useState, useRef, useEffect } from "react";
import { Download, Save, RotateCcw } from "lucide-react";
import ToggleSwitch from "./ToggleSwitch";
import cardsData from "@/data/organograma-cards-final.json";

interface CardPosition {
  [key: string]: {
    x: number;
    y: number;
  };
}

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

export default function CanvasEditor() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<CardPosition>({});
  const [draggingCard, setDraggingCard] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [savedMessage, setSavedMessage] = useState("");

  const imageWidth = 8199;
  const imageHeight = 4576;

  // Inicializar posições
  useEffect(() => {
    const initialPositions: CardPosition = {};
    Object.entries(cardsData).forEach(([cardId, card]) => {
      initialPositions[cardId] = {
        x: (card as CardInfo).x,
        y: (card as CardInfo).y,
      };
    });
    setPositions(initialPositions);
  }, []);

  const getPixelCoordinates = (cardId: string) => {
    if (!canvasRef.current || !positions[cardId]) return null;

    const canvas = canvasRef.current;
    const img = canvas.querySelector("img") as HTMLImageElement;
    if (!img) return null;

    const displayWidth = img.offsetWidth;
    const displayHeight = img.offsetHeight;
    const scaleX = imageWidth / displayWidth;
    const scaleY = imageHeight / displayHeight;

    return {
      displayX: (positions[cardId].x / imageWidth) * displayWidth,
      displayY: (positions[cardId].y / imageHeight) * displayHeight,
      scaleX,
      scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent, cardId: string) => {
    e.preventDefault();
    const coords = getPixelCoordinates(cardId);
    if (!coords) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    setDraggingCard(cardId);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingCard || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const img = canvasRef.current.querySelector("img") as HTMLImageElement;
    if (!img) return;

    const displayWidth = img.offsetWidth;
    const displayHeight = img.offsetHeight;
    const scaleX = imageWidth / displayWidth;
    const scaleY = imageHeight / displayHeight;

    const displayX = e.clientX - canvasRect.left - dragOffset.x;
    const displayY = e.clientY - canvasRect.top - dragOffset.y;

    // Limitar dentro da imagem
    const constrainedX = Math.max(0, Math.min(displayX, displayWidth - 50));
    const constrainedY = Math.max(0, Math.min(displayY, displayHeight - 50));

    const imageX = constrainedX * scaleX;
    const imageY = constrainedY * scaleY;

    setPositions((prev) => ({
      ...prev,
      [draggingCard]: {
        x: Math.round(imageX),
        y: Math.round(imageY),
      },
    }));
  };

  const handleMouseUp = () => {
    setDraggingCard(null);
  };

  const handleSave = () => {
    // Criar JSON com as posições
    const updatedCards: Record<string, any> = {};
    Object.entries(cardsData).forEach(([cardId, card]) => {
      const cardData = card as CardInfo;
      updatedCards[cardId] = {
        ...cardData,
        x: positions[cardId]?.x || cardData.x,
        y: positions[cardId]?.y || cardData.y,
      };
    });

    const jsonData = JSON.stringify(updatedCards, null, 2);

    // Copiar para clipboard
    navigator.clipboard.writeText(jsonData).then(() => {
      setSavedMessage("✓ Coordenadas copiadas para clipboard!");
      setTimeout(() => setSavedMessage(""), 3000);
    });

    // Também fazer download
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(jsonData)
    );
    element.setAttribute("download", "organograma-cards-final.json");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    const initialPositions: CardPosition = {};
    Object.entries(cardsData).forEach(([cardId, card]) => {
      initialPositions[cardId] = {
        x: (card as CardInfo).x,
        y: (card as CardInfo).y,
      };
    });
    setPositions(initialPositions);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Editor Visual de Toggles
        </h2>
        <p className="text-gray-600">
          Arraste os botões sobre a imagem para posicionar exatamente onde você
          quer. Depois clique em "Salvar" para exportar as coordenadas.
        </p>
      </div>

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300 mb-6"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: draggingCard ? "grabbing" : "grab" }}
      >
        <img
          src="/ecossistema-organograma.png"
          alt="Ecossistema LA Educação"
          className="w-full h-auto block"
          draggable={false}
        />

        {/* Toggles Draggable */}
        <div className="absolute inset-0">
          {Object.entries(cardsData).map(([cardId, card]) => {
            const coords = getPixelCoordinates(cardId);
            if (!coords) return null;

            return (
              <div
                key={cardId}
                className="absolute cursor-grab active:cursor-grabbing"
                style={{
                  left: `${coords.displayX}px`,
                  top: `${coords.displayY}px`,
                  transform: "translate(-50%, -50%)",
                  zIndex: draggingCard === cardId ? 50 : 10,
                }}
                onMouseDown={(e) => handleMouseDown(e, cardId)}
              >
                <div className="relative group">
                  <ToggleSwitch
                    isActive={false}
                    onClick={() => {}}
                    title={`${(card as CardInfo).nome} - Arraste para mover`}
                  />

                  {/* Label */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {(card as CardInfo).nome}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Informações de Posição */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {Object.entries(cardsData).map(([cardId, card]) => (
          <div
            key={cardId}
            className={`p-3 rounded-lg text-sm ${
              draggingCard === cardId
                ? "bg-pink-100 border-2 border-pink-600"
                : "bg-gray-100 border border-gray-300"
            }`}
          >
            <p className="font-semibold text-gray-900">
              {(card as CardInfo).nome}
            </p>
            <p className="text-xs text-gray-600">
              X: {positions[cardId]?.x || 0}
            </p>
            <p className="text-xs text-gray-600">
              Y: {positions[cardId]?.y || 0}
            </p>
          </div>
        ))}
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-3 justify-end">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
        >
          <RotateCcw size={18} />
          Resetar
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          <Download size={18} />
          Exportar JSON
        </button>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-semibold"
        >
          <Save size={18} />
          Salvar
        </button>
      </div>

      {/* Mensagem de Sucesso */}
      {savedMessage && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded-lg text-sm font-semibold">
          {savedMessage}
        </div>
      )}

      {/* Instruções */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
        <p className="font-semibold mb-2">Como usar:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Clique e arraste cada botão para o local desejado</li>
          <li>As coordenadas são atualizadas em tempo real</li>
          <li>Clique em "Salvar" para copiar o JSON para clipboard</li>
          <li>Também será feito download do arquivo JSON</li>
          <li>Cole o JSON no arquivo de configuração do projeto</li>
        </ul>
      </div>
    </div>
  );
}
