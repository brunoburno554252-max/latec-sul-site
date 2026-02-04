const pressLogos = [
  { id: 1, name: "CARAS", logo: "/assets/press/logo-caras.png" },
  { id: 2, name: "ISTOÉ", logo: "/assets/press/logo-istoe.png" },
  { id: 3, name: "Valor Econômico", logo: "/assets/press/logo-valor-economico.png" },
  { id: 4, name: "G1", logo: "/assets/press/logo-g1.png" },
  { id: 5, name: "Empresas & Negócios", logo: "/assets/press/logo-empresas-negocios.png" },
  { id: 6, name: "O Maringá", logo: "/assets/press/logo-o-maringa.png" },
];

export default function PressNews() {
  return (
    <section className="py-16 bg-white border-b border-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#9d197d] uppercase tracking-widest">
            Notícias na IMPRENSA NACIONAL
          </h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20">
          {pressLogos.map((logo) => (
            <div key={logo.id} className="flex items-center justify-center group">
              <img 
                src={logo.logo}
                alt={logo.name}
                className={`w-auto object-contain transition-all duration-500 cursor-pointer opacity-100 group-hover:scale-110 ${
                  logo.name === "G1" || logo.name === "O Maringá" 
                    ? "h-16 md:h-24" 
                    : "h-12 md:h-16"
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
