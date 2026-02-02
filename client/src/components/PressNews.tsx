import { useEffect, useRef } from "react";

const pressSeals = [
  { id: 1, name: "Jornal Nacional", image: "https://via.placeholder.com/120x120/E91E8C/FFFFFF?text=JN" },
  { id: 2, name: "Folha de S.Paulo", image: "https://via.placeholder.com/120x120/E91E8C/FFFFFF?text=FSP" },
  { id: 3, name: "O Globo", image: "https://via.placeholder.com/120x120/E91E8C/FFFFFF?text=OG" },
  { id: 4, name: "Valor Econômico", image: "https://via.placeholder.com/120x120/E91E8C/FFFFFF?text=VE" },
  { id: 5, name: "Revista Educação", image: "https://via.placeholder.com/120x120/E91E8C/FFFFFF?text=RE" },
  { id: 6, name: "Portal de Notícias", image: "https://via.placeholder.com/120x120/E91E8C/FFFFFF?text=PN" },
  // Repetir para efeito de carrossel infinito
  { id: 7, name: "Jornal Nacional", image: "https://via.placeholder.com/120x120/E91E8C/FFFFFF?text=JN" },
  { id: 8, name: "Folha de S.Paulo", image: "https://via.placeholder.com/120x120/E91E8C/FFFFFF?text=FSP" },
  { id: 9, name: "O Globo", image: "https://via.placeholder.com/120x120/E91E8C/FFFFFF?text=OG" },
  { id: 10, name: "Valor Econômico", image: "https://via.placeholder.com/120x120/E91E8C/FFFFFF?text=VE" },
];

export default function PressNews() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 1;
      }
    };

    const intervalId = setInterval(scroll, 20);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">
      <div className="container mx-auto px-4 mb-8 text-center">
        <span className="text-[#E91E8C] font-bold tracking-widest text-sm uppercase block">Notícias da Imprensa Nacional</span>
      </div>

      <div 
        ref={scrollRef}
        className="flex items-center gap-16 overflow-x-hidden whitespace-nowrap py-4"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
      >
        {/* Double the seals to create seamless infinite scroll */}
        {[...pressSeals, ...pressSeals].map((seal, index) => (
          <div 
            key={`${seal.id}-${index}`} 
            className="flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer transform hover:scale-110"
          >
            <img 
              src={seal.image} 
              alt={seal.name} 
              className="h-24 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
