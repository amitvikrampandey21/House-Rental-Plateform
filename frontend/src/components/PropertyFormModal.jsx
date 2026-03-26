import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import client from "../api/client";

const defaultForm = {
  title: "",
  description: "",
  price: "",
  location: "",
  city: "",
  type: "Apartment",
  bedrooms: 1,
  bathrooms: 1,
  area: "",
  amenities: "",
  images: []
};

const PropertyFormModal = ({ property, onClose, onSaved }) => {
  const [form, setForm] = useState(defaultForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (property) {
      setForm({
        ...property,
        amenities: property.amenities?.join(", ") || ""
      });
    }
  }, [property]);

  const uploadImage = async (file) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      setUploading(true);
      try {
        const { data } = await client.post("/uploads", { image: reader.result });
        setForm((current) => ({ ...current, images: [...current.images, data.imageUrl] }));
      } catch (error) {
        toast.error(error.response?.data?.message || "Image upload failed");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        area: Number(form.area),
        amenities: form.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      };

      if (property?._id) {
        await client.put(`/properties/${property._id}`, payload);
        toast.success("Property updated");
      } else {
        await client.post("/properties", payload);
        toast.success("Property created");
      }

      onSaved();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save property");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">{property ? "Edit Property" : "Add Property"}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Showcase the space with polished details.</p>
          </div>
          <button type="button" onClick={onClose} className="btn-secondary px-4 py-2">
            Close
          </button>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <input className="input-field md:col-span-2" placeholder="Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
          <textarea className="input-field md:col-span-2 min-h-32" placeholder="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />
          <input className="input-field" placeholder="Monthly price" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
          <select className="input-field" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
            <option>Apartment</option>
            <option>Villa</option>
            <option>Studio</option>
            <option>House</option>
            <option>PG</option>
          </select>
          <input className="input-field" placeholder="Location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} required />
          <input className="input-field" placeholder="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} required />
          <input className="input-field" placeholder="Bedrooms" type="number" value={form.bedrooms} onChange={(event) => setForm({ ...form, bedrooms: event.target.value })} />
          <input className="input-field" placeholder="Bathrooms" type="number" value={form.bathrooms} onChange={(event) => setForm({ ...form, bathrooms: event.target.value })} />
          <input className="input-field" placeholder="Area (sq. ft.)" type="number" value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} />
          <input className="input-field md:col-span-2" placeholder="Amenities, comma separated" value={form.amenities} onChange={(event) => setForm({ ...form, amenities: event.target.value })} />
          <label className="input-field md:col-span-2 flex cursor-pointer flex-col gap-3">
            <span className="text-sm font-medium">Upload property image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  uploadImage(file);
                }
              }}
            />
            <span className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              {uploading ? "Uploading image..." : "Choose image and preview it instantly"}
            </span>
          </label>
          <div className="md:col-span-2 grid grid-cols-2 gap-4 md:grid-cols-4">
            {form.images?.map((image) => (
              <img key={image} src={image} alt="Preview" className="h-28 w-full rounded-2xl object-cover" />
            ))}
          </div>
          <button type="submit" disabled={saving} className="btn-primary md:col-span-2">
            {saving ? "Saving..." : property ? "Update Property" : "Publish Property"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropertyFormModal;
