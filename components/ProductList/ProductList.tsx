'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getProducts, PAGE_SIZE } from '@/lib/api';
import type { SortDirection, SortField } from '@/types/product';
import common from '@/app/common.module.css';
import css from './ProductList.module.css';
import SearchInput from '../SearchInput/SearchInput';
import LoadingState from '../LoadingState/LoadingState';
import ProductsTable from '../ProductsTable/ProductsTable';

function safePage(value: string | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export default function ProductList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const page = safePage(searchParams.get('page'));
  const sortBy = (searchParams.get('sortBy') ?? '') as SortField;
  const sortDirection = (searchParams.get('order') === 'desc' ? 'desc' : 'asc') as SortDirection;
  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    const href = params.size ? `${pathname}?${params.toString()}` : pathname;
    router.push(href, { scroll: false });
  };

  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  const productsQuery = useQuery({
    queryKey: ['products', page, search, category, sortBy, sortDirection],
    queryFn: () => getProducts({ page, search, category, sortBy, order: sortDirection }),
    placeholderData: previous => previous,
  });

  const products = productsQuery.data?.products ?? [];
  const total = productsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const lowStockCount = products.filter(
    product => product.availabilityStatus === 'Low Stock'
  ).length;
  const returnUrl = searchParams.size ? `${pathname}?${searchParams.toString()}` : pathname;

  const handleSort = (field: Exclude<SortField, ''>) => {
    const nextDirection = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc';
    updateParams({ sortBy: field, order: nextDirection, page: null });
  };
  const clearDisabled = !search && !category && !sortBy && page === 1;
  return (
    <section className={common.pageContainer}>
      <div className={css.pageHeading}>
        <div>
          <h1>Working list</h1>
          <p>Review stock levels and estimate restocking needs.</p>
        </div>
        <div className={css.lowStockCounter}>
          <span>{lowStockCount}</span> running out on this page
        </div>
      </div>

      <div className={css.toolbar}>
        <SearchInput initialValue={search} />
        <div className={css.paginationControls}>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => updateParams({ page: String(page - 1) })}
          >
            Previous
          </button>
          <strong>
            Page {page} of {totalPages}
          </strong>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => updateParams({ page: String(page + 1) })}
          >
            Next
          </button>
        </div>
        <div className={css.categoryClearWrap}>
          <label className={css.selectControl}>
            <span className={css.srOnly}>Filter by category</span>
            <select
              value={category}
              onChange={event => updateParams({ category: event.target.value || null, page: null })}
              disabled={categoriesQuery.isPending}
            >
              <option value="">All categories</option>
              {categoriesQuery.data?.map(item => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className={css.clearButton}
            disabled={clearDisabled}
            onClick={() => router.push(pathname, { scroll: false })}
          >
            Clear filters
          </button>
        </div>
      </div>

      {productsQuery.isPending ? (
        <LoadingState />
      ) : productsQuery.isError ? (
        <div className={common.errorBox}>
          <strong>Could not load products.</strong>
          <button type="button" onClick={() => productsQuery.refetch()}>
            Try again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className={common.emptyBox}>No products match the selected filters.</div>
      ) : (
        <ProductsTable
          products={products}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
          returnUrl={returnUrl}
        />
      )}
      <span className={css.paginationBar}>
        Showing {total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)}{' '}
        of {total}
      </span>
    </section>
  );
}
