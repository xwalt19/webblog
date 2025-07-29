import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Facebook, MessageSquare, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import ContactForm from "@/components/ContactForm";

const ContactUs: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('contact us page title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('contact us page subtitle')}
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex flex-col items-center text-center p-6 bg-muted/30 hover:bg-muted/50 transition-colors duration-200 shadow-lg hover:shadow-xl">
            <Mail className="text-primary mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">{t('email us')}</h3>
            <a href="mailto:procodecg@gmail.com" className="text-blue-600 hover:underline text-lg">
              procodecg@gmail.com
            </a>
          </Card>

          <Card className="flex flex-col items-center text-center p-6 bg-muted/30 hover:bg-muted/50 transition-colors duration-200 shadow-lg hover:shadow-xl">
            <Facebook className="text-blue-700 mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">{t('follow us on facebook')}</h3>
            <a href="https://www.facebook.com/ProCodeCG" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-lg">
              ProCodeCG
            </a>
          </Card>

          <Card className="flex flex-col items-center text-center p-6 bg-muted/30 hover:bg-muted/50 transition-colors duration-200 shadow-lg hover:shadow-xl">
            <MessageSquare className="text-green-500 mb-4" size={48} />
            <div>
              <h3 className="text-xl font-semibold mb-2">{t('whatsapp us')}</h3>
              <a href="https://wa.me/628122015409" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-lg">
                (+62)8122015409
              </a>
            </div>
          </Card>

          <Card className="flex flex-col items-center text-center p-6 bg-muted/30 hover:bg-muted/50 transition-colors duration-200 shadow-lg hover:shadow-xl">
            <Globe className="text-green-600 mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">{t('visit our official website')}</h3>
            <a href="http://www.procodecg.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-lg">
              www.procodecg.com
            </a>
          </Card>
        </div>

        {/* Contact Form Card */}
        <Card className="w-full p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold mb-2">{t('send us a message')}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {t('send us a message subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>

      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('ready for next step')}</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t('explore more or send message')}
        </p>
        <Link to="/">
          <Button size="lg">{t('return to home')}</Button>
        </Link>
      </section>
    </div>
  );
};

export default ContactUs;