import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Archives: React.FC = () => {
  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold mb-4">Arsip Blog</h1>
      <p className="text-xl text-muted-foreground mb-6">
        Di sini Anda akan menemukan semua postingan blog yang telah diterbitkan.
      </p>
      <Link to="/">
        <Button>Kembali ke Beranda</Button>
      </Link>
    </div>
  );
};

export default Archives;