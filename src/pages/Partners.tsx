import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Handshake, Building, Users } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  type: "corporate" | "community" | "educational";
}

const dummyPartners: Partner[] = [
  {
    id: "p1",
    name: "DyCode",
    logoUrl: "https://via.placeholder.com/150/0000FF/FFFFFF?text=DyCode",
    description: "Perusahaan teknologi terkemuka yang berfokus pada pengembangan perangkat lunak dan solusi digital.",
    type: "corporate",
  },
  {
    id: "p2",
    name: "CodeinTech",
    logoUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=CodeinTech",
    description: "Komunitas pengembang yang aktif dalam berbagi pengetahuan dan mengadakan workshop coding.",
    type: "community",
  },
  {
    id: "p3",
    name: "Telkom University",
    logoUrl: "https://via.placeholder.com/150/00FF00/FFFFFF?text=Telkom+University",
    description: "Institusi pendidikan tinggi yang berkolaborasi dalam program pelatihan dan pengembangan kurikulum.",
    type: "educational",
  },
  {
    id: "p4",
    name: "ITB (Institut Teknologi Bandung)",
    logoUrl: "https://via.placeholder.com/150/FFFF00/000000?text=ITB",
    description: "Salah satu universitas teknik terbaik di Indonesia, mitra dalam penelitian dan pengembangan.",
    type: "educational",
  },
  {
    id: "p5",
    name: "Startup Bandung",
    logoUrl: "https://via.placeholder.com/150/FF00FF/FFFFFF?text=Startup+Bandung",
    description: "Jaringan startup lokal yang mendukung inovasi dan ekosistem teknologi di Bandung.",
    type: "community",
  },
];

const Partners: React.FC = () => {
  const getIconForPartnerType = (type: Partner['type']) => {
    switch (type) {
      case "corporate":
        return <Building className="text-blue-500" size={32} />;
      case "community":
        return <Users className="text-green-500" size={32} />;
      case "educational":
        return <Handshake className="text-purple-500" size={32} />;
      default:
        return <Handshake className="text-gray-500" size={32} />;
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Mitra Kami</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Kami bangga bekerja sama dengan berbagai organisasi dan institusi untuk mencapai misi kami.
        </p>
      </section>

      <section className="mb-16">
        {/* <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Kolaborasi Kami</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyPartners.map((partner) => (
            <Card key={partner.id} className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-4">
                {getIconForPartnerType(partner.type)}
              </div>
              <img src={partner.logoUrl} alt={partner.name} className="w-32 h-32 object-contain mb-4 rounded-lg" />
              <CardTitle className="text-xl mb-2">{partner.name}</CardTitle>
              <CardDescription className="text-muted-foreground">{partner.description}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      <div className="text-center mt-12">
        <Link to="/">
          <Button>Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  );
};

export default Partners;