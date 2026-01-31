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
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      {/* Top Bar - Menor */}
      <div className="bg-primary text-white py-1 text-xs font-medium hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <span>(44) 9944-9323</span>
            <span>|</span>
            <span>Maringá - PR</span>
          </div>
          <div className="flex gap-4 items-center">
            <a href="#" className="hover:text-white/80 transition-colors">AVA do Aluno</a>
            <a href="#" className="hover:text-white/80 transition-colors">Área do Parceiro</a>
          </div>
        </div>
      </div>

      {/* Main Navigation - Menor */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Logo - Menor */}
          <Link href="/">
            <div className="cursor-pointer hover:opacity-90 transition-opacity">
              <img 
                src="/images/logo-la-educacao.jpg" 
                alt="LA. Educação" 
                className="h-14 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-5">
            {navItems.map((item) => (
              item.hasDropdown ? (
                <DropdownMenu key={item.name}>
                  <div className="flex items-center gap-1 group">
                    <Link href={item.href}>
                      <span className="text-gray-600 hover:text-primary text-sm font-medium transition-colors cursor-pointer">
                        {item.name}
                      </span>
                    </Link>
                    <DropdownMenuTrigger className="outline-none">
                      <ChevronDown size={12} className="text-gray-400 group-hover:text-primary group-hover:rotate-180 transition-all duration-300" />
                    </DropdownMenuTrigger>
                  </div>
                  <DropdownMenuContent className="border-gray-100 shadow-lg rounded-xl p-2 animate-in fade-in zoom-in-95 duration-200">
                    <Link href="/cursos">
                      <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 hover:text-primary font-medium text-sm">
                        Ver Todos os Cursos
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 hover:text-primary font-medium text-sm">Graduação EAD</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 hover:text-primary font-medium text-sm">Pós-Graduação</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 hover:text-primary font-medium text-sm">Cursos Técnicos</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-gray-50 hover:text-primary font-medium text-sm">Profissionalizantes</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link key={item.name} href={item.href}>
                  <span className="text-gray-600 hover:text-primary text-sm font-medium transition-colors cursor-pointer relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:transition-all hover:after:w-full">
                    {item.name}
                  </span>
                </Link>
              )
            ))}
          </nav>

          {/* CTA Button - Menor */}
          <div className="hidden xl:block">
            <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white text-sm font-bold shadow-lg shadow-primary/20 rounded-full px-6 py-2 h-9 transition-all hover:scale-105">
              SEJA UM PARCEIRO
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="xl:hidden text-gray-600 hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-gray-100 absolute w-full h-[calc(100vh-70px)] z-50 overflow-y-auto animate-in slide-in-from-top-5 duration-300">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <span className="text-base font-medium text-gray-600 hover:text-primary block border-b border-gray-50 pb-3" onClick={() => setIsMobileMenuOpen(false)}>
                  {item.name}
                </span>
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5 h-10 rounded-xl font-bold text-sm">
                Área do Aluno
              </Button>
              <Button className="w-full bg-gradient-to-r from-primary to-accent text-white h-10 rounded-xl font-bold text-sm shadow-lg shadow-primary/20">
                SEJA UM PARCEIRO
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
