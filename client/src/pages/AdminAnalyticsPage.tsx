import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { 
  BarChart3, 
  Eye, 
  Users, 
  MousePointerClick,
  TrendingUp,
  Calendar,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function AdminAnalyticsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Buscar estatísticas reais do banco
  const { data: stats, isLoading: statsLoading } = trpc.analytics.getStats.useQuery({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  // Buscar páginas mais visitadas
  const { data: topPages, isLoading: pagesLoading } = trpc.analytics.getTopPages.useQuery({
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    limit: 5,
  });

  const statsCards = [
    {
      icon: Eye,
      label: "Total de Visualizações",
      value: stats?.totalViews?.toString() || "0",
      gradient: "from-[#D4A017] to-[#B8860B]",
      iconBg: "bg-blue-100",
      iconColor: "text-[#B8860B]"
    },
    {
      icon: Users,
      label: "Visitantes Únicos",
      value: stats?.uniqueVisitors?.toString() || "0",
      gradient: "from-green-500 to-green-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Calendar,
      label: "Páginas por Visitante",
      value: stats?.pagesPerVisitor || "0",
      gradient: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-500 rounded-2xl shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-600 bg-clip-text text-transparent">
                Analytics
              </h1>
              <p className="text-gray-600 mt-1">Monitore o desempenho do seu site</p>
            </div>
          </div>

          {/* Filtros de Data */}
          <div className="flex gap-3">
            <div className="flex flex-col">
              <label className="text-xs text-gray-600 mb-1">Data Início</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs text-gray-600 mb-1">Data Fim</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        {statsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statsCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={stat.label}
                  className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} bg-opacity-5 border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${stat.iconBg} p-4 rounded-2xl shadow-md`}>
                        <Icon className={`w-8 h-8 ${stat.iconColor}`} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Páginas Mais Visitadas */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Páginas Mais Visitadas</h2>
          <Card className="border-none shadow-lg">
            <div className="p-6">
              {pagesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                </div>
              ) : topPages && topPages.length > 0 ? (
                <div className="space-y-4">
                  {topPages.map((item, index) => (
                    <div key={item.page} className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-500 text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">{item.page}</span>
                          <span className="text-sm text-gray-600">{item.views} visualizações</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-green-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-green-600">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum dado disponível para o período selecionado</p>
                  <p className="text-sm mt-1">As visualizações começarão a ser registradas automaticamente</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Informação sobre rastreamento */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-none shadow-md">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-[#B8860B]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Rastreamento Automático</h3>
                <p className="text-sm text-gray-600">
                  O sistema está rastreando automaticamente todas as visualizações de páginas do site em tempo real. 
                  Os dados são armazenados no banco de dados e atualizados instantaneamente.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
