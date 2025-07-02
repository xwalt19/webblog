import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10 text-center">
      <h1 className="text-4xl font-bold mb-4">Tentang Kami</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Pelajari lebih lanjut tentang misi, visi, dan tim di balik Blog Kurusiu.
      </p>
      <Link to="/">
        <Button>Kembali ke Home</Button>
      </Link>
    </div>
  );
};

export default AboutPage;