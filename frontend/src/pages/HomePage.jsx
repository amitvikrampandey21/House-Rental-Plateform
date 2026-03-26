import { ArrowRightIcon, BuildingOffice2Icon, MapPinIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import client from "../api/client";
import PropertyCard from "../components/PropertyCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import useDebounce from "../hooks/useDebounce.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const HomePage = () => {
  const { user, setUser } = useAuth();
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    const loadHome = async () => {
      try {
        const [{ data: propertyData }, { data: statsData }] = await Promise.all([
          client.get("/properties", { params: { limit: 6 } }),
          client.get("/properties/stats")
        ]);
        setProperties(propertyData.properties);
        setStats(statsData.stats);
      } finally {
        setLoading(false);
      }
    };

    loadHome();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearch.trim()) {
        setSuggestions([]);
        return;
      }

      const { data } = await client.get("/properties/suggestions", { params: { q: debouncedSearch } });
      setSuggestions(data.suggestions);
    };

    fetchSuggestions();
  }, [debouncedSearch]);

  const toggleFavorite = async (propertyId) => {
    if (!user) {
      return;
    }

    const { data } = await client.post(`/properties/${propertyId}/favorite`);
    setUser((current) => ({ ...current, favorites: data.favorites }));
  };

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-grid" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-24">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700 dark:border-brand-900 dark:bg-brand-900/40 dark:text-brand-200">
              <SparklesIcon className="h-4 w-4" />
              Modern rental experience
            </span>
            <h1 className="mt-6 max-w-3xl font-display text-5xl font-bold leading-tight sm:text-6xl">
              Find a home that feels <span className="text-brand-600 dark:text-brand-300">intentional</span>.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Browse premium rentals, shortlist favorites, message owners, and manage bookings through one polished platform for renters, owners, and admins.
            </p>
            <div className="mt-8 max-w-2xl">
              <SearchBar
                value={search}
                onChange={setSearch}
                suggestions={suggestions}
                onSuggestionClick={(value) => {
                  setSearch(value);
                  window.location.href = `/properties?search=${encodeURIComponent(value)}`;
                }}
              />
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/properties" className="btn-primary">
                Explore listings
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/signup" className="btn-secondary">
                Become an owner
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] bg-white/80 p-5 shadow-soft backdrop-blur dark:bg-slate-900/80">
                <p className="text-sm text-slate-500 dark:text-slate-400">Listings</p>
                <p className="mt-2 text-3xl font-bold">{stats.properties || 0}+</p>
              </div>
              <div className="rounded-[28px] bg-white/80 p-5 shadow-soft backdrop-blur dark:bg-slate-900/80">
                <p className="text-sm text-slate-500 dark:text-slate-400">Bookings</p>
                <p className="mt-2 text-3xl font-bold">{stats.bookings || 0}+</p>
              </div>
              <div className="rounded-[28px] bg-white/80 p-5 shadow-soft backdrop-blur dark:bg-slate-900/80">
                <p className="text-sm text-slate-500 dark:text-slate-400">Users</p>
                <p className="mt-2 text-3xl font-bold">{stats.users || 0}+</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-8 hidden h-44 w-44 rounded-full bg-accent/20 blur-3xl lg:block" />
            <div className="rounded-[36px] bg-slate-950 p-6 text-white shadow-soft dark:bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
                alt="Interior"
                className="h-[420px] w-full rounded-[28px] object-cover"
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] bg-white/10 p-4">
                  <BuildingOffice2Icon className="h-6 w-6 text-brand-300" />
                  <p className="mt-3 font-semibold">Owner tools</p>
                  <p className="mt-2 text-sm text-slate-300">Add listings, handle requests, and update inventory fast.</p>
                </div>
                <div className="rounded-[24px] bg-white/10 p-4">
                  <MapPinIcon className="h-6 w-6 text-brand-300" />
                  <p className="mt-3 font-semibold">Map-aware browsing</p>
                  <p className="mt-2 text-sm text-slate-300">Filter by neighborhood and view local context instantly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">Featured homes</p>
            <h2 className="mt-3 font-display text-3xl font-bold">Spaces people are loving right now</h2>
          </div>
          <Link to="/properties" className="btn-secondary">
            Browse all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
            : properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  onFavorite={toggleFavorite}
                  isFavorite={user?.favorites?.includes(property._id)}
                />
              ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
