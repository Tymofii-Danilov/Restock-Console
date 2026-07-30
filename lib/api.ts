import axios from 'axios';
import type {
  Product,
  ProductCategory,
  ProductsResponse,
  SortDirection,
  SortField,
} from '@/types/product';

export const PAGE_SIZE = 30;

export const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
});

interface GetProductsParams {
  page: number;
  search?: string;
  category?: string;
  sortBy?: SortField;
  order?: SortDirection;
}

export async function getProducts({ page, search, category, sortBy, order }: GetProductsParams) {
  const skip = (page - 1) * PAGE_SIZE;
  const hasCombinedFilters = Boolean(category && search);
  const params = {
    limit: hasCombinedFilters ? 0 : PAGE_SIZE,
    skip: hasCombinedFilters ? 0 : skip,
    ...(search && !category ? { q: search } : {}),
    ...(sortBy ? { sortBy, order } : {}),
  };

  const endpoint = category
    ? `/products/category/${encodeURIComponent(category)}`
    : search
      ? '/products/search'
      : '/products';

  const response = await api.get<ProductsResponse>(endpoint, {
    params,
  });

  if (category && search) {
    const query = search.trim().toLowerCase();

    const filteredProducts = response.data.products.filter(product => {
      const searchableText = [product.title, product.description, product.brand, product.category]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });

    return {
      ...response.data,
      products: filteredProducts.slice(skip, skip + PAGE_SIZE),
      total: filteredProducts.length,
      skip,
      limit: PAGE_SIZE,
    };
  }

  return response.data;
}

export async function getCategories() {
  const response = await api.get<ProductCategory[]>('/products/categories');
  return response.data;
}

export async function getProduct(id: string) {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
}
