import { trpc } from "@/lib/trpc";

export default function PressNews() {
  const { data: pressLogos = [] } = trpc.home.getPress.useQuery();

  if (pressLogos.length === 0) return null;

  return (
    <section className="bg-white border-b border-gray-50 overflow-hidden">
      {/* Faixa Azul Oficial do Site - Fina e Elegante */}
      <div className="bg-[#D4A017] py-3 w-full"> {/* Azul oficial do site */}
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase">
            SAIU NA IMPRENSA
          </h2>
        </div>
      </div>

      {/* Logos da Imprensa */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
          {pressLogos.map((logo: any) => (
            <a
              key={logo.id}
              href={logo.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center group"
            >
              <img 
                src={logo.image_url}
                alt={logo.name}
                className="h-10 md:h-14 w-auto object-contain transition-all duration-500 cursor-pointer opacity-100 group-hover:scale-110"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
