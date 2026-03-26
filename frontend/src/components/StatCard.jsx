const StatCard = ({ label, value, helper }) => (
  <div className="rounded-[28px] border border-white/60 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-slate-900">
    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    <p className="mt-3 font-display text-3xl font-bold">{value}</p>
    {helper ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{helper}</p> : null}
  </div>
);

export default StatCard;
