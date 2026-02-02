import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CourseList from "@/components/CourseList";
import About from "@/components/About";
import ExclusiveSupport from "@/components/ExclusiveSupport";
import Certifications from "@/components/Certifications";
import Ecosystem from "@/components/Ecosystem";
import FeaturedBlog from "@/components/FeaturedBlog";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <Hero />
        <Certifications />
        <About />
        <ExclusiveSupport />
        <Ecosystem />
        <CourseList />
        <TestimonialsSection />
        <FeaturedBlog />
        
        {/* Floating WhatsApp Button */}
        <a 
          href="https://wa.me/554499449323" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg shadow-green-500/30 transition-all hover:scale-110 animate-in fade-in zoom-in duration-500 group"
          aria-label="Fale conosco no WhatsApp"
        >
          <MessageCircle size={32} fill="white" className="group-hover:animate-pulse" />
          <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Fale Conosco
          </span>
        </a>
      </main>

      <Footer />
    </div>
  );
}
