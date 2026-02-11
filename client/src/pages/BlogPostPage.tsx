import { useParams, useLocation, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [, setLocation] = useLocation();
  
  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery({ slug: slug || "" });
  const { data: allPosts } = trpc.blog.getAll.useQuery();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Post não encontrado</h1>
            <Button onClick={() => setLocation("/blog")}>
              <ArrowLeft className="mr-2" size={16} />
              Voltar para o Blog
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  // Posts relacionados (mesma categoria, excluindo o atual)
  const relatedPosts = (allPosts || [])
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);
  
  const formattedDate = post.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Não publicado';
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow py-12">
        {/* Breadcrumb */}
        <div className="container mx-auto px-6 mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary transition-colors">Início</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold line-clamp-1">{post.title}</span>
          </div>
        </div>
        
        {/* Hero do Post */}
        <div className="container mx-auto px-6 mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="inline-block bg-gradient-to-r from-[#da1069] to-[#3559AC] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider mb-4">
                {post.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-6 text-gray-600 flex-wrap">
                <span className="flex items-center gap-2">
                  <Calendar size={18} />
                  {formattedDate}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={18} />
                  {post.readTime} de leitura
                </span>
                <button className="flex items-center gap-2 ml-auto text-primary hover:text-accent transition-colors">
                  <Share2 size={18} />
                  Compartilhar
                </button>
              </div>
            </div>
            
            {/* Imagem de Destaque */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl mb-12">
              <img 
                src={post.image || "/placeholder-blog.jpg"} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Conteúdo do Post */}
            <article className="prose prose-lg max-w-none">
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
                <p className="text-xl text-gray-700 leading-relaxed mb-6 font-semibold">
                  {post.excerpt}
                </p>
                
                <div className="text-gray-700 leading-relaxed prose prose-headings:text-gray-900 prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:mb-4 prose-ul:my-4 prose-li:my-1 prose-strong:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic">
                  <ReactMarkdown>{post.content || ""}</ReactMarkdown>
                </div>
                
                {/* Autor */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#da1069] to-[#3559AC] flex items-center justify-center text-white text-2xl font-bold">
                      {post.author?.charAt(0) || "A"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{post.author}</p>
                      <p className="text-gray-600">Equipe LA. Educação</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
        
        {/* Posts Relacionados */}
        {relatedPosts.length > 0 && (
          <div className="container mx-auto px-6 py-16 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8">
                Leia Também
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map(relatedPost => (
                  <Link 
                    key={relatedPost.id} 
                    href={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <article className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={relatedPost.image || "/placeholder-blog.jpg"} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                          {relatedPost.category}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 mt-2 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* CTA de Volta ao Blog */}
        <div className="container mx-auto px-6 mt-12">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/blog">
              <Button size="lg" variant="outline" className="gap-2">
                <ArrowLeft size={18} />
                Voltar para o Blog
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
