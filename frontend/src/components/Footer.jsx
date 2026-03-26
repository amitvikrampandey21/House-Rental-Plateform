const Footer = () => (
  <footer className="border-t border-slate-200/70 bg-white/70 py-10 dark:border-slate-800 dark:bg-slate-950">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div>
        <p className="font-display text-lg font-bold">StaySphere</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Premium renting, modern management, smoother decisions.
        </p>
      </div>
      <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
        <span>JWT Auth</span>
        <span>MongoDB</span>
        <span>React + Tailwind</span>
      </div>
    </div>
  </footer>
);

export default Footer;
