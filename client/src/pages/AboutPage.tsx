import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from '@/lib/trpc';
import { Target, Globe, ShieldCheck, Building2, History, Briefcase, GraduationCap, Rocket, Handshake, Landmark, Lightbulb, Users, TrendingUp, Heart, MapPin, Award } from "lucide-react";

export default function AboutPage() {
  const { data: hero } = trpc.about.getHero.useQuery();
  const { data: timelineDb = [] } = trpc.about.getTimeline.useQuery();
  const { data: unitsDb = [] } = trpc.about.getUnits.useQuery();

  const sortedTimeline = [...timelineDb].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1B8C3D] via-[#D4A017] to-[#1B8C3D]"></div>
          <div className="container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">{hero?.title || "Sobre a LATec Sul"}</h1>
                <p className="text-xl text-white/90 leading-relaxed">{hero?.description || "Orgulho do Sul. Transformação que se constrói."}</p>
              </div>
              <div className="relative">
                <img 
                  src={hero?.imageUrl || "/images/logo-la-educacao.png"} 
                  alt="LATec Sul" 
                  className="rounded-3xl shadow-2xl w-full h-[400px] object-contain bg-white/10 backdrop-blur-sm border-4 border-white/20 p-8"
                />
                {hero?.badgeText && (
                  <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Building2 className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{hero.badgeText}</p>
                      <p className="font-bold text-xl">{hero.badgeValue}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Raízes e História */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <History size={28} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Raízes e História</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-600 space-y-5">
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mt-1">
                    <MapPin size={20} />
                  </div>
                  <p className="m-0">A <strong>LA Tec Sul</strong> nasce com raízes profundas no solo gaúcho e os olhos firmemente voltados para o futuro. Herdeira do legado respeitável do <strong>Colégio Unibeta</strong> — uma instituição com mais de duas décadas de história e credibilidade na formação de milhares de sulenses — a LA Tec Sul surge como a continuidade desse compromisso com a educação, agora fortalecida pelo know-how e pela estrutura do <strong>Grupo LA Educação</strong>.</p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mt-1">
                    <Lightbulb size={20} />
                  </div>
                  <p className="m-0">Mais do que uma simples aquisição, a LA Tec Sul é uma <strong>ponte entre o tradicional e o inovador</strong>, entre o regional e o técnico, entre o sonho e a realização. Sua personalidade é composta por três pilares complementares: a <strong>inspiração</strong> que impulsiona mudanças, a <strong>tradição</strong> que sustenta a confiança, e a <strong>técnica</strong> que garante qualidade.</p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mt-1">
                    <GraduationCap size={20} />
                  </div>
                  <p className="m-0">A promessa da LA Tec Sul é clara e poderosa: oferecer <strong>ensino técnico de qualidade</strong>, com estrutura prática, acessibilidade plena e um custo acessível — tornando possível, para qualquer gaúcho, transformar seu futuro profissional e pessoal.</p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mt-1">
                    <Heart size={20} />
                  </div>
                  <p className="m-0">Seja para quem busca sua primeira qualificação, seja para quem deseja fazer uma transição de carreira, a LA Tec Sul garante não apenas conhecimento, mas também <strong>preparo real para o mercado de trabalho</strong> e a valorização de cada conquista familiar.</p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mt-1">
                    <Handshake size={20} />
                  </div>
                  <p className="m-0">A LA Tec Sul se posiciona como uma <strong>escola do Sul, feita para o Sul</strong>. Com a força de um nome já respeitado e a solidez de uma nova estrutura que potencializa tudo aquilo que já funcionava. Seu maior diferencial está na combinação entre estrutura prática, qualidade inquestionável, acessibilidade, professores capacitados e um modelo de ensino que realmente forma para o trabalho.</p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        {sortedTimeline.length > 0 && (
        <section className="py-16 bg-gray-50 overflow-hidden">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Uma trajetória de crescimento</h2>
              <p className="text-gray-500 text-lg">Inovação e compromisso com a educação do Sul</p>
            </div>

            <div className="relative max-w-5xl mx-auto">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

              <div>
                {sortedTimeline.map((item, index) => (
                  <div key={item.id} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`} style={{ marginTop: index === 0 ? 0 : '-80px', zIndex: sortedTimeline.length - index }}>
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md hidden md:block" style={{ zIndex: 20, top: '30px' }}></div>
                    
                    <div className="w-full md:w-[46%] px-2">
                      <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                        
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-primary text-white px-3 py-1 rounded-full font-bold text-xs shadow-md shadow-primary/20">
                            {item.year}
                          </span>
                          {item.tag && (
                            <span className="text-primary font-bold text-xs uppercase tracking-widest">
                              {item.tag}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-primary transition-colors leading-tight">
                          {item.title}
                        </h3>
                        
                        <p className="text-gray-600 leading-relaxed text-sm mb-2">
                          {item.description}
                        </p>

                        {item.imageUrl && (
                          <div className="rounded-lg overflow-hidden shadow-sm aspect-[16/9] relative">
                            <img 
                              src={item.imageUrl} 
                              alt={item.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="hidden md:block md:w-[4%]"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Missão, Visão, Valores */}
        <section className="py-24 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-12 rounded-[48px] shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <Target className="text-primary w-14 h-14 mb-8" />
                <h3 className="text-2xl font-bold mb-4">Missão</h3>
                <p className="text-gray-600 text-xl leading-relaxed">Oferecer ensino técnico de qualidade, com estrutura prática, acessibilidade plena e custo acessível, tornando possível para qualquer gaúcho transformar seu futuro profissional e pessoal.</p>
              </div>
              <div className="bg-white p-12 rounded-[48px] shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <Globe className="text-primary w-14 h-14 mb-8" />
                <h3 className="text-2xl font-bold mb-4">Visão</h3>
                <p className="text-gray-600 text-xl leading-relaxed">Ser reconhecida como a principal referência em educação técnica no Sul do Brasil, formando profissionais preparados para o mercado de trabalho com excelência e compromisso com a comunidade.</p>
              </div>
              <div className="bg-white p-12 rounded-[48px] shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <ShieldCheck className="text-primary w-14 h-14 mb-8" />
                <h3 className="text-2xl font-bold mb-4">Valores</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Alegria', desc: 'Criar um ambiente leve e inspirador.' },
                    { name: 'Gratidão', desc: 'Cultivar a gratidão em todas as situações.' },
                    { name: 'Caridade', desc: 'Só queremos o que podemos compartilhar.' },
                    { name: 'Liberdade', desc: 'A liberdade é a chave para o potencial humano.' }
                  ].map(v => (
                    <div key={v.name} className="flex items-start gap-3">
                      <div className="w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/30 mt-1.5 flex-shrink-0"></div>
                      <div>
                        <span className="text-lg font-bold text-gray-800">{v.name}:</span>
                        <span className="text-gray-600 text-base ml-1">{v.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Manifesto */}
        <section className="py-20 bg-gradient-to-br from-[#1B8C3D] via-[#146B2F] to-[#1B8C3D] text-white">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <Award className="w-16 h-16 mx-auto mb-8 text-[#D4A017]" />
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Nosso Manifesto</h2>
              <blockquote className="text-xl md:text-2xl leading-relaxed italic opacity-90 mb-8">
                "Nós acreditamos no poder da educação como ponte entre o sonho e a realidade. Acreditamos que o Sul tem sua própria força, seu próprio ritmo e sua própria história. Por isso, honramos o que veio antes, enquanto construímos o que virá depois."
              </blockquote>
              <p className="text-2xl font-bold text-[#D4A017]">
                Orgulho do Sul. Transformação que se constrói.
              </p>
            </div>
          </div>
        </section>

        {/* Estatísticas */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-green-50 to-white border border-green-100">
                <p className="text-5xl font-extrabold text-primary mb-2">+2.500</p>
                <p className="text-gray-600 font-semibold text-lg">Alunos Ativos</p>
              </div>
              <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-green-50 to-white border border-green-100">
                <p className="text-5xl font-extrabold text-primary mb-2">+17</p>
                <p className="text-gray-600 font-semibold text-lg">Anos de Mercado</p>
              </div>
              <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-green-50 to-white border border-green-100">
                <p className="text-5xl font-extrabold text-primary mb-2">+10.000</p>
                <p className="text-gray-600 font-semibold text-lg">Alunos Formados</p>
              </div>
            </div>
          </div>
        </section>

        {/* Unidades */}
        {unitsDb.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Nossas Unidades</h2>
              <p className="text-gray-500 text-xl">Estrutura de Excelência</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {unitsDb.map(unit => (
                <div key={unit.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="h-36 overflow-hidden">
                    <img src={unit.imageUrl || "/images/logo-la-educacao.png"} alt={unit.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight">{unit.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

      </main>

      <Footer />
    </div>
  );
}
