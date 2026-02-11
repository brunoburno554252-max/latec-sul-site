import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import ToggleSwitch from "./ToggleSwitch";
import cardsData from "@/data/organograma-cards-final.json";
import { X } from "lucide-react";

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

export default function FullscreenEcosystemEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [positions, setPositions] = useState<CardPosition>({});
  const [draggingCard, setDraggingCard] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showCode, setShowCode] = useState(false);
  const [scale, setScale] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  // Dimensões reais da imagem
  const imageWidth = 8199;
  const imageHeight = 4576;

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

    // Calcular escala inicial
    if (imgRef.current && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const calculatedScale = containerWidth / imageWidth;
      setScale(calculatedScale);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent, cardId: string) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    setDraggingCard(cardId);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingCard || !imgRef.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();

    // Posição relativa ao container
    const displayX = e.clientX - containerRect.left - dragOffset.x;
    const displayY = e.clientY - containerRect.top - dragOffset.y;

    // Converter de coordenadas de display para coordenadas reais
    const imageX = displayX / scale;
    const imageY = displayY / scale;

    // Limitar dentro da imagem
    const constrainedX = Math.max(0, Math.min(imageX, imageWidth - 50));
    const constrainedY = Math.max(0, Math.min(imageY, imageHeight - 50));

    setPositions((prev) => ({
      ...prev,
      [draggingCard]: {
        ...prev[draggingCard],
        x: Math.round(constrainedX),
        y: Math.round(constrainedY),
      },
    }));
  };

  const handleMouseUp = () => {
    setDraggingCard(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
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
      const response = await fetch("/api/ecosystem/save-coordinates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCards),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar coordenadas");
      }

      toast.success("✓ Coordenadas salvas com sucesso! A página será recarregada...");
      
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error("Erro ao salvar coordenadas");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleInverted = async (cardId: string) => {
    const currentInverted = positions[cardId]?.inverted || false;
    const newInverted = !currentInverted;

    setPositions((prev) => ({
      ...prev,
      [cardId]: {
        ...prev[cardId],
        inverted: newInverted,
      },
    }));

    toast.success(`Card ${cardId} ${newInverted ? "invertido" : "restaurado"}!`);
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

  const handleClose = () => {
    window.history.back();
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
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black z-50 flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center border-b border-gray-700 z-10">
        <div>
          <h1 className="text-2xl font-bold">Editor de Ecossistema</h1>
          <p className="text-sm text-gray-400">Arraste os botões para posicionar. Clique em Salvar quando terminar.</p>
        </div>
        <button
          onClick={handleClose}
          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Canvas Area - Imagem em tamanho real */}
      <div className="flex-1 overflow-auto bg-black relative">
        <div
          style={{
            display: "inline-block",
            position: "relative",
            width: `${imageWidth * scale}px`,
            height: `${imageHeight * scale}px`,
          }}
        >
          <img
            ref={imgRef}
            src="/ecossistema-organograma.png"
            alt="Ecossistema LA Educação"
            className="block"
            style={{
              width: `${imageWidth * scale}px`,
              height: `${imageHeight * scale}px`,
              display: "block",
            }}
            draggable={false}
          />

          {/* Toggles Draggable */}
          {Object.entries(cardsData).map(([cardId, card]) => {
            const pos = positions[cardId];
            if (!pos) return null;

            const displayX = pos.x * scale;
            const displayY = pos.y * scale;

            return (
              <div
                key={cardId}
                className="absolute cursor-grab active:cursor-grabbing group"
                style={{
                  left: `${displayX}px`,
                  top: `${displayY}px`,
                  transform: "translate(-50%, -50%)",
                }}
                onMouseDown={(e) => handleMouseDown(e, cardId)}
              >
                <ToggleSwitch
                  isActive={true}
                  label={(card as CardInfo).nome}
                  onClick={() => {}}
                  inverted={pos.inverted || false}
                />
                {/* Botão para inverter */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleInverted(cardId);
                  }}
                  className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
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

      {/* Footer Controls */}
      <div className="bg-gray-900 text-white p-4 border-t border-gray-700 flex gap-3 flex-wrap z-10">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          {isSaving ? "⏳ Salvando..." : "💾 Salvar Coordenadas"}
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          🔄 Resetar
        </button>
        <button
          onClick={() => setShowCode(!showCode)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition ml-auto"
        >
          {showCode ? "🙈 Ocultar" : "👁️ Ver"} JSON
        </button>
      </div>

      {/* JSON Display */}
      {showCode && (
        <div className="bg-gray-800 text-green-400 p-4 max-h-48 overflow-y-auto border-t border-gray-700 z-10">
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
          <pre className="text-xs font-mono whitespace-pre-wrap break-words">
            {jsonCode}
          </pre>
        </div>
      )}
    </div>
  );
}
