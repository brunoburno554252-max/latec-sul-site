import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

// Custom WhatsApp Icon component since it's not in the standard lucide-react import used above
const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </svg>
);

export default function Footer() {
  const { data: settingsData } = trpc.settings.getAll.useQuery();
  
  const settings = settingsData ? Object.fromEntries(
    settingsData.map((s: any) => [s.key, s.value])
  ) : {};

  const phone = settings.phone || "(44) 9944-9323";
  const email = settings.email || "contato@latecsul.com.br";
  const address = settings.address || "Sede Administrativa - Maringá/PR";
  const facebook = settings.facebook || "https://www.facebook.com/laeducacao.oficial/";
  const instagram = settings.instagram || "https://www.instagram.com/laeducacao.oficial/";
  const youtube = settings.youtube || "https://www.youtube.com/channel/UCwNlniwYjILixId5t7bii7g";
  const linkedin = settings.linkedin || "";
  const twitter = settings.twitter || "";
  const description = settings.description || "Liderando a revolução da educação à distância no Brasil. Conectando instituições a empreendedores e alunos ao conhecimento.";

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        {/* Main Footer Content - Centered Layout */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-12">
            {/* Brand Column - 3 cols */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-3 mb-5">
                <img 
                  src="/images/logo-la-educacao.png" 
                  alt="LA. Educação" 
                  className="h-16 w-auto object-contain bg-white rounded-lg p-1"
                />
              </div>
              <p className="text-gray-400 mb-5 leading-relaxed text-sm">
                {description}
              </p>
              <div className="flex gap-3">
                {instagram && (
                  <a href={instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] hover:text-white transition-all hover:scale-110">
                    <Instagram size={16} />
                  </a>
                )}
                {facebook && (
                  <a href={facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] hover:text-white transition-all hover:scale-110">
                    <Facebook size={16} />
                  </a>
                )}
                {youtube && (
                  <a href={youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] hover:text-white transition-all hover:scale-110">
                    <Youtube size={16} />
                  </a>
                )}
                {linkedin && (
                  <a href={linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] hover:text-white transition-all hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links - 2 cols */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-heading font-bold mb-5 text-white inline-block relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] after:rounded-full">Institucional</h3>
              <ul className="space-y-2.5">
                <li><a href="/sobre" className="text-gray-400 hover:text-accent transition-colors flex items-center gap-2 text-sm"><span className="w-1 h-1 rounded-full bg-gray-600"></span>Sobre Nós</a></li>
                <li><a href="/parceiro" className="text-gray-400 hover:text-accent transition-colors flex items-center gap-2 text-sm"><span className="w-1 h-1 rounded-full bg-gray-600"></span>Seja um Parceiro</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-accent transition-colors flex items-center gap-2 text-sm"><span className="w-1 h-1 rounded-full bg-gray-600"></span>Blog e Notícias</a></li>
                <li><a href="/faq" className="text-gray-400 hover:text-accent transition-colors flex items-center gap-2 text-sm"><span className="w-1 h-1 rounded-full bg-gray-600"></span>Perguntas Frequentes</a></li>
                {/* Adicionado Trabalhe Conosco conforme solicitado */}
                <li><a href="#" className="text-gray-400 hover:text-accent transition-colors flex items-center gap-2 text-sm"><span className="w-1 h-1 rounded-full bg-gray-600"></span>Trabalhe Conosco</a></li>
                <li><a href="#" className="text-gray-400 hover:text-accent transition-colors flex items-center gap-2 text-sm"><span className="w-1 h-1 rounded-full bg-gray-600"></span>Política de Privacidade</a></li>
              </ul>
            </div>

            {/* Contact Info - 2 cols */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-heading font-bold mb-5 text-white inline-block relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] after:rounded-full">Fale Conosco</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-gray-400 group">
                  <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] group-hover:text-white transition-colors">
                    <MapPin size={14} />
                  </div>
                  <span className="text-xs leading-relaxed whitespace-pre-line">{address}</span>
                </li>
                <li className="flex items-center gap-2.5 text-gray-400 group">
                  <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] group-hover:text-white transition-colors">
                    <Phone size={14} />
                  </div>
                  <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-xs hover:text-accent transition-colors">{phone}</a>
                </li>
                <li className="flex items-center gap-2.5 text-gray-400 group">
                  <div className="w-7 h-7 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 group-hover:bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] group-hover:text-white transition-colors">
                    <Mail size={14} />
                  </div>
                  <a href={`mailto:${email}`} className="text-xs hover:text-accent transition-colors">{email}</a>
                </li>
              </ul>
            </div>

            {/* Newsletter - 3 cols */}
            <div className="lg:col-span-3">
              <h3 className="text-sm font-heading font-bold mb-5 text-white inline-block relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-0.5 after:bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] after:rounded-full">Newsletter</h3>
              <p className="text-gray-400 mb-3 text-xs leading-relaxed">
                Receba novidades sobre cursos e promoções.
              </p>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary text-sm h-9"
                />
                <Button className="bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] hover:from-[#146B2F] hover:to-[#B8860B]/90 text-white shrink-0 h-9 px-3 text-sm">
                  Inscrever
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Ao se inscrever, você concorda com nossa Política de Privacidade.
              </p>
            </div>

            {/* e-MEC QR Code - 2 cols */}
            <div className="lg:col-span-2 flex justify-center lg:justify-end">
              <a 
                href="https://emec.mec.gov.br/emec/consulta-cadastro/detalhamento/d96957f455f6405d14c6542552b0f6eb/MjY1OTE=" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center"
              >
                {/* QR Code com moldura e logo do MEC */}
                <div className="relative bg-white rounded-xl p-2.5 shadow-lg group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105">
                  {/* Logo e-MEC no topo */}
                  <div className="mb-1.5 flex justify-center">
                    <img 
                      src="/images/logo-emec.png" 
                      alt="e-MEC" 
                      className="h-5 object-contain"
                    />
                  </div>
                  {/* QR Code */}
                  <img 
                    src="/images/qr-emec-new.png" 
                    alt="QR Code e-MEC" 
                    className="w-24 h-24 object-contain"
                  />
                  {/* Texto abaixo do QR */}
                  <div className="mt-1.5 text-center">
                    <p className="text-gray-700 text-[9px] font-medium">Consulte nosso</p>
                    <p className="text-gray-700 text-[9px] font-medium">credenciamento</p>
                  </div>
                </div>
                {/* Badge de verificação */}
                <div className="mt-2 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-500 text-[10px] font-semibold">Instituição Credenciada</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-800">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} LA. Educação. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-accent transition-colors">Política de Privacidade</a>
              <a href="#" className="text-gray-500 hover:text-accent transition-colors">Termos de Uso</a>
              <a href="#" className="text-gray-500 hover:text-accent transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
