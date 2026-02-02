import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAnalytics } from "./hooks/useAnalytics";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import CoursesPage from "./pages/CoursesPage";
import PartnerPage from "./pages/PartnerPage";
import ConsultPage from "./pages/ConsultPage";
import OmbudsmanPage from "./pages/OmbudsmanPage";
import BlogPage from "./pages/BlogPage";
import { CourseDetailsPage } from "./pages/CourseDetailsPage";
import { FAQPage } from "./pages/FAQPage";
import BlogPostPage from "./pages/BlogPostPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminAnalyticsPage from "./pages/AdminAnalyticsPage";
import AdminCoursesPage from "./pages/AdminCoursesPage";
import AdminBlogPage from "./pages/AdminBlogPage";
import AdminBannersPage from "./pages/AdminBannersPage";
import AdminCertificationsPage from "./pages/AdminCertificationsPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import AdminCourseFormPage from "./pages/AdminCourseFormPage";
import AdminBlogFormPage from "./pages/AdminBlogFormPage";
import AdminCurriculumPage from "./pages/AdminCurriculumPage";
import AdminBannerFormPage from "./pages/AdminBannerFormPage";
import AdminCertificationFormPage from "./pages/AdminCertificationFormPage";
import PartnershipPage from "./pages/PartnershipPage";
import AdminCourseCategoriesPage from "./pages/AdminCourseCategoriesPage";
import AdminCourseTypesPage from "./pages/AdminCourseTypesPage";
import AdminPartnersPage from "./pages/AdminPartnersPage";
import AdminOmbudsmanPage from "./pages/AdminOmbudsmanPage";
import AdminTestimonialsPage from "./pages/AdminTestimonialsPage";
import AdminEcosystemPage from "./pages/AdminEcosystemPage";
import AdminEcosystemEditorPage from "./pages/AdminEcosystemEditorPage";
import AdminEcosystemInstitutionPage from "./pages/AdminEcosystemInstitutionPage";

function Router() {
  // Rastreamento automático de analytics
  useAnalytics();
  
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sobre" component={AboutPage} />
      <Route path="/cursos" component={CoursesPage} />
      <Route path="/cursos/:slug" component={CourseDetailsPage} />
      <Route path="/parceiro" component={PartnerPage} />
      <Route path="/consulta" component={ConsultPage} />
      <Route path="/ouvidoria" component={OmbudsmanPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/seja-parceiro" component={PartnershipPage} />

      {/* Admin Routes */}
      <Route path="/admin-la-educacao/login" component={AdminLoginPage} />
      <Route path="/admin-la-educacao/dashboard" component={AdminDashboardPage} />
      <Route path="/admin-la-educacao/analytics" component={AdminAnalyticsPage} />
      <Route path="/admin-la-educacao/cursos" component={AdminCoursesPage} />
      <Route path="/admin-la-educacao/cursos/novo" component={AdminCourseFormPage} />
      <Route path="/admin-la-educacao/cursos/:id/grade" component={AdminCurriculumPage} />
      <Route path="/admin-la-educacao/cursos/:id" component={AdminCourseFormPage} />
      <Route path="/admin-la-educacao/blog" component={AdminBlogPage} />
      <Route path="/admin-la-educacao/blog/novo" component={AdminBlogFormPage} />
      <Route path="/admin-la-educacao/blog/:id" component={AdminBlogFormPage} />
      <Route path="/admin-la-educacao/banners" component={AdminBannersPage} />
      <Route path="/admin-la-educacao/banners/novo" component={AdminBannerFormPage} />
      <Route path="/admin-la-educacao/banners/:id" component={AdminBannerFormPage} />
      <Route path="/admin-la-educacao/certificacoes" component={AdminCertificationsPage} />
      <Route path="/admin-la-educacao/certificacoes/novo" component={AdminCertificationFormPage} />
      <Route path="/admin-la-educacao/certificacoes/:id" component={AdminCertificationFormPage} />
      <Route path="/admin-la-educacao/configuracoes" component={AdminSettingsPage} />
      <Route path="/admin-la-educacao/categorias" component={AdminCourseCategoriesPage} />
      <Route path="/admin-la-educacao/tipos" component={AdminCourseTypesPage} />
      <Route path="/admin-la-educacao/parceiros" component={AdminPartnersPage} />
      <Route path="/admin-la-educacao/ouvidoria" component={AdminOmbudsmanPage} />
      <Route path="/admin-la-educacao/depoimentos" component={AdminTestimonialsPage} />
      <Route path="/admin-la-educacao/ecossistema" component={AdminEcosystemPage} />
      <Route path="/admin-la-educacao/ecossistema/editor" component={AdminEcosystemEditorPage} />
      <Route path="/admin-la-educacao/ecossistema/:id" component={AdminEcosystemInstitutionPage} />

      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
