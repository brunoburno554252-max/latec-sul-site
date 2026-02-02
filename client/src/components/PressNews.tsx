import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function PressNews() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const news = [
    {
      id: 1,
      title: "LA Educação é reconhecida como melhor plataforma de educação online",
      source: "Jornal Nacional",
      date: "15 de janeiro de 2026",
      image: "https://via.placeholder.com/400x250/FF6B9D/FFFFFF?text=Notícia+1",
      link: "#"
    },
    {
      id: 2,
      title: "Educação a distância cresce 300% com inovação da LA Educação",
      source: "Folha de S.Paulo",
      date: "10 de janeiro de 2026",
      image: "https://via.placeholder.com/400x250/FF6B9D/FFFFFF?text=Notícia+2",
      link: "#"
    },
    {
      id: 3,
      title: "LA Educação expande presença em 14 estados brasileiros",
      source: "Valor Econômico",
      date: "5 de janeiro de 2026",
      image: "https://via.placeholder.com/400x250/FF6B9D/FFFFFF?text=Notícia+3",
      link: "#"
    },
    {
      id: 4,
      title: "Parceria com universidades internacionais marca novo passo da LA",
      source: "O Globo",
      date: "28 de dezembro de 2025",
      image: "https://via.placeholder.com/400x250/FF6B9D/FFFFFF?text=Notícia+4",
      link: "#"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % news.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + news.length) % news.length);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Notícias na <span className="text-[#E91E8C]">IMPRENSA NACIONAL</span>
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Notícias Grid - Desktop */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {news.map((item) => (
              <div 
                key={item.id}
                className="group cursor-pointer transform transition-transform duration-300 hover:scale-105"
              >
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-4 h-48">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:brightness-110 transition-all"
                  />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#E91E8C] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{item.source}</p>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
            ))}
          </div>

          {/* Carousel - Mobile */}
          <div className="md:hidden">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-6 h-64">
              <img 
                src={news[currentSlide].image} 
                alt={news[currentSlide].title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                {news[currentSlide].title}
              </h3>
              <p className="text-sm text-gray-600 mb-1">{news[currentSlide].source}</p>
              <p className="text-xs text-gray-500">{news[currentSlide].date}</p>
            </div>

            {/* Controles */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={prevSlide}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#E91E8C] text-white hover:bg-[#D41A7A] transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex gap-2">
                {news.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentSlide ? 'bg-[#E91E8C] w-8' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#E91E8C] text-white hover:bg-[#D41A7A] transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
