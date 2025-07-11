import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Lightbulb, Users, Handshake } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TeamMember {
  nameKey: string;
  roleKey: string;
  avatarUrl: string;
  descriptionKey: string;
}

const dummyTeamMembers: TeamMember[] = [
  {
    nameKey: "team_members.marisa_name",
    roleKey: "team_members.marisa_role",
    avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Marisa",
    descriptionKey: "team_members.marisa_desc",
  },
  {
    nameKey: "team_members.budi_name",
    roleKey: "team_members.budi_role",
    avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Budi",
    descriptionKey: "team_members.budi_desc",
  },
  {
    nameKey: "team_members.prayudi_name",
    roleKey: "team_members.prayudi_role",
    avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Prayudi",
    descriptionKey: "team_members.prayudi_desc",
  },
  {
    nameKey: "team_members.faris_name",
    roleKey: "team_members.faris_role",
    avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Faris",
    descriptionKey: "team_members.faris_desc",
  },
  {
    nameKey: "team_members.bullitt_name",
    roleKey: "team_members.bullitt_role",
    avatarUrl: "https://api.dicebear.com/8.x/avataaars/svg?seed=Bullitt",
    descriptionKey: "team_members.bullitt_desc",
  },
];

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-10 px-4 bg-muted/40 rounded-lg shadow-inner">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">{t('about_procodecg_title')}</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('about_procodecg_subtitle')}
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <Lightbulb className="text-yellow-500" size={28} /> {t('our_mission')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('our_mission_desc')}
            </p>
          </CardContent>
        </Card>
        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <Users className="text-blue-500" size={28} /> {t('our_vision')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {t('our_vision_desc')}
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{t('our_values')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Handshake className="mx-auto mb-4 text-green-500" size={40} />
            <CardTitle className="text-xl mb-2">{t('accessibility')}</CardTitle>
            <CardContent className="text-muted-foreground p-0">
              {t('accessibility_desc')}
            </CardContent>
          </Card>
          <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Lightbulb className="mx-auto mb-4 text-purple-500" size={40} />
            <CardTitle className="text-xl mb-2">{t('innovation')}</CardTitle>
            <CardContent className="text-muted-foreground p-0">
              {t('innovation_desc')}
            </CardContent>
          </Card>
          <Card className="text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Users className="mx-auto mb-4 text-red-500" size={40} />
            <CardTitle className="text-xl mb-2">{t('community')}</CardTitle>
            <CardContent className="text-muted-foreground p-0">
              {t('community_desc')}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{t('our_team')}</h2>
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
        <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('ready_to_start_learning_journey')}</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          {t('explore_latest_insights_from_blog')}
        </p>
        <div className="flex justify-center">
          <Link to="/blog">
            <Button size="lg">{t('visit_blog')}</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;