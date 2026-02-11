import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: slides = [] } = trpc.banners.getActive.useQuery();

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, (slides[currentSlide]?.displayDuration || 10) * 1000);
    return () => clearInterval(timer);
  }, [slides, currentSlide]);

  const nextSlide = () => {
    if (!slides) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    if (!slides) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!slides || slides.length === 0) return null;

  return (
    <section className="relative bg-gray-900 overflow-hidden w-full group">
      {/* Aspect Ratio Container for 4:1 */}
      <div className="relative w-full pb-[25%]">
        {slides.map((slide, index) => {
          const overlayOpacity = slide.overlayOpacity ?? 0;
          const isActive = index === currentSlide;
          const showContent = slide.showContent ?? true;
          
          return (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Background Image - Forced to cover to avoid black bars */}
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover"
              />
              
              {/* Dynamic Overlay */}
              {overlayOpacity > 0 && (
                <div 
                  className="absolute inset-0 bg-black z-10" 
                  style={{ opacity: overlayOpacity / 100 }}
                />
              )}

              {/* Content Overlay - Only shown if showContent is true */}
              {showContent && (
                <div className={`absolute inset-0 z-20 flex items-center px-8 lg:px-24 ${
                  slide.textPosition === 'center' ? 'justify-center text-center' : 
                  slide.textPosition === 'right' ? 'justify-end text-right' : 'justify-start text-left'
                }`}>
                  <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 drop-shadow-lg">
                      {slide.title}
                    </h1>
                    {slide.subtitle && (
                      <p className="text-lg md:text-xl text-white/90 mb-8 font-medium drop-shadow-md max-w-xl">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.ctaText && (
                      <div className="flex gap-4">
                        <Link href={slide.ctaLink || "#"}>
                          <Button className="bg-gradient-to-r from-[#da1069] to-[#3559AC] hover:opacity-90 text-white font-bold shadow-xl shadow-[#3559AC]/20 rounded-full px-10 py-4 h-auto text-lg transition-all hover:scale-105">
                            {slide.ctaText}
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
            {slides.map((_, index) => {
              const isCurrent = index === currentSlide;
              return (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    isCurrent 
                      ? "w-8 bg-gradient-to-r from-[#da1069] to-[#3559AC]" 
                      : "w-2 bg-white/50 hover:bg-white/75"
                  }`}
                />
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
