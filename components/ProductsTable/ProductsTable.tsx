'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product, SortDirection, SortField } from '@/types/product';
import css from './ProductsTable.module.css';

interface ProductsTableProps {
  products: Product[];
  sortBy: SortField;
  sortDirection: SortDirection;
  onSort: (field: Exclude<SortField, ''>) => void;
  returnUrl: string;
}

export default function ProductsTable({
  products,
  sortBy,
  sortDirection,
  onSort,
  returnUrl,
}: ProductsTableProps) {
  const sortIcon = (field: SortField) => {
    if (sortBy !== field) return '↑↓';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={css.tableShell}>
      <table className={css.productsTable}>
        <colgroup>
          <col className={css.thumbnailColumn} />
          <col className={css.nameColumn} />
          <col className={css.brandColumn} />
          <col className={css.categoryColumn} />
          <col className={css.priceColumn} />
          <col className={css.stockColumn} />
        </colgroup>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Brand</th>
            <th>Category</th>
            <th>
              <button type="button" className={css.sortButton} onClick={() => onSort('price')}>
                Unit price <span>{sortIcon('price')}</span>
              </button>
            </th>
            <th>
              <button type="button" className={css.sortButton} onClick={() => onSort('stock')}>
                In stock <span>{sortIcon('stock')}</span>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => {
            const isLow = product.availabilityStatus === 'Low Stock';
            const isNone = product.stock === 0;
            return (
              <tr
                key={product.id}
                className={isLow ? css.lowStockRow : isNone ? css.noStockRow : undefined}
              >
                <td>
                  <Link href={`/product/${product.id}?from=${encodeURIComponent(returnUrl)}`}>
                    <Image
                      src={product.thumbnail}
                      alt={product.description}
                      width={44}
                      height={44}
                      className={css.tableImage}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/product/${product.id}?from=${encodeURIComponent(returnUrl)}`}
                    className={css.productName}
                  >
                    {product.title}
                  </Link>
                  <span className={css.sku}>{product.sku}</span>
                </td>
                <td>{product.brand || 'Unbranded'}</td>
                <td>
                  <span className={css.categoryTag}>{product.category}</span>
                </td>
                <td className={css.numberCell}>${product.price.toFixed(2)}</td>
                <td className={css.numberCell}>
                  <span className={isLow ? css.stockLow : isNone ? css.noneInStock : css.stockOk}>
                    {product.stock}
                  </span>
                  {isLow && <span className={css.lowMarker}>LOW</span>}
                  {isNone && <span className={css.noneMarker}>NONE</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
