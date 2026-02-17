export type AdminPendingListingItem = {
    id: string;
    title: string;
    sellerId: string;
    createdAt: string;
    imageCount: number;
  };
  
  export type SearchPendingListingsResponse = {
    page: number;
    pageSize: number;
    total: number;
    items: AdminPendingListingItem[];
  };
  