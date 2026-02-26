import { trpc } from "@/lib/trpc";

export default function PressNews() {
  const { data: pressLogos = [] } = trpc.home.getPress.useQuery();

  if (pressLogos.length === 0) return null;

  return (
    <section className="py-8 bg-white border-b border-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#E91E8C] uppercase tracking-widest">
            Notícias na IMPRENSA NACIONAL
          </h2>
        </div>

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
                className="h-12 md:h-16 w-auto object-contain transition-all duration-500 cursor-pointer opacity-100 group-hover:scale-110"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
