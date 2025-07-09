import React from "react";
import HeroSection from "@/components/HeroSection";
import LatestBlogPosts from "@/components/LatestBlogPosts";
import WhyProCodeCG from "@/components/WhyProCodeCG";
import CallToActionSection from "@/components/CallToActionSection";
import YouTubeUpdates from "@/components/YouTubeUpdates"; // Import komponen baru
import WordPressUpdates from "@/components/WordPressUpdates"; // Import komponen baru
import FixedNewsSchedule from "@/components/FixedNewsSchedule"; // Import komponen baru

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <WhyProCodeCG />
      <LatestBlogPosts />
      <YouTubeUpdates /> {/* Tambahkan komponen YouTube Updates */}
      <WordPressUpdates /> {/* Tambahkan komponen WordPress Updates */}
      <FixedNewsSchedule /> {/* Tambahkan komponen Fixed News & Schedule */}
      <CallToActionSection />
    </div>
  );
};

export default Home;