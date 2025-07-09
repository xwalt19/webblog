import React, { useState, useMemo } from "react";
import Draggable from "react-draggable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { dummyScrapedArticles } from "@/data/scrapedArticles";

interface ScrapedArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  snippet: string;
}

const FloatingSearchButton: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResults: ScrapedArticle[] = useMemo(() => {
    if (!searchTerm) return [];
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return dummyScrapedArticles.filter(article =>
      article.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      article.snippet.toLowerCase().includes(lowerCaseSearchTerm) ||
      article.source.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [searchTerm]);

  return (
    <>
      <Draggable bounds="parent" defaultPosition={{ x: window.innerWidth - 100, y: window.innerHeight - 100 }}>
        <Button
          className="fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90 flex items-center justify-center cursor-grab active:cursor-grabbing"
          onClick={() => setIsDialogOpen(true)}
          aria-label="Buka Pencarian"
        >
          <Search className="h-6 w-6 text-primary-foreground" />
        </Button>
      </Draggable>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" /> Cari Informasi
            </DialogTitle>
            <DialogDescription>
              Masukkan kata kunci untuk mencari artikel atau informasi.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="search"
              placeholder="Cari tentang HTML, JavaScript, dll."
              className="col-span-3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && filteredResults.length > 0 ? (
              <div className="space-y-4 mt-4">
                {filteredResults.map((result) => (
                  <Card key={result.id} className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{result.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">Sumber: {result.source}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground mb-2 line-clamp-2">{result.snippet}</p>
                      <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                        Baca Selengkapnya <ExternalLink className="h-3 w-3" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchTerm && filteredResults.length === 0 ? (
              <p className="text-center text-muted-foreground mt-4">Tidak ada hasil yang ditemukan untuk "{searchTerm}".</p>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingSearchButton;