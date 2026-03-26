import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext.jsx";

const SignupPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "renter"
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await register(form);
      navigate(user.role === "owner" ? "/owner" : "/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create account");
    }
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full gap-10 lg:grid-cols-2">
        <div className="rounded-[36px] bg-brand-500 p-10 text-slate-950 shadow-soft">
          <p className="text-sm uppercase tracking-[0.24em]">Create your profile</p>
          <h1 className="mt-4 font-display text-4xl font-bold">Start as a renter or owner and grow into the platform.</h1>
        </div>
        <form onSubmit={handleSubmit} className="rounded-[36px] border border-white/50 bg-white p-8 shadow-soft dark:border-white/10 dark:bg-slate-900">
          <h2 className="font-display text-3xl font-bold">Create account</h2>
          <div className="mt-6 grid gap-4">
            <input className="input-field" placeholder="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            <input className="input-field" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            <input className="input-field" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
            <input className="input-field" placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            <select className="input-field" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
              <option value="renter">Renter</option>
              <option value="owner">Owner</option>
            </select>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>
          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
            Already registered? <Link to="/login" className="font-semibold text-brand-600 dark:text-brand-300">Sign in</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignupPage;
