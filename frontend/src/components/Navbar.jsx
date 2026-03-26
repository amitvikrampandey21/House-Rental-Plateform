import {
  Bars3Icon,
  HeartIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useTheme } from "../contexts/ThemeContext.jsx";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Properties", to: "/properties" },
  { label: "Dashboard", to: "/dashboard" }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-stone-50/80 backdrop-blur-xl dark:bg-slate-950/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-lg font-bold text-white shadow-soft">
            S
          </div>
          <div>
            <p className="font-display text-lg font-bold">StaySphere</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Live beautifully</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-brand-600 dark:text-brand-300" : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user?.role === "owner" || user?.role === "admin" ? (
            <NavLink
              to="/owner"
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-brand-600 dark:text-brand-300" : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"}`
              }
            >
              Owner Hub
            </NavLink>
          ) : null}
          {user?.role === "admin" ? (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? "text-brand-600 dark:text-brand-300" : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"}`
              }
            >
              Admin
            </NavLink>
          ) : null}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-2xl border border-slate-200 p-3 text-slate-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200"
          >
            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>
          {user ? (
            <>
              <Link to="/dashboard" className="rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
                <HeartIcon className="h-5 w-5" />
              </Link>
              <button type="button" onClick={logout} className="btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Sign in
              </Link>
              <Link to="/signup" className="btn-primary">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-2xl border border-slate-200 p-3 md:hidden dark:border-slate-700"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-200 px-4 py-4 md:hidden dark:border-slate-800">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className="text-sm font-medium" onClick={() => setIsOpen(false)}>
                {link.label}
              </NavLink>
            ))}
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <UserCircleIcon className="h-5 w-5" />
                  {user.name}
                </div>
                <button type="button" onClick={logout} className="btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary" onClick={() => setIsOpen(false)}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
