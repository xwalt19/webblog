import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Info: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4 text-center">
      {/* Bagian ini dihapus sesuai permintaan */}
      {/*
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Informasi Lainnya</h1>
      <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
        Halaman ini akan berisi berbagai informasi tambahan tentang ProCodeCG.
      </p>
      */}
      <Link to="/">
        <Button size="lg">Kembali ke Beranda</Button>
      </Link>
    </div>
  );
};

export default Info;