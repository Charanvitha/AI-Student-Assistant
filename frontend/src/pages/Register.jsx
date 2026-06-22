import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthFrame, Input } from './Login.jsx';
import { useAuth } from '../state/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    skills: 'React, Python',
    interests: 'AI, Web Development',
    careerGoal: 'Full Stack Developer'
  });
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      await register({
        ...form,
        skills: splitList(form.skills),
        interests: splitList(form.interests)
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  }

  return (
    <AuthFrame title="Create your workspace" subtitle="Tell the agents what you are aiming for.">
      <form onSubmit={submit} className="space-y-4">
        <Input label="Name" value={form.name} onChange={(name) => setForm({ ...form, name })} />
        <Input label="Email" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} />
        <Input label="Password" type="password" value={form.password} onChange={(password) => setForm({ ...form, password })} />
        <Input label="Skills" value={form.skills} onChange={(skills) => setForm({ ...form, skills })} />
        <Input label="Interests" value={form.interests} onChange={(interests) => setForm({ ...form, interests })} />
        <label className="block text-sm font-medium">
          Career goal
          <select className="focus-ring mt-1 w-full rounded border border-line px-3 py-2" value={form.careerGoal} onChange={(event) => setForm({ ...form, careerGoal: event.target.value })}>
            <option>Full Stack Developer</option>
            <option>Data Scientist</option>
            <option>AI Engineer</option>
            <option>DevOps Engineer</option>
          </select>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="focus-ring w-full rounded bg-ink px-4 py-3 font-medium text-white">Register</button>
        <p className="text-center text-sm text-slate-500">
          Already registered? <Link className="font-medium text-mint" to="/login">Login</Link>
        </p>
      </form>
    </AuthFrame>
  );
}

function splitList(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}
