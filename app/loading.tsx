import LoadingState from '@/components/LoadingState/LoadingState';
import common from './common.module.css';
export default function Loading() {
  return (
    <div className={common.pageContainer}>
      <LoadingState />
    </div>
  );
}
