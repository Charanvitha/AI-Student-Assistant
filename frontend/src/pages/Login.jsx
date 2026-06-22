import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../state/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  }

  return (
    <AuthFrame title="Welcome back" subtitle="Sign in to your AI student workspace.">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Email" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} />
        <Input label="Password" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="focus-ring w-full rounded bg-ink px-4 py-3 font-medium text-white">Login</button>
        <p className="text-center text-sm text-slate-500">
          New here? <Link className="font-medium text-mint" to="/register">Create an account</Link>
        </p>
      </form>
    </AuthFrame>
  );
}

export function AuthFrame({ title, subtitle, children }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f8f5] px-4">
      <section className="w-full max-w-md rounded border border-line bg-white p-7 shadow-sm">
        <p className="text-sm font-medium text-mint">CampusCopilot AI</p>
        <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
        <p className="mb-6 mt-1 text-sm text-slate-500">{subtitle}</p>
        {children}
      </section>
    </main>
  );
}

export function Input({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <input
        className="focus-ring mt-1 w-full rounded border border-line px-3 py-2"
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
