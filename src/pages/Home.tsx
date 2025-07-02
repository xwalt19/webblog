import React from "react";
import HeroSection from "@/components/HeroSection";
import FeaturedCourses from "@/components/FeaturedCourses";
import LatestBlogPosts from "@/components/LatestBlogPosts";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedCourses />
      <LatestBlogPosts />
      {/* Bagian lain untuk homepage dapat ditambahkan di sini */}
    </div>
  );
};

export default Home;