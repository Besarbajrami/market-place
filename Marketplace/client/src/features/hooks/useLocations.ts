import { useQuery } from "@tanstack/react-query";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export type CountryDto = { code: string; name: string };
export type CityDto = { id: string; name: string; countryCode: string };

export function useCountries() {
  return useQuery<CountryDto[]>({
    queryKey: ["countries"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/locations/countries`);
      if (!res.ok) throw new Error("Failed to load countries");
      return res.json();
    }
  });
}

export function useCities(countryCode: string | null) {
  return useQuery<CityDto[]>({
    queryKey: ["cities", countryCode],
    enabled: !!countryCode,
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/api/locations/cities?country=${countryCode}`
      );
      if (!res.ok) throw new Error("Failed to load cities");
      return res.json();
    }
  });
}
