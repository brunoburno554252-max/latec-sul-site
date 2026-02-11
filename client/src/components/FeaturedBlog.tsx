import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Calendar, Clock, ArrowRight, Newspaper } from "lucide-react";
import { useLocation } from "wouter";

export default function FeaturedBlog() {
  const [, setLocation] = useLocation();
  const { data: posts, isLoading } = trpc.blog.getFeatured.useQuery();

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container">
          <div className="text-center">
            <p className="text-gray-600">Carregando notícias...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return null; // Don't show section if no featured posts
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-primary/5 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-accent font-bold tracking-widest text-sm uppercase mb-3 block flex items-center justify-center gap-2">
            <Newspaper className="w-5 h-5" />
            Novidades
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 mb-6 leading-tight">
            Últimas <span className="text-accent">Notícias</span> do Blog
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Fique por dentro das novidades, dicas e tendências do mundo educacional
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post: any) => (
            <article
              key={post.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              {/* Post Image */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Newspaper className="w-20 h-20 text-primary/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary font-bold text-xs rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : new Date(post.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                  </span>
                  {post.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>

                {/* Author & Read More */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Por {post.author}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-primary hover:text-accent group/btn p-0 h-auto"
                    onClick={() => setLocation(`/blog/${post.slug}`)}
                  >
                    Ler mais
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            className="bg-gradient-to-r from-[#da1069] to-[#3559AC] hover:opacity-90 text-white font-bold px-10 h-14 rounded-full shadow-xl shadow-[#3559AC]/30 transition-all hover:-translate-y-1 text-lg gap-2"
            onClick={() => setLocation("/blog")}
          >
            Ver Todas as Notícias
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
