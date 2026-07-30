# Restock Console

A Next.js implementation of the Junior Front-End Developer test assignment. This is an internal
procurement tool, not a storefront: buyers can scan products, identify low-stock items, and inspect
restocking details.

## Stack

- Next.js App Router + TypeScript
- TanStack Query for server state, loading, errors, and caching
- Axios for DummyJSON API requests
- Zustand Persist for the reload-safe order counter
- Hand-written responsive CSS

## Features

- Debounced product search
- API-powered category filter
- 30-item pagination
- Search, category, page, and sorting state stored in the URL
- Low-stock row highlighting and page counter
- Sorting by price and stock
- Product detail route with image gallery
- Computed review average and review ordering
- Persistent “Add to order” counter
- Back navigation preserves the exact list URL

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production check

```bash
npm run build
npm start
```
