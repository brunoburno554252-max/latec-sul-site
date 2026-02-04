const seals = [
  { id: 1, name: "Reconhecido pelo MEC", image: "/assets/seals/mec-selo.png" },
  { id: 2, name: "Education Awards 2025", image: "/assets/seals/education-awards-2025.png" },
  { id: 3, name: "Google 5 Estrelas", image: "/assets/seals/google-5-estrelas.png" },
  { id: 4, name: "Certificado RA1000", image: "/assets/seals/ra1000-selo.png" },
];

export default function Certifications() {
  return (
    <section className="pt-12 pb-6 bg-white overflow-hidden border-b border-gray-100">
      <div className="container mx-auto px-4 mb-10 text-center">
        <span className="text-[#E91E8C] font-bold tracking-widest text-sm uppercase block mb-3">Qualidade Comprovada</span>
        {/* Alterado de text-[#9d197d] (roxo) para text-gray-900 (preto suave/neutro) */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Selo de Confiança Nacional e Internacional
        </h2>
      </div>

      <div 
        className="relative w-full overflow-hidden"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
      >
        <div className="flex items-center gap-16 animate-scroll-infinite py-6">
          {[...seals, ...seals, ...seals, ...seals].map((seal, index) => (
            <div 
              key={`${seal.id}-${index}`} 
              className="flex-shrink-0 hover:scale-110 transition-transform duration-300 bg-white rounded-lg p-2"
            >
              <img 
                src={seal.image} 
                alt={seal.name} 
                className={seal.id === 2 ? "h-32 md:h-40 w-auto object-contain" : "h-20 md:h-24 w-auto object-contain"}
              />
            </div>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-infinite {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-infinite {
          display: flex;
          width: max-content;
          animation: scroll-infinite 40s linear infinite;
        }
        .animate-scroll-infinite:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
}
