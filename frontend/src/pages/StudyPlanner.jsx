import React from 'react';
import { useState } from 'react';
import Card from '../components/Card.jsx';
import { api } from '../lib/api.js';

export default function StudyPlanner() {
  const [subjects, setSubjects] = useState('Data Structures, DBMS, Operating Systems');
  const [hours, setHours] = useState(10);
  const [plan, setPlan] = useState(null);

  async function generate() {
    const { data } = await api.post('/study/generate', {
      subjects: subjects.split(',').map((item) => item.trim()).filter(Boolean),
      hoursPerWeek: Number(hours)
    });
    setPlan(data);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <Card title="Adaptive study planner">
        <div className="space-y-4">
          <label className="block text-sm font-medium">
            Subjects
            <textarea className="focus-ring mt-1 min-h-28 w-full rounded border border-line px-3 py-2" value={subjects} onChange={(event) => setSubjects(event.target.value)} />
          </label>
          <label className="block text-sm font-medium">
            Hours per week
            <input className="focus-ring mt-1 w-full rounded border border-line px-3 py-2" type="number" value={hours} onChange={(event) => setHours(event.target.value)} />
          </label>
          <button onClick={generate} className="focus-ring rounded bg-ink px-4 py-2 font-medium text-white">Generate plan</button>
        </div>
      </Card>
      <Card title="AI schedule">
        <div className="space-y-3">
          {(plan?.schedule || []).map((day) => (
            <div key={day.day} className="rounded border border-line p-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">{day.day}: {day.focus}</p>
                <span className="text-sm text-slate-500">{day.hours}h</span>
              </div>
              <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
                {day.tasks.map((task) => <li key={task}>{task}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
