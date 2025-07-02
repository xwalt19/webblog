import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactUs: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Hubungi Kami</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Kami senang mendengar dari Anda! Jangan ragu untuk menghubungi kami melalui informasi di bawah ini.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <Mail className="mx-auto mb-4 text-primary" size={48} />
            <CardTitle className="text-xl mb-2">Email</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground p-0">
            <p>info@procodecg.com</p>
            <p>support@procodecg.com</p>
          </CardContent>
        </Card>
        <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <Phone className="mx-auto mb-4 text-primary" size={48} />
            <CardTitle className="text-xl mb-2">Telepon</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground p-0">
            <p>+62 123 4567 (Kantor)</p>
            <p>+62 812 3456 7890 (WhatsApp)</p>
          </CardContent>
        </Card>
        <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <MapPin className="mx-auto mb-4 text-primary" size={48} />
            <CardTitle className="text-xl mb-2">Alamat</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground p-0">
            <p>Jl. Contoh No. 123</p>
            <p>Bandung, Jawa Barat, Indonesia</p>
          </CardContent>
        </Card>
      </div>

      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Punya Pertanyaan?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Tim kami siap membantu Anda. Kirimkan pesan kepada kami dan kami akan segera merespons.
        </p>
        <Link to="/">
          <Button size="lg">Kembali ke Beranda</Button>
        </Link>
      </section>
    </div>
  );
};

export default ContactUs;