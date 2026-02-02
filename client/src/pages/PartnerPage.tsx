import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, TrendingUp, Users, DollarSign } from "lucide-react";
import ExclusiveSupport from "@/components/ExclusiveSupport";

export default function PartnerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gray-900 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/about-building.jpg')] bg-cover bg-center opacity-20"></div>
          <div className="container mx-auto px-6 relative z-10 text-center">
            <span className="inline-block bg-accent text-white px-4 py-1 rounded-full text-sm font-bold mb-6 uppercase tracking-wider">Oportunidade de Negócio</span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Seja um Parceiro LA. Educação</h1>
            <p className="text-xl max-w-2xl mx-auto text-gray-300 mb-8">
              Abra seu próprio polo educacional e faça parte da rede que mais cresce no Brasil. Baixo investimento e alta rentabilidade.
            </p>
            <Button className="bg-accent hover:bg-accent/90 text-white font-bold text-lg px-8 py-6 rounded-xl shadow-lg shadow-accent/20 transition-all hover:-translate-y-1">
              QUERO SER UM LICENCIADO
            </Button>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">Por que investir na LA. Educação?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Oferecemos um modelo de negócio testado e validado, com todo o suporte que você precisa para ter sucesso.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <TrendingUp size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Alta Rentabilidade</h3>
                <p className="text-gray-600 text-sm">
                  Retorno rápido do investimento com margens de lucro atrativas e recorrentes.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <DollarSign size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Baixo Investimento</h3>
                <p className="text-gray-600 text-sm">
                  Modelo de negócio enxuto, sem necessidade de grandes estruturas físicas iniciais.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Suporte Total</h3>
                <p className="text-gray-600 text-sm">
                  Treinamento completo, material de marketing e assessoria pedagógica contínua.
                </p>
              </div>
              <div className="p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Marca Consolidada</h3>
                <p className="text-gray-600 text-sm">
                  Associe-se a uma marca reconhecida pelo MEC e premiada internacionalmente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Exclusive Support Section */}
        <ExclusiveSupport />

        {/* Form Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-primary p-12 text-white flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/hero-students.jpg')] bg-cover bg-center opacity-10"></div>
                <div className="relative z-10">
                  <h3 className="text-3xl font-heading font-bold mb-6">Vamos crescer juntos?</h3>
                  <p className="text-white/80 mb-8">
                    Preencha o formulário ao lado e nossa equipe de expansão entrará em contato para apresentar todos os detalhes do nosso modelo de licenciamento.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-accent rounded-full"></div> Mais de 4.000 cursos</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-accent rounded-full"></div> Plataforma intuitiva</li>
                    <li className="flex items-center gap-3"><div className="w-2 h-2 bg-accent rounded-full"></div> Material didático incluso</li>
                  </ul>
                </div>
              </div>
              <div className="md:w-1/2 p-12">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                    <Input placeholder="Seu nome" className="bg-gray-50 border-gray-200 focus:border-primary h-12 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                    <Input type="email" placeholder="seu@email.com" className="bg-gray-50 border-gray-200 focus:border-primary h-12 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone / WhatsApp</label>
                    <Input placeholder="(00) 00000-0000" className="bg-gray-50 border-gray-200 focus:border-primary h-12 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cidade de Interesse</label>
                    <Input placeholder="Cidade - UF" className="bg-gray-50 border-gray-200 focus:border-primary h-12 rounded-xl" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem (Opcional)</label>
                    <Textarea placeholder="Conte um pouco sobre seu perfil..." className="bg-gray-50 border-gray-200 focus:border-primary min-h-[100px] rounded-xl" />
                  </div>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
                    ENVIAR SOLICITAÇÃO
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
