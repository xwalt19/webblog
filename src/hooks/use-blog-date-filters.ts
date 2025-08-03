import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MonthFilter {
  month: number;
  value: string; // e.g., "2024-1"
}

export interface YearFilter {
  year: number;
  value: string; // e.g., "2024"
  months: MonthFilter[];
}

export const useBlogDateFilters = () => {
  return useQuery<YearFilter[], Error>({
    queryKey: ['blogDateFilters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('created_at')
        .is('pdf_link', null); // Hanya pertimbangkan postingan blog yang sebenarnya

      if (error) throw error;

      const yearsMap = new Map<number, Set<number>>(); // Map<year, Set<month>>
      data.forEach(post => {
        if (post.created_at) {
          const date = new Date(post.created_at);
          const year = date.getFullYear();
          const month = date.getMonth() + 1; // Bulan berbasis 0
          if (!yearsMap.has(year)) {
            yearsMap.set(year, new Set<number>());
          }
          yearsMap.get(year)?.add(month);
        }
      });

      const result: YearFilter[] = [];
      const sortedYears = Array.from(yearsMap.keys()).sort((a, b) => b - a); // Urutkan tahun menurun

      sortedYears.forEach(year => {
        const months: MonthFilter[] = [];
        const sortedMonths = Array.from(yearsMap.get(year) || []).sort((a, b) => b - a); // Urutkan bulan menurun
        sortedMonths.forEach(month => {
          months.push({ month, value: `${year}-${month}` });
        });
        result.push({ year, value: String(year), months });
      });

      return result;
    },
    staleTime: 5 * 60 * 1000, // Cache selama 5 menit
  });
};