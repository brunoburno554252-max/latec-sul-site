import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Link } from "wouter";

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  
  const categories = ["Todas", "Educação", "Notícias"];
  
  const { data: postsFromDb } = trpc.blog.getAll.useQuery();
  
  const filteredPosts = selectedCategory === "Todas" 
    ? (postsFromDb || []) 
    : (postsFromDb || []).filter(post => post.category === selectedCategory);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-accent font-bold uppercase tracking-wider text-sm mb-2 block">Fique por dentro</span>
            <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Blog & Notícias</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Artigos, dicas de carreira e novidades sobre o universo da educação para você se manter sempre atualizado.
            </p>
            
            {/* Filtros de Categoria */}
            <div className="flex justify-center gap-3 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] text-white shadow-lg scale-105"
                      : "bg-white text-gray-600 hover:bg-gray-100 shadow"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
              <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-2 group cursor-pointer">
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={post.image || "/placeholder-blog.jpg"} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-BR') : 'Não publicado'}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <span className="inline-flex items-center text-accent font-bold hover:text-accent/80 group-hover:translate-x-2 transition-transform text-sm">
                    LER MATÉRIA COMPLETA <ArrowRight size={16} className="ml-2" />
                  </span>
                </div>
              </article>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
