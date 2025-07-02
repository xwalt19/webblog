import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface BlogSidebarFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  allTags: string[];
  allPeriods: string[];
  getPeriodDisplayName: (period: string) => string;
}

const BlogSidebarFilters: React.FC<BlogSidebarFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedTag,
  setSelectedTag,
  selectedPeriod,
  setSelectedPeriod,
  allTags,
  allPeriods,
  getPeriodDisplayName,
}) => {
  return (
    <Card className="p-4 sticky top-20 h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold">Filter Blog</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Cari Postingan</h3>
          <Input
            type="text"
            placeholder="Cari postingan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Filter Berdasarkan Tag</h3>
          <Select
            value={selectedTag}
            onValueChange={(value) => setSelectedTag(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              {allTags.map(tag => (
                <SelectItem key={tag} value={tag}>
                  {tag === "Semua" ? "Tag" : tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Filter Berdasarkan Periode</h3>
          <Select
            value={selectedPeriod}
            onValueChange={(value) => setSelectedPeriod(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              {allPeriods.map(period => (
                <SelectItem key={period} value={period}>
                  {getPeriodDisplayName(period)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogSidebarFilters;