import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lightbulb, Users, Handshake, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { dummyTeamMembers, TeamMember } from "@/data/teamMembers";

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('about procodecg title')}</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('about procodecg subtitle')}
        </p>
      </section>

      <section className="mb-16 prose dark:prose-invert max-w-none mx-auto">
        <p className="text-lg text-muted-foreground mb-4">
          <span className="inline-flex items-center gap-2 font-semibold text-foreground mb-2">
            <MapPin className="h-6 w-6 text-primary" /> {t('headquarter label')}: {t('bandung indonesia')}
          </span>
          <br />
          ProCodeCG adalah startup yang berbasis di Bandung yang bergerak di bidang teknologi, khususnya literasi pemrograman dan coding. Kami senang membantu anak-anak membangun dan mengembangkan keterampilan mereka di lingkungan IT, karena kami menyadari bahwa anak-anak adalah investasi paling berharga dalam memenuhi kebutuhan sumber daya manusia. Kami membantu industri masa depan dengan membentuk keterampilan anak-anak sedini mungkin untuk memenuhi persyaratan lanskap industri teknologi, karena perubahan teknologi yang cepat di seluruh dunia.
        </p>
        <p className="text-lg text-muted-foreground mb-4">
          Tidak hanya untuk anak-anak, kami juga membantu lingkungan industri kreatif dengan membangun komunitas bernama Code Meet Up. Komunitas ini terdiri dari orang-orang kreatif dengan pengetahuan lintas bidang yang peduli terhadap teknologi dan bisnis. Kami berkumpul, berbagi, berkolaborasi, dan menciptakan sesuatu yang luar biasa bersama orang-orang super kreatif lainnya seperti Anda. Dan bagian terbaiknya, ini gratis. Jika Anda adalah orang yang berpikiran terbuka, kreatif, dan bersemangat, datang dan bergabunglah dengan kami di komunitas Code Meet Up.
        </p>
        <p className="text-lg text-muted-foreground">
          Kami sangat bangga menggabungkan talenta terbaik dari berbagai disiplin ilmu dan menyatukan orang-orang dengan satu arahan sederhana: berkolaborasi dan berkreasi.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <Lightbulb className="text-yellow-500" size={28} /> {t('our mission')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('our mission description')}
            </p>
          </CardContent>
        </Card>
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <Users className="text-blue-500" size={28} /> {t('our vision')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('our vision description')}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{t('our team')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyTeamMembers.map((member, index) => (
            <Card key={index} className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={member.avatarUrl} alt={t(member.nameKey)} />
                <AvatarFallback>{t(member.nameKey).split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl mb-1">{t(member.nameKey)}</CardTitle>
              <p className="text-sm text-primary mb-3">{t(member.roleKey)}</p>
              <CardContent className="text-muted-foreground p-0">
                {t(member.descriptionKey)}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-16" />

      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('ready to start learning journey')}</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t('explore latest insights from blog')}
        </p>
        <div className="flex justify-center">
          <Link to="/blog">
            <Button size="lg">{t('visit blog button')}</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;