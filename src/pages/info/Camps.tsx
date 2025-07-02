import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Camps: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">CAMPS</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
        Informasi detail mengenai program kamp intensif kami akan segera hadir di sini.
      </p>
      <Link to="/info">
        <Button>Kembali ke Info Program</Button>
      </Link>
    </div>
  );
};

export default Camps;