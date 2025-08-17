import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import YouTubeUpdates from "@/components/YouTubeUpdates";
import { useTranslation } from "react-i18next";
import { useSession } from "@/components/SessionProvider"; // Import useSession
import { Upload } from "lucide-react"; // Import Upload icon

const YouTubePage: React.FC = () => {
  const { t } = useTranslation();
  const { profile, loading: sessionLoading } = useSession(); // Get profile and loading state
  const isAdmin = profile?.role === 'admin'; // Check if user is admin

  return (
    <div className="container mx-auto py-10 px-4">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground capitalize">{t('youtube page title')}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t('youtube page subtitle')}
        </p>
      </section>

      {/* Removed the Import YouTube Channel Button from here */}
      {/* {!sessionLoading && isAdmin && (
        <div className="flex justify-center mb-6">
          <Link to="/admin/import-youtube-channel">
            <Button>
              <Upload className="h-4 w-4 mr-2" /> {t('import youtube channel')}
            </Button>
          </Link>
        </div>
      )} */}

      <YouTubeUpdates />

      <div className="text-center mt-12">
        <Link to="/">
          <Button>{t('return to home')}</Button>
        </Link>
      </div>
    </div>
  );
};

export default YouTubePage;