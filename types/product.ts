export type AvailabilityStatus = 'In Stock' | 'Low Stock' | string;

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Product {
  id: number;
  title: string;
  brand?: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  availabilityStatus: AvailabilityStatus;
  thumbnail: string;
  images: string[];
  description: string;
  weight: number;
  dimensions: ProductDimensions;
  shippingInformation: string;
  returnPolicy: string;
  warrantyInformation: string;
  reviews: ProductReview[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductCategory {
  slug: string;
  name: string;
  url: string;
}

export type SortField = 'price' | 'stock' | '';
export type SortDirection = 'asc' | 'desc';
