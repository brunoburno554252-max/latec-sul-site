import InteractiveEcosystem from "./InteractiveEcosystem";
import { ArrowDown } from "lucide-react";

export default function Ecosystem() {
  return (
    <section id="ecossistema" className="w-full bg-white">
      {/* Bloco Introdutório */}
      <div className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            Por que somos o maior <span className="text-primary">Ecossistema Educacional</span> do Brasil?
          </h2>
          
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            À disposição de nossos parceiros e alunos, reunimos uma estrutura completa que integra educação, tecnologia, finanças, marketing e impacto social, tudo dentro de um único ecossistema.
          </p>

          {/* Seta para baixo */}
          <div className="flex justify-center animate-bounce">
            <ArrowDown className="text-primary" size={32} />
          </div>
        </div>
      </div>

      {/* Ecossistema Interativo */}
      <InteractiveEcosystem />
    </section>
  );
}
