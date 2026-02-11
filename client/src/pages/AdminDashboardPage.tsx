import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Image, Award, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboardPage() {
  const stats = [
    { 
      icon: BookOpen, 
      label: "Cursos", 
      value: "12", 
      gradient: "from-[#3559AC] to-[#2a468a]",
      bgGradient: "from-blue-50 to-blue-100/50",
      iconBg: "bg-[#3559AC]",
      change: "+2 este mês",
      changePositive: true
    },
    { 
      icon: FileText, 
      label: "Posts no Blog", 
      value: "9", 
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-100/50",
      iconBg: "bg-green-500",
      change: "+3 esta semana",
      changePositive: true
    },
    { 
      icon: Image, 
      label: "Banners Ativos", 
      value: "3", 
      gradient: "from-pink-500 to-pink-600",
      bgGradient: "from-pink-50 to-pink-100/50",
      iconBg: "bg-pink-500",
      change: "Atualizado hoje",
      changePositive: true
    },
    { 
      icon: Award, 
      label: "Certificações", 
      value: "6", 
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100/50",
      iconBg: "bg-orange-500",
      change: "Todas ativas",
      changePositive: true
    },
  ];

  const quickActions = [
    {
      icon: BookOpen,
      title: "Gerenciar Cursos",
      description: "Adicionar, editar ou remover cursos do catálogo",
      href: "/admin-la-educacao/cursos",
      gradient: "from-[#3559AC] to-[#2a468a]",
      iconBg: "bg-[#3559AC]"
    },
    {
      icon: FileText,
      title: "Gerenciar Blog",
      description: "Criar e editar posts, notícias e artigos",
      href: "/admin-la-educacao/blog",
      gradient: "from-green-500 to-emerald-600",
      iconBg: "bg-green-500"
    },
    {
      icon: Image,
      title: "Gerenciar Banners",
      description: "Atualizar banners e imagens da homepage",
      href: "/admin-la-educacao/banners",
      gradient: "from-pink-500 to-pink-600",
      iconBg: "bg-pink-500"
    },
    {
      icon: Award,
      title: "Certificações",
      description: "Gerenciar selos e certificações institucionais",
      href: "/admin-la-educacao/certificacoes",
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-500"
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#da1069] to-[#3559AC] bg-clip-text text-transparent">
                Dashboard
              </h1>
              <Sparkles className="w-6 h-6 text-pink-500" />
            </div>
            <p className="text-gray-600 text-lg">Bem-vindo ao painel administrativo da LA. Educação</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Última atualização</p>
            <p className="text-sm font-semibold text-gray-900">{new Date().toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.label} 
                className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                {/* Gradiente de fundo sutil */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}></div>
                
                <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    {stat.label}
                  </CardTitle>
                  <div className={`${stat.iconBg} p-3 rounded-xl shadow-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="flex items-end justify-between">
                    <div className="text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    {stat.changePositive && (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-2 font-medium">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Ações Rápidas</h2>
            <div className="h-1 flex-1 bg-gradient-to-r from-[#da1069] via-pink-500 to-transparent rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}>
                  <a className="group block">
                    <Card className="border-0 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Ícone */}
                          <div className={`${action.iconBg} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="w-7 h-7 text-white" />
                          </div>
                          
                          {/* Conteúdo */}
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#da1069] transition-colors">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {action.description}
                            </p>
                          </div>
                          
                          {/* Arrow */}
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#da1069] group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#3559AC] rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Cursos Populares</h3>
              </div>
              <p className="text-sm text-gray-600">
                Técnico em Prótese Dentária e Direito são os mais acessados
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-100/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Últimas Publicações</h3>
              </div>
              <p className="text-sm text-gray-600">
                3 novos posts publicados esta semana
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md bg-gradient-to-br from-pink-50 to-pink-100/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Certificações</h3>
              </div>
              <p className="text-sm text-gray-600">
                Todas as certificações estão ativas e atualizadas
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
