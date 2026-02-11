export type SellerListingItem = {
    id: string;
    title: string;
    price: number;
    currency: string;
    city: string;
    region: string;
    publishedAt: string;
    coverImageUrl?: string | null;
    isFeatured: boolean;
    isUrgent: boolean;
    categoryName: string;
    categorySlug: string;
  };
  
  export type SellerListingsResponse = {
    page: number;
    pageSize: number;
    totalCount: number;
    items: SellerListingItem[];
  };
  