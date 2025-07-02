import React from "react";
import HeroSection from "@/components/HeroSection";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import WhyProCodeCG from "@/components/WhyProCodeCG";
import CallToActionSection from "@/components/CallToActionSection"; // Import komponen baru

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <WhyProCodeCG />
      <CallToActionSection /> {/* Komponen baru ditambahkan di sini */}
      <LatestBlogPosts />
      {/* Bagian lain untuk homepage dapat ditambahkan di sini */}
    </div>
  );
};

export default Home;