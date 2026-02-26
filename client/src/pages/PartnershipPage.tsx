import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowLeft, Building2, Mail, Phone, User } from "lucide-react";

export default function PartnershipPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");

  const createMutation = trpc.partners.create.useMutation({
    onSuccess: () => {
      toast.success("Solicitação enviada com sucesso! Entraremos em contato em breve.");
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setMessage("");
    },
    onError: (error: any) => {
      toast.error(`Erro ao enviar solicitação: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ name, email, phone, company, message });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-green-900">
                Seja um Parceiro
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Junte-se a nós e faça parte de uma rede de excelência educacional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <User className="w-4 h-4 inline mr-2" />
                    Nome Completo *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Empresa/Instituição
                  </Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Nome da sua empresa ou instituição"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Conte-nos sobre seu interesse em ser parceiro..."
                    rows={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Enviando..." : "Enviar Solicitação"}
                </Button>
              </form>

              <div className="mt-8 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">
                  Por que ser parceiro?
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Acesso a uma rede de profissionais qualificados</li>
                  <li>✓ Oportunidades de colaboração em projetos educacionais</li>
                  <li>✓ Visibilidade para sua marca ou instituição</li>
                  <li>✓ Contribuição para o desenvolvimento educacional</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
