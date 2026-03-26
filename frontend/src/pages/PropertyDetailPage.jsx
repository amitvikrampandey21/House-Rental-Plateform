import {
  CalendarDaysIcon,
  HeartIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import client from "../api/client";
import { formatPrice } from "../utils/formatters";
import { useAuth } from "../contexts/AuthContext.jsx";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingForm, setBookingForm] = useState({
    moveInDate: "",
    durationMonths: 12,
    message: "",
    contactPhone: ""
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await client.get(`/properties/${id}`);
        setProperty(data.property);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const submitBooking = async (event) => {
    event.preventDefault();
    if (!user) {
      toast.error("Please sign in to request a booking");
      return;
    }

    try {
      const { data } = await client.post("/bookings", {
        propertyId: property._id,
        ...bookingForm
      });
      toast.success(data.message);
      setBookingForm({ moveInDate: "", durationMonths: 12, message: "", contactPhone: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create booking");
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Please sign in first");
      return;
    }

    const { data } = await client.post(`/properties/${property._id}/favorite`);
    setUser((current) => ({ ...current, favorites: data.favorites }));
    toast.success(data.message);
  };

  const contactOwner = async () => {
    if (!user) {
      toast.error("Please sign in to contact the owner");
      return;
    }

    const { data } = await client.post(`/properties/${property._id}/contact`);
    toast.success(`${data.message} Contact: ${data.contact.ownerEmail}`);
  };

  if (loading) {
    return <div className="mx-auto max-w-7xl px-4 py-16">Loading property...</div>;
  }

  if (!property) {
    return <div className="mx-auto max-w-7xl px-4 py-16">Property not found.</div>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl font-bold">{property.title}</h1>
              <div className="mt-3 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <MapPinIcon className="h-5 w-5" />
                {property.location}
              </div>
            </div>
            <button type="button" onClick={toggleFavorite} className="btn-secondary">
              <HeartIcon className="mr-2 h-5 w-5" />
              Save
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <img src={property.images?.[0]} alt={property.title} className="h-[420px] w-full rounded-[32px] object-cover md:col-span-2" />
            {property.images?.slice(1, 3).map((image) => (
              <img key={image} src={image} alt={property.title} className="h-56 w-full rounded-[28px] object-cover" />
            ))}
          </div>

          <div className="mt-10 rounded-[32px] border border-white/50 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-slate-900">
            <div className="flex flex-wrap gap-3">
              {property.amenities?.map((amenity) => (
                <span key={amenity} className="rounded-full bg-brand-50 px-3 py-2 text-sm text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
                  {amenity}
                </span>
              ))}
            </div>
            <p className="mt-6 leading-8 text-slate-600 dark:text-slate-300">{property.description}</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] bg-stone-50 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Bedrooms</p>
                <p className="mt-2 text-2xl font-bold">{property.bedrooms}</p>
              </div>
              <div className="rounded-[24px] bg-stone-50 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Bathrooms</p>
                <p className="mt-2 text-2xl font-bold">{property.bathrooms}</p>
              </div>
              <div className="rounded-[24px] bg-stone-50 p-4 dark:bg-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">Area</p>
                <p className="mt-2 text-2xl font-bold">{property.area} sq ft</p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-[32px] border border-white/50 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-slate-900">
            <h2 className="font-display text-2xl font-bold">Location snapshot</h2>
            <div className="mt-5 overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-800">
              <iframe
                title="Map"
                src={`https://www.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
                className="h-80 w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[32px] border border-white/50 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">Monthly rent</p>
            <p className="mt-3 font-display text-4xl font-bold">{formatPrice(property.price)}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Status: {property.status}</p>
          </div>

          <div className="rounded-[32px] border border-white/50 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center gap-4">
              <UserCircleIcon className="h-14 w-14 text-brand-500" />
              <div>
                <p className="font-semibold">{property.owner?.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{property.owner?.email}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{property.owner?.phone || "Phone not shared"}</p>
              </div>
            </div>
            <button type="button" onClick={contactOwner} className="btn-secondary mt-5 w-full">
              <PaperAirplaneIcon className="mr-2 h-5 w-5" />
              Contact owner
            </button>
          </div>

          <form onSubmit={submitBooking} className="rounded-[32px] border border-white/50 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-slate-900">
            <h2 className="font-display text-2xl font-bold">Request this home</h2>
            <div className="mt-5 space-y-4">
              <div className="relative">
                <CalendarDaysIcon className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input type="date" className="input-field pl-12" value={bookingForm.moveInDate} onChange={(event) => setBookingForm({ ...bookingForm, moveInDate: event.target.value })} required />
              </div>
              <input className="input-field" type="number" min="1" value={bookingForm.durationMonths} onChange={(event) => setBookingForm({ ...bookingForm, durationMonths: event.target.value })} placeholder="Lease duration (months)" />
              <input className="input-field" value={bookingForm.contactPhone} onChange={(event) => setBookingForm({ ...bookingForm, contactPhone: event.target.value })} placeholder="Phone number" />
              <textarea className="input-field min-h-28" value={bookingForm.message} onChange={(event) => setBookingForm({ ...bookingForm, message: event.target.value })} placeholder="Tell the owner a bit about your timeline and preferences" />
              <button type="submit" className="btn-primary w-full">
                Send booking request
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PropertyDetailPage;
