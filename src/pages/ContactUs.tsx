import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Facebook, Twitter, Globe } from "lucide-react"; // Menggunakan ikon yang relevan

const ContactUs: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-center mb-16">
        <Card className="w-full max-w-4xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Bagian CardHeader yang berisi judul dan deskripsi dikembalikan */}
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold mb-2">Mari Terhubung!</CardTitle>
            <CardDescription className="text-muted-foreground">
              Kami selalu terbuka untuk pertanyaan, kolaborasi, atau sekadar sapaan.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Card */}
            <Card className="flex flex-col items-center text-center p-6 bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
              <Mail className="text-primary mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">Email Kami</h3>
              <a href="mailto:procodecg@gmail.com" className="text-blue-600 hover:underline text-lg">
                procodecg@gmail.com
              </a>
            </Card>

            {/* Facebook Card */}
            <Card className="flex flex-col items-center text-center p-6 bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
              <Facebook className="text-blue-700 mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">Ikuti Kami di Facebook</h3>
              <a href="https://www.facebook.com/ProCodeCG" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-lg">
                ProCodeCG
              </a>
            </Card>

            {/* Twitter Card */}
            <Card className="flex flex-col items-center text-center p-6 bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
              <Twitter className="text-blue-400 mb-4" size={48} />
              <div>
                <h3 className="text-xl font-semibold mb-2">Sebut Kami di Twitter</h3>
                <a href="https://twitter.com/procodecg" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-lg">
                  @procodecg
                </a>
              </div>
            </Card>

            {/* Official Website Card */}
            <Card className="flex flex-col items-center text-center p-6 bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
              <Globe className="text-green-600 mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">Kunjungi Website Resmi Kami</h3>
              <a href="http://www.procodecg.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-lg">
                www.procodecg.com
              </a>
            </Card>
          </CardContent>
        </Card>
      </div>

      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap untuk langkah selanjutnya?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Jelajahi lebih banyak atau kirimkan pesan kepada kami.
        </p>
        <Link to="/">
          <Button size="lg">Kembali ke Beranda</Button>
        </Link>
      </section>
    </div>
  );
};

export default ContactUs;