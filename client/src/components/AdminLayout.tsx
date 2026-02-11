import { ReactNode, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Image,
  Award,
  Settings,
  LogOut,
  Users,
  FolderTree,
  Tag,
  MessageSquare,
  Quote,
  BarChart3,
  Network,
  Home,
} from "lucide-react";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const isLoginPage = location.includes("/admin-la-educacao/login");
    const isAdminRoute = location.includes("/admin-la-educacao");
    
    // Se não tem token e está tentando acessar área admin (exceto login), redireciona para login
    if (!token && isAdminRoute && !isLoginPage) {
      setLocation("/admin-la-educacao/login");
    }
    
    // Se tem token e está na página de login, redireciona para dashboard
    if (token && isLoginPage) {
      setLocation("/admin-la-educacao/dashboard");
    }
  }, [location, setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    toast.success("Logout realizado com sucesso");
    setLocation("/admin-la-educacao/login");
  };

  const adminUser = JSON.parse(localStorage.getItem("admin_user") || "{}");

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin-la-educacao/dashboard" },
    { icon: BarChart3, label: "Analytics", href: "/admin-la-educacao/analytics" },
    { icon: Home, label: "Home", href: "/admin-la-educacao/home" },
    { icon: FolderTree, label: "Categorias", href: "/admin-la-educacao/categorias" },
    { icon: Tag, label: "Tipos", href: "/admin-la-educacao/tipos" },
    { icon: FileText, label: "Blog", href: "/admin-la-educacao/blog" },
    { icon: Award, label: "Certificações", href: "/admin-la-educacao/certificacoes" },
    { icon: Users, label: "Parceiros", href: "/admin-la-educacao/parceiros" },
    { icon: MessageSquare, label: "Ouvidoria", href: "/admin-la-educacao/ouvidoria" },
    { icon: Quote, label: "Depoimentos", href: "/admin-la-educacao/depoimentos" },
    { icon: Settings, label: "Configurações", href: "/admin-la-educacao/configuracoes" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-pink-50/20">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-[#da1069] via-pink-900 to-pink-950 text-white shadow-2xl flex flex-col">
        {/* Header da Sidebar */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <img src="/images/logo-la-educacao.jpg" alt="LA Educação" className="w-10 h-10 rounded-lg object-contain" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">LA. Educação</h2>
              <p className="text-xs text-pink-200">Painel Administrativo</p>
            </div>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-white/15 text-white shadow-lg shadow-black/10 backdrop-blur-sm border border-white/20"
                      : "text-pink-200 hover:bg-white/10 hover:text-white hover:translate-x-1"
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-white/20" 
                      : "bg-white/5 group-hover:bg-white/10"
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Footer da Sidebar com Info do Usuário */}
        <div className="p-4 border-t border-white/10 bg-black/10 backdrop-blur-sm">
          <div className="mb-3 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-400 flex items-center justify-center font-bold text-white text-sm shadow-lg">
                {adminUser.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{adminUser.name || "Administrador"}</p>
                <p className="text-xs text-pink-300 truncate">{adminUser.email || "admin@laeducacao.com.br"}</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-pink-200 hover:bg-white/10 hover:text-white transition-all duration-200 rounded-lg"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-3" />
            <span className="font-medium text-sm">Sair do Painel</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
