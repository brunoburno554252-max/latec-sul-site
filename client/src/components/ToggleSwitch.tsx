import { useState, useEffect } from "react";

interface ToggleSwitchProps {
  isActive: boolean;
  onClick: () => void;
  backgroundColor?: string;
  title?: string;
  label?: string;
  inverted?: boolean;
}

export default function ToggleSwitch({
  isActive,
  onClick,
  backgroundColor = "#ffffff",
  title = "Clique para abrir",
  label,
  inverted = false,
}: ToggleSwitchProps) {
  const [useWhiteSwitch, setUseWhiteSwitch] = useState(false);

  // Detectar cor de fundo e definir contraste
  useEffect(() => {
    // Se o fundo é rosa/escuro, usar switch branco
    // Se o fundo é branco/claro, usar switch rosa
    const isRosaBackground = backgroundColor.toLowerCase().includes("da1069") ||
                             backgroundColor.toLowerCase().includes("pink") ||
                             backgroundColor.toLowerCase().includes("e91e63");
    
    setUseWhiteSwitch(isRosaBackground);
  }, [backgroundColor]);

  // Se inverted, inverter as cores
  let switchColor = useWhiteSwitch ? "#ffffff" : "#1B8C3D";
  let circleBgColor = useWhiteSwitch ? "#1B8C3D" : "#ffffff";
  const dotColor = "#000000"; // Pontinhos pretos sempre
  
  if (inverted) {
    [switchColor, circleBgColor] = [circleBgColor, switchColor];
  }

  return (
    <button
      onClick={onClick}
      title={title}
      className="relative w-16 h-8 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer shadow-lg hover:shadow-xl"
      style={{
        backgroundColor: switchColor,
        border: useWhiteSwitch ? "2px solid #1B8C3D" : "2px solid #ffffff",
      }}
    >
      {/* Pontinhos pretos (indicadores) */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        {/* Ponto esquerdo (desligado) */}
        <div
          className="w-2 h-2 rounded-full transition-opacity duration-300"
          style={{
            backgroundColor: dotColor,
            opacity: isActive ? 0.3 : 1,
          }}
        />
        
        {/* Ponto direito (ligado) */}
        <div
          className="w-2 h-2 rounded-full transition-opacity duration-300"
          style={{
            backgroundColor: dotColor,
            opacity: isActive ? 1 : 0.3,
          }}
        />
      </div>

      {/* Círculo deslizante */}
      <div
        className="absolute top-1 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center"
        style={{
          backgroundColor: circleBgColor,
          left: isActive ? "calc(100% - 28px)" : "2px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Ponto preto no círculo deslizante */}
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
      </div>
    </button>
  );
}
