import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import YouTubeUpdates from "@/components/YouTubeUpdates"; // Import komponen YouTubeUpdates

const YouTubePage: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Video YouTube Kami</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Jelajahi tutorial, vlog, dan konten edukasi terbaru dari channel YouTube kami.
        </p>
      </section>

      <YouTubeUpdates />

      <div className="text-center mt-12">
        <Link to="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  );
};

export default YouTubePage;