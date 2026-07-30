import css from './LoadingState.module.css';

export default function LoadingState() {
  return (
    <div className={css.loadingBox} role="status" aria-live="polite">
      <span className={css.spinner} /> Loading products…
      <div className={css.srOnly}>Loading</div>
    </div>
  );
}
