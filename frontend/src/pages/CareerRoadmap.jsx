import React from 'react';
import { useState } from 'react';
import Card from '../components/Card.jsx';
import { api } from '../lib/api.js';
import { useAuth } from '../state/AuthContext.jsx';

export default function CareerRoadmap() {
  const { user } = useAuth();
  const [goal, setGoal] = useState(user?.careerGoal || 'Full Stack Developer');
  const [roadmap, setRoadmap] = useState(null);

  async function generate() {
    const { data } = await api.post('/career/roadmap', { goal });
    setRoadmap(data);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.7fr_1.3fr]">
      <Card title="Roadmap generator">
        <div className="space-y-4">
          <select className="focus-ring w-full rounded border border-line px-3 py-2" value={goal} onChange={(event) => setGoal(event.target.value)}>
            <option>Full Stack Developer</option>
            <option>Data Scientist</option>
            <option>AI Engineer</option>
            <option>DevOps Engineer</option>
          </select>
          <button onClick={generate} className="focus-ring rounded bg-ink px-4 py-2 font-medium text-white">Generate roadmap</button>
        </div>
      </Card>
      <Card title={roadmap?.goal || 'Career plan'}>
        <div className="grid gap-3 md:grid-cols-3">
          {(roadmap?.milestones || []).map((phase) => (
            <div key={phase.phase} className="rounded border border-line p-3">
              <p className="font-medium">{phase.phase}</p>
              <p className="mt-2 text-sm text-slate-600">{phase.skills.join(', ')}</p>
              <p className="mt-3 text-sm">{phase.project}</p>
            </div>
          ))}
        </div>
        {roadmap?.missingSkills?.length ? <p className="mt-4 text-sm text-coral">Missing: {roadmap.missingSkills.join(', ')}</p> : null}
      </Card>
    </div>
  );
}
