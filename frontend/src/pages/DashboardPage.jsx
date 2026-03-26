import { useEffect, useState } from "react";
import client from "../api/client";
import PropertyCard from "../components/PropertyCard.jsx";
import StatCard from "../components/StatCard.jsx";
import { formatDate } from "../utils/formatters";
import { useAuth } from "../contexts/AuthContext.jsx";

const DashboardPage = () => {
  const { user, setUser } = useAuth();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const { data } = await client.get("/dashboard");
      setDashboard(data.dashboard);
    };
    fetchDashboard();
  }, []);

  const toggleFavorite = async (propertyId) => {
    const { data } = await client.post(`/properties/${propertyId}/favorite`);
    setUser((current) => ({ ...current, favorites: data.favorites }));
    setDashboard((current) => ({
      ...current,
      favorites: current.favorites.filter((property) => property._id !== propertyId)
    }));
  };

  if (!dashboard) {
    return <div className="mx-auto max-w-7xl px-4 py-16">Loading dashboard...</div>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">Dashboard</p>
        <h1 className="mt-3 font-display text-4xl font-bold">Welcome back, {user?.name}</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label="Wishlist" value={dashboard.favorites.length} helper="Homes you saved for later" />
        <StatCard label="Requests" value={dashboard.bookings.length} helper="Booking activity across your account" />
        <StatCard label="Recommendations" value={dashboard.recommendations.length} helper="Fresh suggestions for you" />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="font-display text-2xl font-bold">Your booking activity</h2>
          <div className="mt-5 space-y-4">
            {dashboard.bookings.map((booking) => (
              <div key={booking._id} className="rounded-[28px] border border-white/50 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-slate-900">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{booking.property?.title}</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Move in: {formatDate(booking.moveInDate)}</p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold">Wishlist</h2>
          <div className="mt-5 grid gap-6">
            {dashboard.favorites.map((property) => (
              <PropertyCard key={property._id} property={property} onFavorite={toggleFavorite} isFavorite />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
