import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import ToggleSwitch from "./ToggleSwitch";
import { trpc } from "@/lib/trpc";
import cardsData from "@/data/organograma-cards-final.json";

interface CardPosition {
  [key: string]: {
    x: number;
    y: number;
    inverted?: boolean;
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
  inverted?: boolean;
}

export default function CanvasEditor() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<CardPosition>({});
  const [draggingCard, setDraggingCard] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showCode, setShowCode] = useState(false);

  // Dimensões reais da imagem
  const imageWidth = 8199;
  const imageHeight = 4576;

  const saveCoordinatesMutation = trpc.ecosystem.saveCoordinates.useMutation();
  const toggleInvertedMutation = trpc.ecosystem.toggleInverted.useMutation();

  // Inicializar posições
  useEffect(() => {
    const initialPositions: CardPosition = {};
    Object.entries(cardsData).forEach(([cardId, card]) => {
      initialPositions[cardId] = {
        x: (card as CardInfo).x,
        y: (card as CardInfo).y,
        inverted: (card as CardInfo).inverted || false,
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
        ...prev[draggingCard],
        x: Math.round(imageX),
        y: Math.round(imageY),
      },
    }));
  };

  const handleMouseUp = () => {
    setDraggingCard(null);
  };

  const handleSave = async () => {
    const updatedCards: Record<string, any> = {};
    Object.entries(cardsData).forEach(([cardId, card]) => {
      const cardData = card as CardInfo;
      updatedCards[cardId] = {
        ...cardData,
        x: positions[cardId]?.x || cardData.x,
        y: positions[cardId]?.y || cardData.y,
        inverted: positions[cardId]?.inverted || false,
      };
    });

    try {
      await saveCoordinatesMutation.mutateAsync(updatedCards);
      toast.success("✓ Coordenadas salvas com sucesso! A página será recarregada...");
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error("Erro ao salvar coordenadas");
      console.error(error);
    }
  };

  const handleToggleInverted = async (cardId: string) => {
    const currentInverted = positions[cardId]?.inverted || false;
    const newInverted = !currentInverted;

    try {
      await toggleInvertedMutation.mutateAsync({
        cardId,
        inverted: newInverted,
      });

      setPositions((prev) => ({
        ...prev,
        [cardId]: {
          ...prev[cardId],
          inverted: newInverted,
        },
      }));

      toast.success(`Card ${cardId} ${newInverted ? "invertido" : "restaurado"}!`);
    } catch (error) {
      toast.error("Erro ao inverter card");
      console.error(error);
    }
  };

  const handleReset = () => {
    const initialPositions: CardPosition = {};
    Object.entries(cardsData).forEach(([cardId, card]) => {
      initialPositions[cardId] = {
        x: (card as CardInfo).x,
        y: (card as CardInfo).y,
        inverted: (card as CardInfo).inverted || false,
      };
    });
    setPositions(initialPositions);
  };

  // Gerar JSON para copiar
  const generateJSON = () => {
    const output: Record<string, any> = {};
    Object.entries(cardsData).forEach(([cardId, card]) => {
      const cardData = card as CardInfo;
      output[cardId] = {
        nome: cardData.nome,
        tipo: cardData.tipo,
        categoria: cardData.categoria,
        posicao: cardData.posicao,
        x: positions[cardId]?.x || cardData.x,
        y: positions[cardId]?.y || cardData.y,
        width: cardData.width,
        height: cardData.height,
        descricao: cardData.descricao,
        inverted: positions[cardId]?.inverted || false,
      };
    });
    return JSON.stringify(output, null, 2);
  };

  const jsonCode = generateJSON();

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Editor Visual de Toggles
        </h2>
        <p className="text-gray-600 mb-4">
          Arraste os botões sobre a imagem para posicionar exatamente onde você quer.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas - 2/3 da tela */}
        <div className="lg:col-span-2">
          <div
            ref={canvasRef}
            className="relative w-full bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300"
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
                    className="absolute cursor-grab active:cursor-grabbing group"
                    style={{
                      left: `${coords.displayX}px`,
                      top: `${coords.displayY}px`,
                      transform: "translate(-50%, -50%)",
                    }}
                    onMouseDown={(e) => handleMouseDown(e, cardId)}
                  >
                    <ToggleSwitch
                      isActive={true}
                      label={(card as CardInfo).nome}
                      onClick={() => {}}
                      inverted={positions[cardId]?.inverted || false}
                    />
                    {/* Botão para inverter */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleInverted(cardId);
                      }}
                      className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                      title="Inverter cores do botão"
                    >
                      ⚡
                    </button>
                    {/* Label */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition">
                      {(card as CardInfo).nome}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              💾 Salvar Coordenadas
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              🔄 Resetar
            </button>
            <button
              onClick={() => setShowCode(!showCode)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              {showCode ? "🙈 Ocultar" : "👁️ Ver"} JSON
            </button>
          </div>
        </div>

        {/* Painel de Coordenadas - 1/3 da tela */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 h-full overflow-y-auto max-h-96">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Coordenadas Atuais</h3>
            
            {Object.entries(positions).map(([cardId, pos]) => (
              <div key={cardId} className="mb-4 pb-4 border-b border-gray-200">
                <p className="font-semibold text-gray-800 text-sm">
                  {(cardsData[cardId as keyof typeof cardsData] as CardInfo).nome}
                </p>
                <p className="text-xs text-gray-600">
                  X: <span className="font-mono font-bold">{pos.x}</span>
                </p>
                <p className="text-xs text-gray-600">
                  Y: <span className="font-mono font-bold">{pos.y}</span>
                </p>
                <p className="text-xs text-gray-600">
                  Invertido: <span className="font-mono font-bold">{pos.inverted ? "Sim" : "Não"}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exibição de JSON/JavaScript */}
      {showCode && (
        <div className="mt-6 bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold">JSON/JavaScript</h3>
            <button
              onClick={() => {
                navigator.clipboard.writeText(jsonCode);
                toast.success("✓ JSON copiado para clipboard!");
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
            >
              📋 Copiar
            </button>
          </div>
          <pre className="text-xs font-mono whitespace-pre-wrap break-words max-h-96 overflow-y-auto">
            {jsonCode}
          </pre>
        </div>
      )}
    </div>
  );
}
