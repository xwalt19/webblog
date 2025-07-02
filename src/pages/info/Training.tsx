import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Training: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">TRAINING</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
        Informasi detail mengenai pelatihan khusus untuk individu dan korporasi akan segera hadir di sini.
      </p>
      <Link to="/info">
        <Button>Kembali ke Info Program</Button>
      </Link>
    </div>
  );
};

export default Training;