import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from '@/lib/trpc';
import { Target, Globe, ShieldCheck, Building2, History, Briefcase, GraduationCap, Rocket, Handshake, Landmark, Lightbulb, Users, TrendingUp } from "lucide-react";

export default function AboutPage() {
  const { data: hero } = trpc.about.getHero.useQuery();
  const { data: timelineDb = [] } = trpc.about.getTimeline.useQuery();
  const { data: unitsDb = [] } = trpc.about.getUnits.useQuery();


  const sortedTimeline = [...timelineDb].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section - SEM ALTERAÇÃO */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#c41e8a] to-primary"></div>
          <div className="container relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">{hero?.title || "Sobre a LA Educação"}</h1>
                <p className="text-xl text-white/90 leading-relaxed">{hero?.description}</p>
              </div>
              <div className="relative">
                <img 
                  src={hero?.imageUrl || "/sede_la_educacao.webp"} 
                  alt="Sede" 
                  className="rounded-3xl shadow-2xl w-full h-[400px] object-cover border-4 border-white/20"
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

        {/* ===== TAREFA 3: Nossa História - Novo texto completo + ícones decorativos ===== */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <History size={28} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Nossa História</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-600 space-y-5">
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mt-1">
                    <Lightbulb size={20} />
                  </div>
                  <p className="m-0">A história do Grupo LA Educação nasce da <strong>coragem</strong>, da <strong>persistência</strong> e da <strong>convicção</strong> de que a educação transforma realidades.</p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mt-1">
                    <Users size={20} />
                  </div>
                  <p className="m-0">Fredison Carneiro, fundador do Grupo, iniciou sua trajetória empreendedora ainda muito jovem. De origem humilde, enfrentou desafios que moldaram sua visão de mundo e fortaleceram seu propósito.</p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mt-1">
                    <Landmark size={20} />
                  </div>
                  <p className="m-0">Em <strong>2007</strong>, ingressou no Banco Bradesco como estagiário. Durante oito anos, construiu uma carreira sólida, sendo promovido nove vezes. A vivência corporativa proporcionou formação estratégica, disciplina comercial e visão de gestão.</p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mt-1">
                    <GraduationCap size={20} />
                  </div>
                  <p className="m-0">Em <strong>2018</strong>, ao atuar como consultor regional na Unicesumar e, posteriormente, como coordenador comercial do EAD na PUCPR, passou a compreender profundamente o cenário da educação a distância no Brasil. Nesse período, teve contato direto com pequenos empresários educacionais e identificou uma lacuna clara: a necessidade de suporte estratégico, comercial e estrutural para que pudessem competir de forma sustentável no mercado.</p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mt-1">
                    <Briefcase size={20} />
                  </div>
                  <p className="m-0">Em <strong>2020</strong>, começou a estruturar o projeto que daria origem a algo maior. Foi aqui a idealização da LA Educação. Mas ainda a ideia só estava no papel.</p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mt-1">
                    <Rocket size={20} />
                  </div>
                  <p className="m-0">Em <strong>2023</strong>, nasce a LA Educação — um nome que carrega significado familiar e representa os valores que sustentam a organização: trabalho, família e fé. Desde sua fundação, a LA Educação consolidou parcerias estratégicas com grandes instituições de ensino e ampliou sua atuação para educação profissional, ensino médio, técnico, graduação, pós-graduação e segunda licenciatura. No mesmo ano, iniciou a representação e o suporte a pequenos empresários do setor, oferecendo consultoria comercial, marketing e assessoria jurídica.</p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mt-1">
                    <TrendingUp size={20} />
                  </div>
                  <p className="m-0">Em <strong>2024</strong>, a empresa evoluiu para o Grupo LA Educação, consolidando-se como uma startup educacional com uma missão clara: revolucionar o cenário educacional brasileiro, conectando instituições de ensino a parceiros de pequeno porte e promovendo maior equilíbrio competitivo frente aos grandes grupos do setor.</p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0 mt-1">
                    <Handshake size={20} />
                  </div>
                  <p className="m-0">Hoje, o Grupo LA Educação atua como <strong>ponte entre oportunidade e crescimento</strong>, impulsionando negócios educacionais de pequenos empresários e ampliando o acesso à educação de qualidade em todo o país.</p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ===== TAREFA 1: Timeline - Cards menores e mais compactos ===== */}
        <section className="py-16 bg-gray-50 overflow-hidden">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Uma trajetória de crescimento</h2>
              <p className="text-gray-500 text-lg">Inovação e compromisso com a educação brasileira</p>
            </div>

            <div className="relative max-w-5xl mx-auto">
              {/* Linha Central Cinza */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

              <div>
                {sortedTimeline.map((item, index) => (
                  <div key={item.id} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`} style={{ marginTop: index === 0 ? 0 : '-80px', zIndex: sortedTimeline.length - index }}>
                    {/* Bolinha Rosa */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-md hidden md:block" style={{ zIndex: 20, top: '30px' }}></div>
                    
                    {/* Card Compacto */}
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

        {/* ===== TAREFA 2: Missão, Visão, Valores - Textos atualizados do site original ===== */}
        <section className="py-24 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-12 rounded-[48px] shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <Target className="text-primary w-14 h-14 mb-8" />
                <h3 className="text-2xl font-bold mb-4">Missão</h3>
                <p className="text-gray-600 text-xl leading-relaxed">Promover uma competitividade mais justa para os pequenos empreendedores do setor educacional, ampliando o acesso à educação de qualidade e contribuindo para um Brasil mais próspero.</p>
              </div>
              <div className="bg-white p-12 rounded-[48px] shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <Globe className="text-primary w-14 h-14 mb-8" />
                <h3 className="text-2xl font-bold mb-4">Visão</h3>
                <p className="text-gray-600 text-xl leading-relaxed">Ser reconhecido como líder e pioneiro na intermediação de negócios educacionais no Brasil, tornando-se a maior força de vendas offline do país, com 6.000 parceiros afiliados até 2026.</p>
              </div>
              <div className="bg-white p-12 rounded-[48px] shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <ShieldCheck className="text-primary w-14 h-14 mb-8" />
                <h3 className="text-2xl font-bold mb-4">Valores</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Alegria', desc: 'Criar um ambiente leve e inspirador.' },
                    { name: 'Caridade', desc: 'Só queremos o que podemos compartilhar.' },
                    { name: 'Gratidão', desc: 'Cultivar a gratidão em todas as situações.' },
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

        {/* Unidades - SEM ALTERAÇÃO */}
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
                    <img src={unit.imageUrl || "/sede_la_educacao.webp"} alt={unit.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight">{unit.name}</h3>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 bg-white rounded-[48px] p-12 shadow-lg border border-gray-100 flex flex-col md:flex-row items-center gap-10">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary flex-shrink-0">
                <Building2 size={40} />
              </div>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                Contamos com uma <strong>ampla estrutura física para atender mais de 50.000 alunos</strong> em todo o Brasil. Nossos espaços possuem instalações de última geração, com mais de 30 salas de aula, 8 laboratórios e ambientes climatizados. Ao todo, são <strong>mais de 2.000 m²</strong> dedicados à formação educacional.
              </p>
            </div>
          </div>
        </section>


      </main>

      <Footer />
    </div>
  );
}
