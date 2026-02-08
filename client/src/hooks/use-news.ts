import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

// GET /api/news
export function useNews() {
  return useQuery({
    queryKey: [api.news.list.path],
    queryFn: async () => {
      const res = await fetch(api.news.list.path);
      if (!res.ok) throw new Error("Failed to fetch news");
      return api.news.list.responses[200].parse(await res.json());
    },
  });
}
