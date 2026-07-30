import Link from 'next/link';
import common from './common.module.css';
export default function NotFound() {
  return (
    <div className={common.pageContainer}>
      <div className={common.emptyBox}>
        <h1>Page not found</h1>
        <Link href="/">Return to working list</Link>
      </div>
    </div>
  );
}
