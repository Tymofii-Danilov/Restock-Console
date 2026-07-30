'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrderState {
  count: number;
  increment: (addCount: number) => void;
  reset: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    set => ({
      count: 0,
      increment: addCount => set(state => ({ count: state.count + addCount })),
      reset: () => set({ count: 0 }),
    }),
    { name: 'restock-order' }
  )
);
