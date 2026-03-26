const SkeletonCard = () => (
  <div className="animate-pulse overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
    <div className="h-64 rounded-3xl bg-slate-200 dark:bg-slate-800" />
    <div className="mt-5 h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
    <div className="mt-3 h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
    <div className="mt-6 h-10 w-full rounded bg-slate-200 dark:bg-slate-800" />
  </div>
);

export default SkeletonCard;
