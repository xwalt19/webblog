import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Facebook, Twitter, Globe } from "lucide-react"; // Menggunakan ikon yang relevan

const ContactUs: React.FC = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Hubungi Kami</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Kami senang mendengar dari Anda! Jangan ragu untuk menghubungi kami melalui informasi di bawah ini.
        </p>
      </section>

      <div className="flex justify-center mb-16">
        <Card className="w-full max-w-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl font-bold mb-2">Mari Terhubung!</CardTitle>
            <CardDescription className="text-muted-foreground">
              Kami selalu terbuka untuk pertanyaan, kolaborasi, atau sekadar sapaan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center md:justify-start gap-4 p-4 bg-muted/50 rounded-md">
              <Mail className="text-primary" size={32} />
              <div>
                <h3 className="text-lg font-semibold">Email Kami</h3>
                <a href="mailto:procodecg@gmail.com" className="text-blue-600 hover:underline">
                  procodecg@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 p-4 bg-muted/50 rounded-md">
              <Facebook className="text-blue-700" size={32} />
              <div>
                <h3 className="text-lg font-semibold">Ikuti Kami di Facebook</h3>
                <a href="https://www.facebook.com/ProCodeCG" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  ProCodeCG
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 p-4 bg-muted/50 rounded-md">
              <Twitter className="text-blue-400" size={32} />
              <div>
                <h3 className="text-lg font-semibold">Sebut Kami di Twitter</h3>
                <a href="https://twitter.com/procodecg" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  @procodecg
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4 p-4 bg-muted/50 rounded-md">
              <Globe className="text-green-600" size={32} />
              <div>
                <h3 className="text-lg font-semibold">Kunjungi Website Resmi Kami</h3>
                <a href="http://www.procodecg.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  www.procodecg.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Punya Pertanyaan Lain?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Jangan ragu untuk mengirimkan pesan atau menjelajahi bagian lain dari website kami.
        </p>
        <Link to="/">
          <Button size="lg">Kembali ke Beranda</Button>
        </Link>
      </section>
    </div>
  );
};

export default ContactUs;