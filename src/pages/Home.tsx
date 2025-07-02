import React from "react";
import HeroSection from "@/components/HeroSection";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import WhyProCodeCG from "@/components/WhyProCodeCG";
import CallToActionSection from "@/components/CallToActionSection";
import FeaturedCourses from "@/components/FeaturedCourses"; // Import komponen FeaturedCourses

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <WhyProCodeCG />
      <FeaturedCourses /> {/* Komponen FeaturedCourses ditambahkan di sini */}
      <CallToActionSection />
      <LatestBlogPosts />
      {/* Bagian lain untuk homepage dapat ditambahkan di sini */}
    </div>
  );
};

export default Home;