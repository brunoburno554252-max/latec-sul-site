import { Download, Save, RotateCcw, Zap } from "lucide-react";
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
  const [savedMessage, setSavedMessage] = useState("");

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
    // Criar JSON com as posições
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
      // Salvar direto no arquivo JSON via API
      await saveCoordinatesMutation.mutateAsync(updatedCards);
      toast.success("✓ Coordenadas salvas com sucesso! A página será recarregada...");
      setSavedMessage("✓ Coordenadas salvas com sucesso!");
      
      // Recarregar a página após 2 segundos para aplicar as mudanças
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

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Editor Visual de Toggles
        </h2>
        <p className="text-gray-600">
          Arraste os botões sobre a imagem para posicionar exatamente onde você
          quer. Depois clique em "Salvar" para salvar as coordenadas direto no arquivo.
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
                  title="Inverter cores"
                >
                  <Zap size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coordenadas */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 max-h-64 overflow-y-auto">
        <h3 className="font-bold text-gray-900 mb-3">Coordenadas Atuais:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(positions).map(([cardId, pos]) => (
            <div key={cardId} className="text-gray-700">
              <strong>{cardId}:</strong> X: {pos.x}, Y: {pos.y}
              {pos.inverted && <span className="ml-2 text-purple-600">🔄 Invertido</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Mensagem de Sucesso */}
      {savedMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
          {savedMessage}
        </div>
      )}

      {/* Botões */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={saveCoordinatesMutation.isPending}
          className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          <Save size={20} />
          {saveCoordinatesMutation.isPending ? "Salvando..." : "Salvar"}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          <RotateCcw size={20} />
          Resetar
        </button>
      </div>
    </div>
  );
}
