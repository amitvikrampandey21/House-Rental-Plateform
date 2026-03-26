import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext.jsx";

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await login(form);
      navigate(user.role === "admin" ? "/admin" : user.role === "owner" ? "/owner" : "/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to login");
    }
  };

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full gap-10 lg:grid-cols-2">
        <div className="rounded-[36px] bg-slate-950 p-10 text-white shadow-soft">
          <p className="text-sm uppercase tracking-[0.24em] text-brand-300">Welcome back</p>
          <h1 className="mt-4 font-display text-4xl font-bold">Manage listings, bookings, and favorites from one calm workspace.</h1>
        </div>
        <form onSubmit={handleSubmit} className="rounded-[36px] border border-white/50 bg-white p-8 shadow-soft dark:border-white/10 dark:bg-slate-900">
          <h2 className="font-display text-3xl font-bold">Sign in</h2>
          <div className="mt-6 space-y-4">
            <input className="input-field" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
            <input className="input-field" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>
          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400">
            Need an account? <Link to="/signup" className="font-semibold text-brand-600 dark:text-brand-300">Create one</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
