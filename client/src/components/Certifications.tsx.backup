import { trpc } from "@/lib/trpc";

export default function Certifications() {
  const { data: certifications = [] } = trpc.home.getCertifications.useQuery();

  if (certifications.length === 0) return null;

  return (
    <section className="pt-12 pb-2 bg-white overflow-hidden">
      <div className="container mx-auto px-4 mb-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#E91E8C]">
          Selo de Confiança Nacional e Internacional
        </h2>
      </div>

      <div 
        className="relative w-full overflow-hidden"
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
                className="h-20 md:h-24 w-auto object-contain"
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
