import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useGrants() {
  return useQuery({
    queryKey: [api.grants.list.path],
    queryFn: async () => {
      const res = await fetch(api.grants.list.path);
      if (!res.ok) throw new Error("Failed to fetch grants");
      return api.grants.list.responses[200].parse(await res.json());
    },
  });
}

export function useWeather() {
  return useQuery({
    queryKey: [api.weather.get.path],
    queryFn: async () => {
      const res = await fetch(api.weather.get.path);
      if (!res.ok) throw new Error("Failed to fetch weather");
      return api.weather.get.responses[200].parse(await res.json());
    },
    refetchInterval: 300000, // 5 minutes
  });
}
