import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
  return (
    <section
      className="relative bg-cover bg-center py-24 md:py-36 text-white"
      style={{ backgroundImage: "url('https://source.unsplash.com/random/1600x900/?coding,learning,technology')" }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div> {/* Overlay untuk keterbacaan teks */}
      <div className="container mx-auto relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Tingkatkan Skill Coding Anda, Mulai dari Sini
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          Jelajahi kursus-kursus berkualitas tinggi dan artikel blog terbaru untuk menguasai dunia pemrograman.
        </p>
        <Link to="/courses">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
            Lihat Semua Kursus
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;