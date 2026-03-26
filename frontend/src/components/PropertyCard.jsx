import { HeartIcon, MapPinIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { formatPrice } from "../utils/formatters";

const PropertyCard = ({ property, onFavorite, isFavorite }) => (
  <motion.article
    whileHover={{ y: -6 }}
    className="overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-soft dark:border-white/10 dark:bg-slate-900"
  >
    <div className="relative">
      <img
        src={property.images?.[0] || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"}
        alt={property.title}
        className="h-64 w-full object-cover"
      />
      <button
        type="button"
        onClick={() => onFavorite?.(property._id)}
        className={`absolute right-4 top-4 rounded-full p-3 backdrop-blur ${
          isFavorite ? "bg-rose-500 text-white" : "bg-white/80 text-slate-700"
        }`}
      >
        <HeartIcon className="h-5 w-5" />
      </button>
      {property.isFeatured ? (
        <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-semibold text-white">
          <SparklesIcon className="h-4 w-4" />
          Featured
        </span>
      ) : null}
    </div>
    <div className="space-y-4 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-xl font-bold">{property.title}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <MapPinIcon className="h-4 w-4" />
            {property.location}
          </div>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
          {property.type}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold">{formatPrice(property.price)}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">per month</p>
        </div>
        <Link to={`/properties/${property._id}`} className="btn-secondary px-4 py-2">
          View details
        </Link>
      </div>
    </div>
  </motion.article>
);

export default PropertyCard;
