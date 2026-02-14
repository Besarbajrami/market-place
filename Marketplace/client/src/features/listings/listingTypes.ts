export type CategoryLabelDto = {
    id: string;
    name: string;
    slug: string;
  };
  
  export type ListingImage = {
    id: string;
    url: string;
    isCover: boolean;
  };
  
  export type ListingSearchItem = {
    id: string;
    title: string;
    price: number;
    currency: string;
    city: string;
    region: string;
    publishedAt: string;
    coverImageUrl?: string | null;
  
    // backend V2 returns these (keep optional if your backend might not send yet)
    isFeatured?: boolean;
    isUrgent?: boolean;
  
    category?: CategoryLabelDto;
  };
  
  export type PagedResponse<T> = {
    page: number;
    pageSize: number;
    totalCount: number;
    items: T[];
  };
  
  // Legacy V1 (keep if still used anywhere else)
  export type ListingsSearchParams = {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    pageSize?: number;
  };
  
  // ✅ V2
  export type ListingsSearchV2Params = {
    query?: string;
    categoryId?: string;
    includeChildCategories?: boolean;
  
    city?: string;
    region?: string;
  
    minPrice?: number;
    maxPrice?: number;
  
    condition?: "new" | "used";
    sort?: "newest" | "price_asc" | "price_desc";
  
    page?: number;
    pageSize?: number;
    countryCode: "MK";

  };
  