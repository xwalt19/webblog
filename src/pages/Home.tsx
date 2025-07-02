import React from "react";
import LatestBlogPosts from "@/components/LatestBlogPosts"; // Ini sekarang adalah Blog Feed utama

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section (Text-based) */}
      <section className="py-16 md:py-24 bg-background text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-primary">
            Catatan Perjalanan Belajar Coding Kami
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-muted-foreground">
            Jelajahi dokumentasi mendalam dari setiap sesi kursus kami, mulai dari teori dasar hingga proyek akhir yang menantang. Ikuti progres kami dan temukan inspirasi untuk perjalanan coding Anda sendiri.
          </p>
        </div>
      </section>

      {/* Blog Feed Section */}
      <LatestBlogPosts />
    </div>
  );
};

export default Home;