import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Headphones } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function OmbudsmanPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const createMutation = trpc.ombudsman.create.useMutation({
    onSuccess: () => {
      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    },
    onError: (error) => {
      toast.error("Erro ao enviar mensagem: " + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    createMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mx-auto mb-6">
              <Headphones size={32} />
            </div>
            <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Ouvidoria Institucional</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Este é um canal exclusivo para sugestões, elogios, reclamações ou denúncias. Sua opinião é fundamental para nossa melhoria contínua.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gray-900 p-8 text-white text-center">
              <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                <MessageSquare size={24} className="text-accent" />
                Registre sua manifestação
              </h2>
            </div>
            <div className="p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Seu nome completo"
                      className="bg-gray-50 border-gray-200 focus:border-primary h-12 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu@email.com"
                      className="bg-gray-50 border-gray-200 focus:border-primary h-12 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(00) 00000-0000"
                      className="bg-gray-50 border-gray-200 focus:border-primary h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Assunto da mensagem"
                      className="bg-gray-50 border-gray-200 focus:border-primary h-12 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Descreva detalhadamente sua manifestação..."
                    className="bg-gray-50 border-gray-200 focus:border-primary min-h-[150px] rounded-xl"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] hover:from-[#146B2F] hover:to-[#B8860B]/90 text-white font-bold h-12 rounded-xl shadow-lg shadow-[#D4A017]/30 transition-all hover:-translate-y-1"
                >
                  {createMutation.isPending ? "ENVIANDO..." : "ENVIAR MANIFESTAÇÃO"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
