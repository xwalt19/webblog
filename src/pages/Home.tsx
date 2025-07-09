import React from "react";
import HeroSection from "@/components/HeroSection";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import WhyProCodeCG from "@/components/WhyProCodeCG";
import CallToActionSection from "@/components/CallToActionSection";
import CombinedMediaSearch from "@/components/CombinedMediaSearch";
import FixedNewsSchedule from "@/components/FixedNewsSchedule";
import ExternalArticlesFeed from "@/components/ExternalArticlesFeed"; // Import the new component

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <WhyProCodeCG />
      <LatestBlogPosts />
      <CombinedMediaSearch />
      <FixedNewsSchedule />
      <ExternalArticlesFeed /> {/* Menambahkan komponen baru di sini */}
      <CallToActionSection />
    </div>
  );
};

export default Home;