import { FunnelIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import client from "../api/client";
import PropertyCard from "../components/PropertyCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import useDebounce from "../hooks/useDebounce.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    type: searchParams.get("type") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    page: Number(searchParams.get("page") || 1)
  });
  const debouncedSearch = useDebounce(filters.search);
  const { user, setUser } = useAuth();

  const fetchProperties = async (nextFilters = filters) => {
    setLoading(true);
    try {
      const { data } = await client.get("/properties", { params: nextFilters });
      setProperties(data.properties);
      setPagination(data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(filters);
  }, [filters.page]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const nextFilters = { ...filters, search: debouncedSearch, page: 1 };
      setFilters(nextFilters);
      setSearchParams(Object.fromEntries(Object.entries(nextFilters).filter(([, value]) => value)));
      fetchProperties(nextFilters);
    }, 100);

    return () => clearTimeout(timeout);
  }, [debouncedSearch, filters.location, filters.type, filters.minPrice, filters.maxPrice]);

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
      toast.error("Sign in to save favorites");
      return;
    }
    const { data } = await client.post(`/properties/${propertyId}/favorite`);
    setUser((current) => ({ ...current, favorites: data.favorites }));
    toast.success(data.message);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">Discover</p>
          <h1 className="mt-3 font-display text-4xl font-bold">Browse curated rental homes</h1>
        </div>
        <div className="w-full max-w-xl">
          <SearchBar
            value={filters.search}
            onChange={(value) => setFilters((current) => ({ ...current, search: value }))}
            suggestions={suggestions}
            onSuggestionClick={(value) => setFilters((current) => ({ ...current, search: value }))}
          />
        </div>
      </div>

      <div className="mb-8 grid gap-4 rounded-[32px] border border-white/50 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-slate-900 lg:grid-cols-5">
        <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <FunnelIcon className="h-5 w-5" />
          Filters
        </div>
        <input className="input-field" placeholder="Location" value={filters.location} onChange={(event) => setFilters((current) => ({ ...current, location: event.target.value }))} />
        <select className="input-field" value={filters.type} onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}>
          <option value="">All types</option>
          <option>Apartment</option>
          <option>Villa</option>
          <option>Studio</option>
          <option>House</option>
          <option>PG</option>
        </select>
        <input className="input-field" placeholder="Min price" type="number" value={filters.minPrice} onChange={(event) => setFilters((current) => ({ ...current, minPrice: event.target.value }))} />
        <input className="input-field" placeholder="Max price" type="number" value={filters.maxPrice} onChange={(event) => setFilters((current) => ({ ...current, maxPrice: event.target.value }))} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
          : properties.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                onFavorite={toggleFavorite}
                isFavorite={user?.favorites?.includes(property._id)}
              />
            ))}
      </div>

      <div className="mt-10 flex items-center justify-center gap-4">
        <button
          type="button"
          disabled={(pagination.page || 1) <= 1}
          onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
          className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          Page {pagination.page || 1} of {pagination.totalPages || 1}
        </span>
        <button
          type="button"
          disabled={(pagination.page || 1) >= (pagination.totalPages || 1)}
          onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default PropertiesPage;
