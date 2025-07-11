import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Handshake, Building, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Partner {
  id: string;
  nameKey: string;
  logoUrl: string;
  descriptionKey: string;
  type: "corporate" | "community" | "educational";
}

const dummyPartners: Partner[] = [
  {
    id: "p1",
    nameKey: "partnersdata.dycodename",
    logoUrl: "https://via.placeholder.com/150/0000FF/FFFFFF?text=DyCode",
    descriptionKey: "partnersdata.dycodedesc",
    type: "corporate",
  },
  {
    id: "p2",
    nameKey: "partnersdata.codeintechname",
    logoUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=CodeinTech",
    descriptionKey: "partnersdata.codeintechdesc",
    type: "community",
  },
  {
    id: "p3",
    nameKey: "partnersdata.telkomuniversityname",
    logoUrl: "https://via.placeholder.com/150/00FF00/FFFFFF?text=Telkom+University",
    descriptionKey: "partnersdata.telkomuniversitydesc",
    type: "educational",
  },
  {
    id: "p4",
    nameKey: "partnersdata.itbname",
    logoUrl: "https://via.placeholder.com/150/FFFF00/000000?text=ITB",
    descriptionKey: "partnersdata.itbdesc",
    type: "educational",
  },
  {
    id: "p5",
    nameKey: "partnersdata.startupbandungname",
    logoUrl: "https://via.placeholder.com/150/FF00FF/FFFFFF?text=Startup+Bandung",
    descriptionKey: "partnersdata.startupbandungdesc",
    type: "community",
  },
];

const Partners: React.FC = () => {
  const { t } = useTranslation();

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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('ourpartnerstitle')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('ourpartnerssubtitle')}
        </p>
      </section>

      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyPartners.map((partner) => (
            <Card key={partner.id} className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="mb-4">
                {getIconForPartnerType(partner.type)}
              </div>
              <img src={partner.logoUrl} alt={t(partner.nameKey)} className="w-32 h-32 object-contain mb-4 rounded-lg" />
              <CardTitle className="text-xl mb-2">{t(partner.nameKey)}</CardTitle>
              <CardDescription className="text-muted-foreground">{t(partner.descriptionKey)}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('backtohome')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default Partners;