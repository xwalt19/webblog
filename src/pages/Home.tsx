import React from "react";
import HeroSection from "@/components/HeroSection";
import FeaturedCourses from "@/components/FeaturedCourses"; // Diaktifkan kembali
import LatestBlogPosts from "@/components/LatestBlogPosts";
import WhyProCodeCG from "@/components/WhyProCodeCG"; // Import komponen baru

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedCourses /> {/* Ditampilkan kembali */}
      <WhyProCodeCG /> {/* Komponen baru */}
      <LatestBlogPosts />
      {/* Bagian lain untuk homepage dapat ditambahkan di sini */}
    </div>
  );
};

export default Home;