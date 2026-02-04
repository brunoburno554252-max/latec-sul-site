import { useState } from "react";
import { Link } from "wouter";
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

  const navItems = [
    { name: "Início", href: "/", hasDropdown: false },
    { name: "Sobre Nós", href: "/sobre", hasDropdown: false },
    { name: "Cursos", href: "/cursos", hasDropdown: true },
    { name: "Consulta", href: "/consulta", hasDropdown: false },
    { name: "Blog", href: "/blog", hasDropdown: false },
    { name: "Seja um Parceiro", href: "/parceiro", hasDropdown: false },
    { name: "Ouvidoria", href: "/ouvidoria", hasDropdown: false },
    { name: "FAQ", href: "/faq", hasDropdown: false },
  ];

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-md border-b border-gray-100">
      {/* Top Bar - Aumentada de py-1 para py-2.5 e text-xs para text-sm */}
      <div className="bg-primary text-white py-2.5 text-sm font-semibold hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <span className="flex items-center gap-2">
              <span className="opacity-80">Telefone:</span> (44) 9944-9323
            </span>
            <span className="opacity-40">|</span>
            <span className="flex items-center gap-2">
              <span className="opacity-80">Local:</span> Maringá - PR
            </span>
          </div>
          <div className="flex gap-8 items-center">
            <a href="#" className="hover:text-white/80 transition-colors">AVA do Aluno</a>
            <a href="#" className="hover:text-white/80 transition-colors">Área do Parceiro</a>
          </div>
        </div>
      </div>

      {/* Main Navigation - Aumentada de py-2 para py-4 */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo - Aumentado de h-14 para h-20 */}
          <Link href="/">
            <div className="cursor-pointer hover:opacity-90 transition-opacity">
              <img 
                src="/images/logo-la-educacao.jpg" 
                alt="LA. Educação" 
                className="h-20 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation - Aumentada gap-5 para gap-7 e text-sm para text-base */}
          <nav className="hidden xl:flex items-center gap-7">
            {navItems.map((item) => (
              item.hasDropdown ? (
                <DropdownMenu key={item.name}>
                  <div className="flex items-center gap-1.5 group">
                    <Link href={item.href}>
                      <span className="text-gray-700 hover:text-primary text-base font-bold transition-colors cursor-pointer">
                        {item.name}
                      </span>
                    </Link>
                    <DropdownMenuTrigger className="outline-none">
                      <ChevronDown size={16} className="text-gray-400 group-hover:text-primary group-hover:rotate-180 transition-all duration-300" />
                    </DropdownMenuTrigger>
                  </div>
                  <DropdownMenuContent className="border-gray-100 shadow-xl rounded-xl p-3 animate-in fade-in zoom-in-95 duration-200 min-w-[200px]">
                    <Link href="/cursos">
                      <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 hover:text-primary font-bold text-base p-2.5">
                        Ver Todos os Cursos
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 hover:text-primary font-semibold text-base p-2.5 border-t border-gray-50 mt-1">Graduação EAD</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 hover:text-primary font-semibold text-base p-2.5">Pós-Graduação</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 hover:text-primary font-semibold text-base p-2.5">Cursos Técnicos</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 hover:text-primary font-semibold text-base p-2.5">Profissionalizantes</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link key={item.name} href={item.href}>
                  <span className="text-gray-700 hover:text-primary text-base font-bold transition-colors cursor-pointer relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary after:left-0 after:-bottom-1.5 after:transition-all hover:after:w-full">
                    {item.name}
                  </span>
                </Link>
              )
            ))}
          </nav>

          {/* CTA Button - Aumentado de h-9 para h-12 e text-sm para text-base */}
          <div className="hidden xl:block">
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white text-base font-extrabold shadow-xl shadow-primary/20 rounded-full px-8 py-3 h-12 transition-all hover:scale-105 uppercase tracking-wider">
              SEJA UM PARCEIRO
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="xl:hidden text-gray-700 hover:text-primary transition-colors p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-gray-100 absolute w-full h-[calc(100vh-70px)] z-50 overflow-y-auto animate-in slide-in-from-top-5 duration-300">
          <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <span className="text-lg font-bold text-gray-700 hover:text-primary block border-b border-gray-50 pb-4" onClick={() => setIsMobileMenuOpen(false)}>
                  {item.name}
                </span>
              </Link>
            ))}
            <div className="mt-6 flex flex-col gap-4">
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5 h-14 rounded-xl font-extrabold text-base">
                Área do Aluno
              </Button>
              <Button className="w-full bg-gradient-to-r from-primary to-accent text-white h-14 rounded-xl font-extrabold text-base shadow-xl shadow-primary/20">
                SEJA UM PARCEIRO
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
