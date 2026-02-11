import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, Play, X, Users, MapPin } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  location?: string | null;
  testimonial: string;
  rating: number;
  image?: string | null;
  videoUrl?: string | null;
  courseName?: string | null;
}

// Função para extrair ID do vídeo do YouTube
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Função para extrair ID do vídeo do Vimeo
function getVimeoVideoId(url: string): string | null {
  const regExp = /vimeo\.com\/(?:video\/)?(\d+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// Componente de Modal de Vídeo
function VideoModal({ videoUrl, onClose }: { videoUrl: string; onClose: () => void }) {
  const youtubeId = getYouTubeVideoId(videoUrl);
  const vimeoId = getVimeoVideoId(videoUrl);

  let embedUrl = "";
  if (youtubeId) {
    embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
  } else if (vimeoId) {
    embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
  } else {
    embedUrl = videoUrl;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-[#da1069] transition-colors"
      >
        <X className="w-8 h-8" />
      </button>
      <div 
        className="w-full max-w-4xl aspect-video"
        onClick={(e) => e.stopPropagation()}
      >
        {youtubeId || vimeoId ? (
          <iframe
            src={embedUrl}
            className="w-full h-full rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            src={videoUrl}
            className="w-full h-full rounded-xl"
            controls
            autoPlay
          />
        )}
      </div>
    </div>
  );
}

// Componente de Card de Depoimento - Design Claro
function TestimonialCard({ 
  testimonial, 
  isCenter = false,
  onPlayVideo 
}: { 
  testimonial: Testimonial; 
  isCenter?: boolean;
  onPlayVideo?: (url: string) => void;
}) {
  return (
    <div
      className={`
        relative bg-white rounded-3xl p-8 
        transition-all duration-500 flex flex-col h-full
        border-2
        ${isCenter 
          ? "scale-105 shadow-2xl shadow-[#da1069]/20 border-[#da1069]/30 z-10" 
          : "scale-95 opacity-80 hover:opacity-100 border-gray-100 shadow-lg"
        }
      `}
    >
      {/* Ícone de aspas decorativo */}
      <div className={`
        absolute -top-4 left-8 w-12 h-12 rounded-xl flex items-center justify-center
        ${isCenter ? "bg-gradient-to-br from-[#da1069] to-[#c41e8a]" : "bg-gradient-to-br from-[#da1069]/70 to-[#c41e8a]/70"}
        shadow-lg
      `}>
        <Quote className="w-6 h-6 text-white" />
      </div>

      {/* Estrelas */}
      <div className="flex gap-1 mt-4 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < testimonial.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Texto do depoimento */}
      <p className="text-gray-700 text-base leading-relaxed mb-6 flex-1 italic">
        "{testimonial.testimonial}"
      </p>

      {/* Botão de vídeo se houver */}
      {testimonial.videoUrl && onPlayVideo && (
        <button
          onClick={() => onPlayVideo(testimonial.videoUrl!)}
          className="flex items-center gap-2 text-[#da1069] hover:text-[#c41e8a] text-sm mb-4 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-[#da1069]/10 group-hover:bg-[#da1069]/20 flex items-center justify-center transition-colors">
            <Play className="w-5 h-5 fill-[#da1069]" />
          </div>
          <span className="font-medium">Assistir depoimento em vídeo</span>
        </button>
      )}

      {/* Divisor */}
      <div className="border-t border-gray-100 pt-4">
        {/* Info do autor */}
        <div className="flex items-center gap-4">
          {testimonial.image ? (
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-14 h-14 rounded-full object-cover border-3 border-[#da1069]/20"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#da1069] to-[#c41e8a] flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {testimonial.name.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-gray-900 font-bold text-lg truncate">{testimonial.name}</h4>
            <p className="text-[#da1069] text-sm font-medium truncate">{testimonial.role}</p>
            <p className="text-gray-500 text-sm truncate">{testimonial.company}</p>
          </div>
          {/* Ícone de aspas decorativo pequeno */}
          <div className="text-[#da1069]/20">
            <Quote className="w-8 h-8" />
          </div>
        </div>

        {/* Localização e badge do curso */}
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          {testimonial.location && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              {testimonial.location}
            </span>
          )}
          {testimonial.courseName && (
            <span className="inline-block px-3 py-1 bg-[#da1069]/10 text-[#da1069] text-xs rounded-full font-medium">
              {testimonial.courseName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const { data: testimonials = [], isLoading } = trpc.testimonials.getAll.useQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play do carrossel
  useEffect(() => {
    if (isAutoPlaying && testimonials.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, testimonials.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const handlePlayVideo = (url: string) => {
    setIsAutoPlaying(false);
    setVideoUrl(url);
  };

  // Se não há depoimentos, não renderiza a seção
  if (testimonials.length === 0 && !isLoading) {
    return null;
  }

  // Calcular índices visíveis (3 cards)
  const getVisibleIndices = () => {
    if (testimonials.length === 0) return [];
    if (testimonials.length === 1) return [0];
    if (testimonials.length === 2) return [0, 1];
    
    const prev = (currentIndex - 1 + testimonials.length) % testimonials.length;
    const next = (currentIndex + 1) % testimonials.length;
    return [prev, currentIndex, next];
  };

  const visibleIndices = getVisibleIndices();

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#da1069]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#c41e8a]/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#da1069]/10 rounded-full text-[#da1069] text-sm font-semibold mb-4">
            <Users className="w-4 h-4" />
            HISTÓRIAS DE SUCESSO
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            O que nossos <span className="text-[#da1069]">Parceiros</span> dizem
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Conheça as experiências de sucesso de quem já faz parte da nossa rede
          </p>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#da1069]/30 border-t-[#da1069] rounded-full animate-spin" />
          </div>
        )}

        {/* Carrossel */}
        {!isLoading && testimonials.length > 0 && (
          <div className="relative">
            {/* Botão anterior */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white hover:bg-[#da1069] rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-all shadow-lg border border-gray-100 hover:border-[#da1069]"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Cards */}
            <div className="flex justify-center items-stretch gap-6 px-16 py-8">
              {visibleIndices.map((index, i) => (
                <div
                  key={testimonials[index].id}
                  className={`w-full max-w-md transition-all duration-500 ${
                    testimonials.length === 1 ? "max-w-lg" : ""
                  }`}
                >
                  <TestimonialCard
                    testimonial={testimonials[index]}
                    isCenter={i === 1 || testimonials.length === 1}
                    onPlayVideo={handlePlayVideo}
                  />
                </div>
              ))}
            </div>

            {/* Botão próximo */}
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white hover:bg-[#da1069] rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-all shadow-lg border border-gray-100 hover:border-[#da1069]"
              aria-label="Próximo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Indicadores */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-8 h-2 bg-[#da1069]"
                    : "w-2 h-2 bg-gray-300 hover:bg-[#da1069]/50"
                }`}
                aria-label={`Ir para depoimento ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de vídeo */}
      {videoUrl && (
        <VideoModal videoUrl={videoUrl} onClose={() => setVideoUrl(null)} />
      )}
    </section>
  );
}
