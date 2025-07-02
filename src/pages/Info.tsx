import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Tent, Award } from "lucide-react";

const InfoPage: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Informasi Program Kami</h1>
      <p className="text-lg text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
        Temukan berbagai program dan kegiatan yang kami tawarkan untuk mengembangkan potensi Anda di dunia teknologi.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link to="/info/regular-events-classes" className="block">
          <Card className="h-full flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CalendarDays className="mx-auto mb-4 text-primary" size={48} />
              <CardTitle className="text-xl mb-2">REGULAR EVENTS & CLASSES</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground p-0 flex-grow">
              Jadwal rutin kelas dan acara mingguan kami.
            </CardContent>
          </Card>
        </Link>

        <Link to="/info/camps" className="block">
          <Card className="h-full flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <Tent className="mx-auto mb-4 text-green-500" size={48} />
              <CardTitle className="text-xl mb-2">CAMPS</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground p-0 flex-grow">
              Program intensif liburan sekolah dan akhir pekan.
            </CardContent>
          </Card>
        </Link>

        <Link to="/info/training" className="block">
          <Card className="h-full flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <Award className="mx-auto mb-4 text-purple-500" size={48} />
              <CardTitle className="text-xl mb-2">TRAINING</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground p-0 flex-grow">
              Pelatihan khusus untuk individu dan korporasi.
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default InfoPage;