import { X, GraduationCap, BookOpen } from "lucide-react";

interface AvaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AvaModal({ isOpen, onClose }: AvaModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-[90%] max-w-2xl mx-4 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#da1069] to-[#3559AC] rounded-t-3xl px-8 py-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Ambiente Virtual de Aprendizagem</h2>
              <p className="text-white/80 text-sm mt-1">Acesse sua área de estudos</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-10">
          <p className="text-center text-gray-700 text-lg mb-8 leading-relaxed">
            Bem-vindo ao seu <span className="font-bold text-gray-900">Ambiente Virtual de Aprendizagem</span>. 
            Para acessar sua área de estudos, selecione o nível de ensino correspondente ao seu curso:
          </p>

          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Ensino Médio */}
            <a
              href="https://laava.simpleacademy.tech/login"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden bg-gradient-to-br from-[#da1069] to-[#b80e56] hover:from-[#b80e56] hover:to-[#da1069] rounded-2xl p-6 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ensino Médio</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Técnico, EJA, Profissionalizante
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-tl-full"></div>
            </a>

            {/* Ensino Superior */}
            <a
              href="https://lafaculdadesava.simpleacademy.tech/login"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden bg-gradient-to-br from-[#3559AC] to-[#2a468a] hover:from-[#2a468a] hover:to-[#3559AC] rounded-2xl p-6 text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ensino Superior</h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  Graduação, Pós-graduação, Licenciatura
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-tl-full"></div>
            </a>
          </div>

          {/* Footer note */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Caso tenha dúvidas sobre qual opção selecionar, entre em contato com nossa central de atendimento.
          </p>
        </div>
      </div>
    </div>
  );
}
