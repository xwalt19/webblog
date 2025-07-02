import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BlogPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10 text-center">
      <h1 className="text-4xl font-bold mb-4">Artikel & Tutorial</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Jelajahi semua postingan blog kami, filter berdasarkan kategori dan tahun.
      </p>
      {/* Placeholder untuk filter dan grid postingan blog akan ditambahkan di sini */}
      <Link to="/">
        <Button>Kembali ke Home</Button>
      </Link>
    </div>
  );
};

export default BlogPage;