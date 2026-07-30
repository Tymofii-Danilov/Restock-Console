'use client';

import Link from 'next/link';
import { useOrderStore } from '@/store/orderStore';
import css from './Header.module.css';
import Image from 'next/image';

export default function Header() {
  const count = useOrderStore(state => state.count);
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
        <div className={`${css.orderCounter} ${count > 0 ? css.orderCounterActive : ''}`}>
          <svg className={css.cartIcon} width={20} height={20}>
            <use href="/cart.svg"></use>
          </svg>
          <span>Order:</span>
          <strong>{count}</strong>
          {count > 0 && (
            <button disabled={count === 0} className={css.reset} onClick={reset}>
              X
            </button>
          )}
        </div>
      </header>
    </section>
  );
}
