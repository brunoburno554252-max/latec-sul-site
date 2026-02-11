import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { data: settingsData } = trpc.settings.getAll.useQuery();
  const settings = settingsData ? Object.fromEntries(
    settingsData.map((s: any) => [s.key, s.value])
  ) : {};
  
  const location = settings.location || "Maringá - PR";
  const phone = settings.phone || "(44) 9944-9323";

  const navItems = [
    { name: "Início", href: "/", hasDropdown: false },
    { name: "Sobre Nós", href: "/sobre", hasDropdown: false },
    { name: "Cursos", href: "/cursos", hasDropdown: true },
    { name: "Consulte Nossos Parceiros", href: "/consulta", hasDropdown: false },
    { name: "Blog", href: "/blog", hasDropdown: false },
    { name: "Seja um Parceiro", href: "/parceiro", hasDropdown: false },
    { name: "Ouvidoria", href: "/ouvidoria", hasDropdown: false },
    { name: "Validação e Rastreio", href: "/rastreio-certificado", hasDropdown: false },
    { name: "FAQ", href: "/faq", hasDropdown: false },
  ];

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      {/* Top Bar - Ajustado espaçamento do WhatsApp */}
      <div className="bg-gradient-to-r from-[#da1069] to-[#3559AC] text-white py-2 text-sm font-medium hidden md:block">
        <div className="w-full px-8 lg:px-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-bold">Central de Atendimento:</span>
            <a 
              href="https://wa.me/554499449323" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#25D366]">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>{phone}</span>
            </a>
            <span className="opacity-40">|</span>
            <span>{location}</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:opacity-80 transition-opacity">AVA do Aluno</a>
            <a href="#" className="hover:opacity-80 transition-opacity">Área do Parceiro</a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="w-full px-8 lg:px-16 py-3">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="cursor-pointer hover:opacity-90 transition-opacity">
              <img 
                src="/images/logo-la-educacao.jpg" 
                alt="LA. Educação" 
                className="h-16 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6">
            {navItems.map((item) => (
              item.hasDropdown ? (
                <DropdownMenu key={item.name}>
                  <div className="flex items-center gap-1 group">
                    <Link href={item.href}>
                      <span className="text-gray-600 hover:text-primary font-medium transition-colors cursor-pointer">
                        {item.name}
                      </span>
                    </Link>
                    <DropdownMenuTrigger className="outline-none">
                      <ChevronDown size={14} className="text-gray-400 group-hover:text-primary group-hover:rotate-180 transition-all duration-300" />
                    </DropdownMenuTrigger>
                  </div>
                  <DropdownMenuContent className="border-gray-100 shadow-lg rounded-xl p-2 animate-in fade-in zoom-in-95 duration-200 min-w-[180px]">
                    <Link href="/cursos">
                      <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 hover:text-primary font-medium p-2">
                        Ver Todos os Cursos
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 hover:text-primary font-medium p-2">Graduação EAD</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 hover:text-primary font-medium p-2">Pós-Graduação</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 hover:text-primary font-medium p-2">Cursos Técnicos</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 hover:text-primary font-medium p-2">Profissionalizantes</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link key={item.name} href={item.href}>
                  <span className="text-gray-600 hover:text-primary font-medium transition-colors cursor-pointer relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gradient-to-r from-[#da1069] to-[#3559AC] after:left-0 after:-bottom-1 after:transition-all hover:after:w-full">
                    {item.name}
                  </span>
                </Link>
              )
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden xl:block">
            <Button className="bg-gradient-to-r from-[#da1069] to-[#3559AC] hover:opacity-90 text-white font-bold shadow-lg shadow-[#3559AC]/30 rounded-full px-8 py-2 h-10 transition-all hover:scale-105">
              SEJA UM PARCEIRO
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="xl:hidden text-gray-600 hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-gray-100 absolute w-full h-[calc(100vh-80px)] z-50 overflow-y-auto animate-in slide-in-from-top-5 duration-300">
          <div className="container mx-auto px-6 py-8 flex flex-col gap-6">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <span className="text-lg font-medium text-gray-600 hover:text-primary block border-b border-gray-50 pb-4" onClick={() => setIsMobileMenuOpen(false)}>
                  {item.name}
                </span>
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-4">
              <Button variant="outline" className="w-full border-primary text-primary hover:from-[#c4105e] hover:to-[#2a468a]/5 h-12 rounded-xl font-bold">
                Área do Aluno
              </Button>
              <Button className="w-full bg-gradient-to-r from-[#da1069] to-[#3559AC] text-white h-12 rounded-xl font-bold shadow-lg shadow-[#3559AC]/30">
                SEJA UM PARCEIRO
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
