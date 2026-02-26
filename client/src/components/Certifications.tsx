import { trpc } from "@/lib/trpc";

export default function Certifications() {
  const { data: certifications = [] } = trpc.home.getCertifications.useQuery();

  if (certifications.length === 0) return null;

  return (
    <section className="bg-white overflow-hidden">
      {/* Faixa Azul Oficial do Site - Fina e Elegante */}
      <div className="bg-[#3559AC] py-3 w-full"> {/* Azul oficial do site */}
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase">
            SELOS DE CONFIANÇA
          </h2>
        </div>
      </div>

      {/* Carrossel de Selos */}
      <div 
        className="relative w-full overflow-hidden py-10"
        style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
      >
        <div className="flex items-center gap-16 animate-scroll-infinite py-4">
          {[...certifications, ...certifications, ...certifications, ...certifications].map((cert: any, index: number) => (
            <a
              key={`${cert.id}-${index}`}
              href={cert.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 hover:scale-110 transition-transform duration-300 bg-white rounded-lg p-2"
            >
              <img 
                src={cert.image_url} 
                alt={cert.name} 
                className="h-16 md:h-20 w-auto object-contain"
              />
            </a>
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
