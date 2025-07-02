import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CoursesPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10 text-center">
      <h1 className="text-4xl font-bold mb-4">Daftar Semua Kursus</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Di sini Anda akan menemukan daftar lengkap semua kursus yang kami tawarkan.
      </p>
      <Link to="/">
        <Button>Kembali ke Home</Button>
      </Link>
    </div>
  );
};

export default CoursesPage;