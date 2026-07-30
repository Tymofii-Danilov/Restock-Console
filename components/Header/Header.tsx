'use client';

import Link from 'next/link';
import { useOrderStore } from '@/store/orderStore';
import css from './Header.module.css';
import Image from 'next/image';

export default function Header() {
  const totalCount = useOrderStore(state =>
    Object.values(state.items).reduce((total, quantity) => {
      return total + quantity;
    }, 0)
  );
  const reset = useOrderStore(state => state.reset);
  return (
    <section className={css.headerSection}>
      <header className={css.header}>
        <div className={css.headerInner}>
          <Link href="/" className={css.brand} aria-label="Restock Console home">
            <Image src="/logo.png" alt="logo" width={30} height={30} />
            <span>Restock Console</span>
          </Link>
        </div>
        <div className={`${css.orderCounter} ${totalCount > 0 ? css.orderCounterActive : ''}`}>
          <svg className={css.cartIcon} width={20} height={20}>
            <use href="/cart.svg"></use>
          </svg>
          <span>Order:</span>
          <strong>{totalCount}</strong>
          {totalCount > 0 && (
            <button disabled={totalCount === 0} className={css.reset} onClick={reset}>
              X
            </button>
          )}
        </div>
      </header>
    </section>
  );
}
