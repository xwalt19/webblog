import React from "react";
import HeroSection from "@/components/HeroSection";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import WhyProCodeCG from "@/components/WhyProCodeCG";
import CallToActionSection from "@/components/CallToActionSection";
import MediaCarousel from "@/components/MediaCarousel"; // Mengganti CombinedMediaSearch
import FixedNewsSchedule from "@/components/FixedNewsSchedule";
import ExternalArticlesFeed from "@/components/ExternalArticlesFeed";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <WhyProCodeCG />
      <LatestBlogPosts />
      <MediaCarousel /> {/* Menggunakan komponen carousel baru */}
      <FixedNewsSchedule />
      <ExternalArticlesFeed />
      <CallToActionSection />
    </div>
  );
};

export default Home;