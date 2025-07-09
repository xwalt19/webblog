import React from "react";
import HeroSection from "@/components/HeroSection";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import WhyProCodeCG from "@/components/WhyProCodeCG";
import CallToActionSection from "@/components/CallToActionSection";
import CombinedMediaSearch from "@/components/CombinedMediaSearch"; // Import the new component
import FixedNewsSchedule from "@/components/FixedNewsSchedule";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <WhyProCodeCG />
      <LatestBlogPosts />
      <CombinedMediaSearch /> {/* Mengganti YouTubeUpdates dengan CombinedMediaSearch */}
      <FixedNewsSchedule />
      <CallToActionSection />
    </div>
  );
};

export default Home;