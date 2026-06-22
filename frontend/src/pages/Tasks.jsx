import React from 'react';
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Card from '../components/Card.jsx';
import { api } from '../lib/api.js';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [ai, setAi] = useState(null);
  const [form, setForm] = useState({ title: '', deadline: '' });

  async function load() {
    const { data } = await api.get('/tasks');
    setTasks(data.tasks);
    setAi(data.ai);
  }

  useEffect(() => {
    load();
  }, []);

  async function create(event) {
    event.preventDefault();
    await api.post('/tasks', { ...form, deadline: new Date(form.deadline).toISOString() });
    setForm({ title: '', deadline: '' });
    load();
  }

  async function remove(id) {
    await api.delete(`/tasks/${id}`);
    load();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <Card title="Add assignment or exam">
        <form onSubmit={create} className="space-y-4">
          <input className="focus-ring w-full rounded border border-line px-3 py-2" placeholder="Task title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          <input className="focus-ring w-full rounded border border-line px-3 py-2" type="datetime-local" value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} />
          <button className="focus-ring inline-flex items-center gap-2 rounded bg-ink px-4 py-2 font-medium text-white">
            <Plus size={18} />
            Add task
          </button>
        </form>
        <div className="mt-5 space-y-2">
          {(ai?.reminders || []).map((item) => <p key={item} className="rounded bg-slate-50 p-2 text-sm">{item}</p>)}
        </div>
      </Card>
      <Card title="AI prioritized queue">
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task._id} className="flex items-center justify-between gap-3 rounded border border-line p-3">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-sm text-slate-500">{new Date(task.deadline).toLocaleString()} · {task.priority}</p>
              </div>
              <button aria-label="Delete task" onClick={() => remove(task._id)} className="focus-ring rounded border border-line p-2 text-coral">
                <Trash2 size={17} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
