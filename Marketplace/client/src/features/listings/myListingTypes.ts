export type MyListingItem = {
  id: string;
  title: string;
  price: number;
  currency: string;
  status: number; // Draft / Published etc (enum on backend)
  createdAt: string;

  // ✅ NEW (optional, safe)
  coverImageUrl?: string | null;
};

export type MyListingsResponse = {
  items: MyListingItem[];
};
