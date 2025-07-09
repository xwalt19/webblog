import React from "react";
import HeroSection from "@/components/HeroSection";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import WhyProCodeCG from "@/components/WhyProCodeCG";
import CallToActionSection from "@/components/CallToActionSection";
// import YouTubeUpdates from "@/components/YouTubeUpdates"; // Import komponen baru (dihapus)
import FixedNewsSchedule from "@/components/FixedNewsSchedule"; // Import komponen baru

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <WhyProCodeCG />
      <LatestBlogPosts />
      {/* <YouTubeUpdates /> */} {/* Komponen YouTube Updates dihapus dari sini */}
      <FixedNewsSchedule />
      <CallToActionSection />
    </div>
  );
};

export default Home;