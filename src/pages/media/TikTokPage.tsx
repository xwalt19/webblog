import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TikTokUpdates from "@/components/TikTokUpdates"; // Import komponen TikTokUpdates

const TikTokPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Koleksi Video TikTok Kami</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Temukan video singkat, tips coding, dan keseruan di balik layar dari profil TikTok kami.
        </p>
      </section>

      <TikTokUpdates />

      <div className="text-center mt-12">
        <Link to="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  );
};

export default TikTokPage;