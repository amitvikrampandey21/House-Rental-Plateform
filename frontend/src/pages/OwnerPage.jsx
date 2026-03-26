import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import client from "../api/client";
import PropertyFormModal from "../components/PropertyFormModal.jsx";
import StatCard from "../components/StatCard.jsx";
import { formatDate, formatPrice } from "../utils/formatters";

const OwnerPage = () => {
  const [dashboard, setDashboard] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchOwnerData = async () => {
    const [{ data: dashboardData }, { data: bookingsData }] = await Promise.all([
      client.get("/dashboard"),
      client.get("/bookings")
    ]);
    setDashboard({
      ...dashboardData.dashboard,
      ownerBookings: bookingsData.bookings
    });
  };

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const removeProperty = async (propertyId) => {
    await client.delete(`/properties/${propertyId}`);
    toast.success("Property removed");
    fetchOwnerData();
  };

  const updateBookingStatus = async (bookingId, status) => {
    await client.patch(`/bookings/${bookingId}/status`, { status });
    toast.success(`Request ${status}`);
    fetchOwnerData();
  };

  const seedDemo = async () => {
    try {
      await client.post("/properties/seed");
      toast.success("Sample listings added");
      fetchOwnerData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to seed listings");
    }
  };

  if (!dashboard) {
    return <div className="mx-auto max-w-7xl px-4 py-16">Loading owner hub...</div>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">Owner hub</p>
          <h1 className="mt-3 font-display text-4xl font-bold">Manage listings and incoming requests</h1>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={seedDemo} className="btn-secondary">
            Add sample data
          </button>
          <button type="button" onClick={() => { setEditingProperty(null); setShowModal(true); }} className="btn-primary">
            Add new property
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard label="Owned listings" value={dashboard.ownedProperties.length} helper="Active homes under your account" />
        <StatCard label="Booking requests" value={dashboard.ownerBookings.length} helper="Requests awaiting your response" />
        <StatCard label="Favorites saved" value={dashboard.favorites.length} helper="Useful if you also rent on the platform" />
      </div>

      <div className="mt-10 grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="font-display text-2xl font-bold">Your properties</h2>
          <div className="mt-5 space-y-4">
            {dashboard.ownedProperties.map((property) => (
              <div key={property._id} className="rounded-[28px] border border-white/50 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-slate-900">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-display text-xl font-bold">{property.title}</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{property.location}</p>
                    <p className="mt-2 text-sm font-semibold">{formatPrice(property.price)}</p>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => { setEditingProperty(property); setShowModal(true); }} className="btn-secondary px-4 py-2">
                      Edit
                    </button>
                    <button type="button" onClick={() => removeProperty(property._id)} className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold">Incoming requests</h2>
          <div className="mt-5 space-y-4">
            {dashboard.ownerBookings.map((booking) => (
              <div key={booking._id} className="rounded-[28px] border border-white/50 bg-white p-5 shadow-soft dark:border-white/10 dark:bg-slate-900">
                <p className="font-semibold">{booking.property?.title}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {booking.renter?.name} requested move-in on {formatDate(booking.moveInDate)}
                </p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{booking.message}</p>
                <div className="mt-4 flex gap-3">
                  <button type="button" onClick={() => updateBookingStatus(booking._id, "accepted")} className="btn-primary px-4 py-2">
                    Accept
                  </button>
                  <button type="button" onClick={() => updateBookingStatus(booking._id, "rejected")} className="btn-secondary px-4 py-2">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal ? (
        <PropertyFormModal property={editingProperty} onClose={() => setShowModal(false)} onSaved={fetchOwnerData} />
      ) : null}
    </section>
  );
};

export default OwnerPage;
