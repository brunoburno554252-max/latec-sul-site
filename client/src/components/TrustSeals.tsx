export default function TrustSeals() {
  const seals = [
    {
      id: 1,
      name: "Selo de Excelência",
      image: "https://via.placeholder.com/120x120/D4AF37/FFFFFF?text=Excelência",
      description: "Certificação Nacional"
    },
    {
      id: 2,
      name: "Education Awards",
      image: "https://via.placeholder.com/120x120/1a1a1a/FFD700?text=AWARDS",
      description: "Prêmio 2025"
    },
    {
      id: 3,
      name: "Google 5 Estrelas",
      image: "https://via.placeholder.com/120x120/4285F4/FFFFFF?text=Google",
      description: "Certificação Google"
    },
    {
      id: 4,
      name: "RA1000",
      image: "https://via.placeholder.com/120x120/22C55E/FFFFFF?text=RA1000",
      description: "Certificação Premium"
    },
    {
      id: 5,
      name: "Selo de Excelência",
      image: "https://via.placeholder.com/120x120/D4AF37/FFFFFF?text=Excelência",
      description: "Certificação Internacional"
    },
    {
      id: 6,
      name: "Education Awards",
      image: "https://via.placeholder.com/120x120/1a1a1a/FFD700?text=AWARDS",
      description: "Prêmio Internacional"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Título */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Selo de Confiança <span className="text-[#E91E8C]">Nacional e Internacional</span>
          </h2>
        </div>

        {/* Selos Grid */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {seals.map((seal) => (
            <div 
              key={seal.id} 
              className="flex flex-col items-center justify-center group transform transition-transform duration-300 hover:scale-110"
            >
              <div className="w-32 h-32 flex items-center justify-center mb-3 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                <img 
                  src={seal.image} 
                  alt={seal.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
