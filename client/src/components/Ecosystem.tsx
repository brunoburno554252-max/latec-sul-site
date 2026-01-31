import { BookOpen, Building2, Cpu, Heart, Landmark, GraduationCap, Globe, Brain, Banknote, Megaphone } from "lucide-react";

export default function Ecosystem() {
  return (
    <section className="py-20 bg-gradient-to-b from-pink-50 to-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Nosso Ecossistema
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Empresas trabalhando de forma integrada para oferecer as melhores soluções em educação, tecnologia e suporte.
          </p>
        </div>

        {/* Tree Structure */}
        <div className="relative max-w-6xl mx-auto">
          {/* Category Headers */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-primary">Instituições de Ensino</h3>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-primary">Tecnologia</h3>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-primary">Impacto Social</h3>
            </div>
          </div>

          {/* Tree Visual */}
          <div className="relative">
            {/* SVG Tree Lines */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none" 
              viewBox="0 0 1200 600" 
              preserveAspectRatio="xMidYMid meet"
              style={{ zIndex: 0 }}
            >
              {/* Main trunk from center */}
              <path 
                d="M600 600 L600 400" 
                stroke="#DA1068" 
                strokeWidth="4" 
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Left branch - Instituições */}
              <path 
                d="M600 400 Q500 380 300 350" 
                stroke="#DA1068" 
                strokeWidth="3" 
                fill="none"
                strokeLinecap="round"
              />
              <path d="M300 350 L300 80" stroke="#DA1068" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M300 80 L250 60" stroke="#DA1068" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M300 150 L250 130" stroke="#DA1068" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M300 220 L250 200" stroke="#DA1068" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M300 290 L250 270" stroke="#DA1068" strokeWidth="2" fill="none" strokeLinecap="round"/>
              
              {/* Center branch - Tecnologia */}
              <path 
                d="M600 400 L600 200" 
                stroke="#DA1068" 
                strokeWidth="3" 
                fill="none"
                strokeLinecap="round"
              />
              <path d="M600 200 L700 100" stroke="#DA1068" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M600 200 L700 200" stroke="#DA1068" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M600 200 L700 300" stroke="#DA1068" strokeWidth="2" fill="none" strokeLinecap="round"/>
              
              {/* Right branch - Impacto Social */}
              <path 
                d="M600 400 Q700 380 900 350" 
                stroke="#DA1068" 
                strokeWidth="3" 
                fill="none"
                strokeLinecap="round"
              />
              <path d="M900 350 L950 200" stroke="#DA1068" strokeWidth="2" fill="none" strokeLinecap="round"/>
              
              {/* Decorative leaves */}
              <ellipse cx="280" cy="50" rx="20" ry="10" fill="#F9A8D4" opacity="0.6" transform="rotate(-30 280 50)"/>
              <ellipse cx="320" cy="70" rx="15" ry="8" fill="#F472B6" opacity="0.5" transform="rotate(20 320 70)"/>
              <ellipse cx="720" cy="90" rx="18" ry="9" fill="#F9A8D4" opacity="0.6" transform="rotate(-20 720 90)"/>
              <ellipse cx="970" cy="180" rx="20" ry="10" fill="#F472B6" opacity="0.5" transform="rotate(30 970 180)"/>
            </svg>

            {/* Content Grid */}
            <div className="grid grid-cols-3 gap-8 relative z-10">
              {/* Column 1 - Instituições de Ensino */}
              <div className="space-y-4">
                <CompanyCard 
                  icon={<BookOpen className="w-6 h-6 text-primary" />}
                  name="Faculdade LA"
                  description="Ensino superior EAD reconhecido pelo MEC"
                />
                <CompanyCard 
                  icon={<Landmark className="w-6 h-6 text-primary" />}
                  name="LATEC-ES"
                  description="Escola técnica no Espírito Santo"
                />
                <CompanyCard 
                  icon={<Building2 className="w-6 h-6 text-primary" />}
                  name="LATEC-RS"
                  description="Escola técnica no Rio Grande do Sul"
                />
                <CompanyCard 
                  icon={<Globe className="w-6 h-6 text-primary" />}
                  name="ASTORTEC-PR"
                  description="Escola técnica no Paraná"
                />
              </div>

              {/* Column 2 - Tecnologia (with center root) */}
              <div className="flex flex-col items-center">
                <div className="space-y-4 mb-8">
                  <CompanyCard 
                    icon={<Banknote className="w-6 h-6 text-primary" />}
                    name="LA BANK"
                    description="Banco digital do ecossistema"
                  />
                  <CompanyCard 
                    icon={<Megaphone className="w-6 h-6 text-primary" />}
                    name="MDE"
                    description="Agência de marketing educacional"
                  />
                  <CompanyCard 
                    icon={<Cpu className="w-6 h-6 text-primary" />}
                    name="LA Tech"
                    description="Soluções em tecnologia educacional"
                  />
                </div>
                
                {/* Central Root - LA Educação */}
                <div className="mt-auto">
                  <div className="bg-primary text-white px-8 py-6 rounded-2xl shadow-xl shadow-primary/30 text-center transform hover:scale-105 transition-transform duration-300">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-bold">LA Educação</h4>
                    <p className="text-white/80 text-sm mt-1">O coração do ecossistema</p>
                  </div>
                </div>
              </div>

              {/* Column 3 - Impacto Social */}
              <div className="flex flex-col items-end justify-center">
                <CompanyCard 
                  icon={<Heart className="w-6 h-6 text-primary" />}
                  name="Instituto AIZUL"
                  description="Braço social do grupo, transformando vidas"
                />
              </div>
            </div>
          </div>

          {/* Roots decoration at bottom */}
          <div className="flex justify-center mt-8">
            <svg width="200" height="60" viewBox="0 0 200 60">
              <path d="M100 0 Q80 30 60 55" stroke="#9d197d" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M100 0 Q90 25 85 50" stroke="#c41e8a" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M100 0 Q110 25 115 50" stroke="#c41e8a" strokeWidth="2" fill="none" strokeLinecap="round"/>
              <path d="M100 0 Q120 30 140 55" stroke="#9d197d" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M100 0 Q100 20 100 45" stroke="#DA1068" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

// Company Card Component
function CompanyCard({ 
  icon, 
  name, 
  description 
}: { 
  icon: React.ReactNode; 
  name: string; 
  description: string;
}) {
  return (
    <div className="bg-white border border-pink-100 rounded-xl p-4 shadow-md hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex items-center gap-4 group">
      <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-gray-900">{name}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}
