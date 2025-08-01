"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useTranslatedTag } from "@/utils/i18nUtils";

interface ArchivePost {
  id: string;
  title: string;
  excerpt: string | null;
  created_at: string;
  image_url: string | null;
  category: string | null;
  author: string | null;
  tags: string[] | null;
  pdf_link: string | null;
}

interface ArchiveTableProps {
  archives: ArchivePost[];
  dataLoading: boolean;
  error: string | null;
  onEdit: (archive: ArchivePost) => void;
  onDelete: (id: string, pdfLink: string | null) => void;
}

const ArchiveTable: React.FC<ArchiveTableProps> = ({
  archives,
  dataLoading,
  error,
  onEdit,
  onDelete,
}) => {
  const { t, i18n } = useTranslation();
  const { getTranslatedTag } = useTranslatedTag();

  const formatDisplayDate = (isoString: string) => {
    const dateObj = new Date(isoString);
    return dateObj.toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  if (dataLoading) {
    return <p className="text-center text-muted-foreground">{t('loading status')}</p>;
  }

  if (error) {
    return <p className="text-center text-destructive">{error}</p>;
  }

  if (archives.length === 0) {
    return <p className="text-center text-muted-foreground mt-8 text-lg">{t('no archives found')}</p>;
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table title')}</TableHead>
              <TableHead>{t('table category')}</TableHead>
              <TableHead>{t('table date')}</TableHead>
              <TableHead>{t('table pdf link')}</TableHead>
              <TableHead className="text-right">{t('table actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {archives.map((archive) => (
              <TableRow key={archive.id}>
                <TableCell className="font-medium">{archive.title}</TableCell>
                <TableCell>{archive.category}</TableCell>
                <TableCell>{formatDisplayDate(archive.created_at)}</TableCell>
                <TableCell>
                  {archive.pdf_link ? (
                    <a href={archive.pdf_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      <FileText className="h-4 w-4" /> {t('view pdf')}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">{t('no pdf')}</span>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {archive.tags?.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{getTranslatedTag(tag)}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(archive)} className="mr-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => onDelete(archive.id, archive.pdf_link)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ArchiveTable;