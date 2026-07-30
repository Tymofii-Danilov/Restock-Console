import type { Metadata } from 'next';
import ProductDetails from '@/components/ProductDetails/ProductDetails';

interface ProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}

export const metadata: Metadata = { title: 'Product details' };

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const { id } = await params;
  const { from } = await searchParams;
  const safeFrom = from?.startsWith('/') && !from.startsWith('//') ? from : '/';
  return <ProductDetails id={id} from={safeFrom} />;
}
