import React from 'react';
import { useEffect, useState } from 'react';
import { ArrowRight, Calendar, CheckCircle2, Search, Sparkles } from 'lucide-react';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { api } from '../lib/api.js';
import { useAuth } from '../state/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [brief, setBrief] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/tasks').then(({ data }) => setTasks(data.tasks)),
      api.post('/copilot/orchestrate', { intent: 'daily student brief' }).then(({ data }) => setBrief(data))
    ]).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded border border-line bg-ink p-6 text-white">
        <p className="text-sm text-white/70">Good to see you, {user?.name}</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold">Your agents are coordinating academics, deadlines, resume gaps, and career moves.</h1>
      </section>
      <div className="grid gap-4 md:grid-cols-4">
        <Metric label="Open tasks" value={tasks.filter((task) => task.status !== 'done').length} icon={Calendar} />
        <Metric label="AI agents" value="4" icon={Sparkles} />
        <Metric label="Career goal" value={user?.careerGoal || 'Set'} icon={ArrowRight} />
        <Metric label="Skills tracked" value={user?.skills?.length || 0} icon={CheckCircle2} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card title="Upcoming deadlines">
          {tasks.length ? (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <div key={task._id} className="flex items-center justify-between rounded border border-line px-3 py-2">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-slate-500">{new Date(task.deadline).toLocaleDateString()}</p>
                  </div>
                  <span className="rounded bg-slate-100 px-2 py-1 text-xs">{task.priority}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No deadlines yet" text="Add assignments and exams to unlock AI prioritization." />
          )}
        </Card>
        <Card title="Unified agent recommendations">
          <div className="space-y-3">
            {(brief?.unifiedNextActions || []).map((item) => (
              <div key={item} className="flex gap-3 rounded bg-slate-50 p-3 text-sm">
                <Search className="mt-0.5 shrink-0 text-mint" size={16} />
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value, icon: Icon }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded bg-slate-100 text-mint">
          <Icon size={20} />
        </div>
      </div>
    </Card>
  );
}
