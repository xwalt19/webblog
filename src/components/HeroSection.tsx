import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section
      className="relative bg-cover bg-center py-24 md:py-36 text-white"
      style={{ backgroundImage: "url('/images/hero-background.jpg')" }} // Menggunakan gambar lokal dari folder public
    >
      <div className="absolute inset-0 bg-black opacity-60"></div> {/* Overlay untuk keterbacaan teks */}
      <div className="container mx-auto relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Belajar Teknologi, Wujudkan Inovasi
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          Temukan cerita seru dan tips coding di blog kami, yuk jadi jagoan IT masa depan
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/blog">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
              Kunjungi Blog Kami
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;