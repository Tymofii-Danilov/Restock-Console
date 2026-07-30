'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrderState {
  // count: number;
  // increment: (addCount: number) => void;
  // reset: () => void;
  items: Record<number, number>;
  increment: (productId: number, addCount: number, stock: number) => void;
  decrement: (productId: number) => void;
  reset: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    // set => ({
    //   count: 0,
    //   increment: addCount => set(state => ({ count: state.count + addCount })),
    //   reset: () => set({ count: 0 }),
    // }),
    set => ({
      items: {},

      increment: (productId, addCount, stock) =>
        set(state => {
          const currentQuantity = state.items[productId] ?? 0;

          if (currentQuantity >= stock) {
            return state;
          }

          return {
            items: {
              ...state.items,
              [productId]: currentQuantity + addCount,
            },
          };
        }),

      decrement: productId =>
        set(state => {
          const currentQuantity = state.items[productId] ?? 0;

          if (currentQuantity <= 0) {
            return state;
          }

          const nextQuantity = currentQuantity - 1;

          if (nextQuantity === 0) {
            const nextItems = { ...state.items };
            delete nextItems[productId];

            return { items: nextItems };
          }

          return {
            items: {
              ...state.items,
              [productId]: nextQuantity,
            },
          };
        }),

      reset: () => set({ items: {} }),
    }),
    { name: 'restock-order' }
  )
);
