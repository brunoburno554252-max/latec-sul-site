import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: testimonials, isLoading } = trpc.testimonials.getAll.useQuery();

  // Auto-advance carousel every 6 seconds
  useEffect(() => {
    if (!testimonials || testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials]);

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center">
            <p className="text-gray-600">Carregando depoimentos...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null; // Don't show section if no testimonials
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 via-white to-pink-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-accent font-bold tracking-widest text-sm uppercase mb-3 block flex items-center justify-center gap-2">
            <Quote className="w-5 h-5" />
            Depoimentos
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 mb-6 leading-tight">
            O que nossos <span className="text-accent">Parceiros</span> dizem
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Conheça as experiências de sucesso de quem já faz parte da nossa rede
          </p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-white rounded-3xl shadow-2xl p-12 md:p-16">
            {/* Quote Icon */}
            <div className="absolute top-8 left-8 text-primary/10">
              <Quote className="w-20 h-20" fill="currentColor" />
            </div>

            {/* Testimonial Content */}
            <div className="relative z-10">
              {/* Rating Stars */}
              <div className="flex items-center justify-center gap-1 mb-6">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-center mb-8">
                <p className="text-xl md:text-2xl text-gray-800 leading-relaxed font-medium italic">
                  "{currentTestimonial.testimonial}"
                </p>
              </blockquote>

              {/* Author Info */}
              <div className="flex flex-col items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  {currentTestimonial.image ? (
                    <img
                      src={currentTestimonial.image}
                      alt={currentTestimonial.name}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#da1069] to-[#3559AC] flex items-center justify-center ring-4 ring-primary/20">
                      <span className="text-3xl font-bold text-white">
                        {currentTestimonial.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-lg">
                    <Quote className="w-4 h-4 text-primary" fill="currentColor" />
                  </div>
                </div>

                {/* Name and Role */}
                <div className="text-center">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {currentTestimonial.name}
                  </h4>
                  <p className="text-gray-600 font-medium">
                    {currentTestimonial.role} • {currentTestimonial.company}
                  </p>
                  {currentTestimonial.location && (
                    <p className="text-sm text-gray-500 mt-1">
                      📍 {currentTestimonial.location}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            {testimonials.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-110 bg-white"
                  aria-label="Depoimento anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all hover:scale-110 bg-white"
                  aria-label="Próximo depoimento"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>

          {/* Carousel Indicators */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? "w-8 h-3 bg-gradient-to-r from-[#da1069] to-[#3559AC]"
                      : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Counter */}
          {testimonials.length > 1 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              {currentIndex + 1} de {testimonials.length}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
