import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export function FAQPage() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const faqs = [
    {
      category: "Institucional",
      questions: [
        {
          question: "A faculdade é reconhecida pelo MEC?",
          answer: "Sim, a LA. Educação e suas instituições parceiras são devidamente credenciadas e reconhecidas pelo Ministério da Educação (MEC), garantindo a validade nacional de todos os diplomas emitidos."
        },
        {
          question: "Onde fica localizada a faculdade?",
          answer: "Nossa sede administrativa está localizada em Maringá - PR, mas possuímos polos de apoio presencial em diversas cidades do Brasil para atender aos alunos da modalidade EAD."
        }
      ]
    },
    {
      category: "Ingresso e Matrícula",
      questions: [
        {
          question: "Quais são as formas de ingresso?",
          answer: "Oferecemos diversas formas de ingresso: Vestibular Online (gratuito), uso da nota do ENEM, Transferência Externa (para alunos de outras faculdades) e Portador de Diploma (para quem já tem curso superior)."
        },
        {
          question: "Quais documentos preciso para me matricular?",
          answer: "Geralmente são necessários: RG, CPF, Certidão de Nascimento ou Casamento, Comprovante de Residência, Histórico Escolar e Certificado de Conclusão do Ensino Médio. A lista completa é enviada após a aprovação."
        },
        {
          question: "Existe taxa de matrícula?",
          answer: "Frequentemente temos campanhas promocionais com isenção ou desconto na primeira mensalidade/matrícula. Consulte as condições vigentes no momento da sua inscrição."
        }
      ]
    },
    {
      category: "Vida Acadêmica",
      questions: [
        {
          question: "Como funcionam as aulas EAD?",
          answer: "As aulas ficam disponíveis no nosso Ambiente Virtual de Aprendizagem (AVA). Você pode assistir quando e onde quiser. Além disso, temos encontros ao vivo programados e tutores disponíveis para tirar dúvidas."
        },
        {
          question: "Como funcionam as provas?",
          answer: "As avaliações são realizadas majoritariamente online através do portal do aluno, com algumas atividades presenciais obrigatórias no polo ao final do semestre, conforme exigência do MEC para cursos EAD."
        },
        {
          question: "O curso tem estágio obrigatório?",
          answer: "Depende do curso. Cursos como Enfermagem, Fisioterapia e Licenciaturas possuem estágios obrigatórios. Cursos de Gestão e Tecnólogos geralmente não exigem estágio, mas incentivamos a prática."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Como podemos ajudar?</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Tire suas dúvidas sobre nossos cursos, formas de ingresso e metodologia de ensino.
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        
        {/* Search Bar (Visual only for now) */}
        <div className="relative -mt-20 mb-12 shadow-xl rounded-2xl bg-white p-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Digite sua dúvida aqui..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl border-none bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="space-y-12">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${sectionIndex * 100}ms` }}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] rounded-full"></span>
                {section.category}
              </h2>
              
              <div className="space-y-4">
                {section.questions.map((item, qIndex) => {
                  const globalIndex = sectionIndex * 10 + qIndex; // Unique ID logic
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div 
                      key={qIndex}
                      className={cn(
                        "bg-white rounded-xl border transition-all duration-300 overflow-hidden",
                        isOpen ? "border-primary shadow-md" : "border-gray-100 hover:border-gray-200"
                      )}
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-gray-50/50 transition-colors"
                      >
                        <span className={cn(
                          "font-bold text-lg transition-colors",
                          isOpen ? "text-primary" : "text-gray-700"
                        )}>
                          {item.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-primary" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      
                      <div 
                        className={cn(
                          "transition-all duration-300 ease-in-out overflow-hidden bg-gray-50/30",
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        )}
                      >
                        <div className="px-6 pb-6 pt-2 text-gray-600 leading-relaxed border-t border-gray-100/50">
                          {item.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-primary/5 rounded-2xl p-8 text-center border border-primary/10">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Ainda tem dúvidas?</h3>
          <p className="text-gray-600 mb-6">Nossa equipe de atendimento está pronta para te ajudar.</p>
          <a 
            href="https://wa.me/5544998455042" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] text-white font-bold rounded-xl hover:from-[#146B2F] hover:to-[#B8860B]/90 transition-colors shadow-lg shadow-[#D4A017]/30"
          >
            Falar no WhatsApp
          </a>
        </div>

      </main>
      <Footer />
    </div>
  );
}
