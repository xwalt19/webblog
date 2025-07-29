import React from "react";
import HeroSection from "@/components/HeroSection";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import WhyProCodeCG from "@/components/WhyProCodeCG";
import CallToActionSection from "@/components/CallToActionSection";
import MediaCarousel from "@/components/MediaCarousel";
import FixedNewsSchedule from "@/components/FixedNewsSchedule";
import FeaturedCourses from "@/components/FeaturedCourses";
// import SimpleExternalArticlesDisplay from "@/components/SimpleExternalArticlesDisplay"; // Menghapus import

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <WhyProCodeCG />
      <LatestBlogPosts />
      <MediaCarousel />
      <FixedNewsSchedule />
      <FeaturedCourses />
      
      <CallToActionSection />
    </div>
  );
};

export default Home;