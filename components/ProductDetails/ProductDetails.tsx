'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getProduct } from '@/lib/api';
import { useOrderStore } from '@/store/orderStore';
import LoadingState from '@/components/LoadingState/LoadingState';
import common from '@/app/common.module.css';
import css from './ProductDetails.module.css';

export default function ProductDetails({ id, from }: { id: string; from: string }) {
  const [activeImage, setActiveImage] = useState(0);
  const [reviewOrder, setReviewOrder] = useState<'newest' | 'oldest'>('newest');
  const [added, setAdded] = useState(false);
  const [addCount, setAddCount] = useState(1);
  const increment = useOrderStore(state => state.increment);
  const productQuery = useQuery({ queryKey: ['product', id], queryFn: () => getProduct(id) });
  const product = productQuery.data;

  if (productQuery.isPending)
    return (
      <div className={common.pageContainer}>
        <LoadingState />
      </div>
    );
  if (productQuery.isError || !product) {
    return (
      <div className={common.pageContainer}>
        <div className={common.errorBox}>
          <strong>Product not found.</strong>
          <Link href={from}>Back to list</Link>
        </div>
      </div>
    );
  }

  const isLow = product.availabilityStatus === 'Low Stock';
  const images = product.images.length ? product.images : [product.thumbnail];
  const averageRating = product.reviews.length
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : null;
  const sortedReviews = [...product.reviews].sort((a, b) => {
    const delta = new Date(b.date).getTime() - new Date(a.date).getTime();
    return reviewOrder === 'newest' ? delta : -delta;
  });

  const addToOrder = (addCount: number) => {
    increment(addCount);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <section className={`${common.pageContainer} ${css.detailPage}`}>
      <Link href={from} className={css.backLink}>
        ← Back to working list
      </Link>

      <div className={css.productOverview}>
        <div className={css.gallery}>
          <div className={css.mainImageWrap}>
            <Image
              src={images[activeImage]}
              alt={product.title}
              fill
              sizes="(max-width: 800px) 100vw, 420px"
              className={css.mainImage}
              priority
            />
          </div>
          {images.length > 1 && (
            <div className={css.thumbnails}>
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  className={index === activeImage ? css.activeThumbnail : undefined}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    width={56}
                    height={56}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={css.productInfo}>
          <span className={css.categoryTag}>{product.category}</span>
          <div className={css.titleRow}>
            <div>
              <h1>{product.title}</h1>
              <p>
                {product.brand || 'Unbranded'} · <span className={css.sku}>{product.sku}</span>
              </p>
            </div>
            <strong className={css.detailPrice}>${product.price.toFixed(2)}</strong>
          </div>
          <p className={css.description}>{product.description}</p>

          <div className={`${css.stockPanel} ${isLow ? css.stockPanelLow : ''}`}>
            <div>
              <span className={css.statusDot} /> <strong>{product.availabilityStatus}</strong>
            </div>
            <span>
              {product.stock} units {isLow && <em>LOW</em>}
            </span>
          </div>

          <div className={css.addBtns}>
            <button
              type="button"
              className={`${css.addButton} ${added ? css.addedButton : ''}`}
              onClick={() => addToOrder(addCount)}
            >
              {added ? `✓ Added to order: ${addCount}` : `+ Add to order: ${addCount}`}
            </button>
            <div className={css.addRemoveBtns}>
              <button
                onClick={() => addCount < Number(product.stock) && setAddCount(addCount + 1)}
                className={css.addRemove}
                disabled={addCount === Number(product.stock)}
              >
                +
              </button>
              <button
                onClick={() => addCount > 1 && setAddCount(addCount - 1)}
                className={css.addRemove}
                disabled={addCount === 1}
              >
                -
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className={css.panel}>
        <h2>Logistics</h2>
        <div className={css.logisticsGrid}>
          <dl>
            <div>
              <dt>Weight</dt>
              <dd>{product.weight} kg</dd>
            </div>
            <div>
              <dt>Dimensions</dt>
              <dd>
                {product.dimensions.width} × {product.dimensions.height} ×{' '}
                {product.dimensions.depth}
              </dd>
            </div>
          </dl>
          <dl>
            <div>
              <dt>Shipping</dt>
              <dd>{product.shippingInformation}</dd>
            </div>
            <div>
              <dt>Return policy</dt>
              <dd>{product.returnPolicy}</dd>
            </div>
            <div>
              <dt>Warranty</dt>
              <dd>{product.warrantyInformation}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className={css.panel}>
        <div className={css.reviewsHeader}>
          <div>
            <h2>Reviews</h2>
            {averageRating !== null && (
              <p>
                <span className={css.stars}>
                  {'★'.repeat(Math.round(averageRating))}
                  {'☆'.repeat(5 - Math.round(averageRating))}
                </span>{' '}
                <strong>{averageRating.toFixed(1)}</strong> ({product.reviews.length})
              </p>
            )}
          </div>
          {product.reviews.length > 0 && (
            <div className={css.reviewToggle}>
              <button
                type="button"
                className={reviewOrder === 'newest' ? css.active : undefined}
                onClick={() => setReviewOrder('newest')}
              >
                Newest first
              </button>
              <button
                type="button"
                className={reviewOrder === 'oldest' ? css.active : undefined}
                onClick={() => setReviewOrder('oldest')}
              >
                Oldest first
              </button>
            </div>
          )}
        </div>

        {sortedReviews.length === 0 ? (
          <p className={css.emptyReviews}>No reviews yet for this product.</p>
        ) : (
          <div className={css.reviewsList}>
            {sortedReviews.map(review => (
              <article key={`${review.reviewerName}-${review.rating}`}>
                <div className={css.reviewMeta}>
                  <strong>{review.reviewerName}</strong>
                  <span className={css.stars}>
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </span>
                  <time dateTime={review.date}>
                    {new Date(review.date).toLocaleDateString('en-GB')}
                  </time>
                </div>
                <p>{review.comment}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
