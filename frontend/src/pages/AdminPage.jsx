import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import client from "../api/client";
import StatCard from "../components/StatCard.jsx";

const AdminPage = () => {
  const [overview, setOverview] = useState(null);

  const fetchOverview = async () => {
    const { data } = await client.get("/admin/overview");
    setOverview(data.overview);
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const removeUser = async (id) => {
    try {
      await client.delete(`/admin/users/${id}`);
      toast.success("User removed");
      fetchOverview();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to remove user");
    }
  };

  const removeProperty = async (id) => {
    await client.delete(`/admin/properties/${id}`);
    toast.success("Listing removed");
    fetchOverview();
  };

  if (!overview) {
    return <div className="mx-auto max-w-7xl px-4 py-16">Loading admin panel...</div>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">Admin panel</p>
        <h1 className="mt-3 font-display text-4xl font-bold">Moderate platform activity</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label="Users" value={overview.users.length} />
        <StatCard label="Properties" value={overview.properties.length} />
        <StatCard label="Bookings" value={overview.bookings.length} />
      </div>

      <div className="mt-10 grid gap-10 xl:grid-cols-2">
        <div>
          <h2 className="font-display text-2xl font-bold">Users</h2>
          <div className="mt-5 space-y-4">
            {overview.users.map((entry) => (
              <div key={entry._id} className="rounded-[28px] border border-white/50 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{entry.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{entry.email}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Role: {entry.role}</p>
                  </div>
                  {entry.role !== "admin" ? (
                    <button type="button" onClick={() => removeUser(entry._id)} className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white">
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold">Property moderation</h2>
          <div className="mt-5 space-y-4">
            {overview.properties.map((property) => (
              <div key={property._id} className="rounded-[28px] border border-white/50 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{property.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{property.location}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Owner: {property.owner?.name}</p>
                  </div>
                  <button type="button" onClick={() => removeProperty(property._id)} className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPage;
