import { Suspense } from 'react';
import ProductList from '@/components/ProductList/ProductList';
import LoadingState from '@/components/LoadingState/LoadingState';
import common from './common.module.css';

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className={common.pageContainer}>
          <LoadingState />
        </div>
      }
    >
      <ProductList />
    </Suspense>
  );
}
