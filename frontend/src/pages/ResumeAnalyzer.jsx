import React from 'react';
import { useState } from 'react';
import Card from '../components/Card.jsx';
import { api } from '../lib/api.js';

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [status, setStatus] = useState('');

  async function upload() {
    const body = new FormData();
    body.append('resume', file);
    const { data } = await api.post('/resume/upload', body);
    setResumeId(data.resumeId);
    setStatus('Resume text extracted. Run analysis next.');
  }

  async function analyze() {
    const { data } = await api.post('/resume/analyze', { resumeId });
    setAnalysis(data.analysis);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <Card title="Resume upload">
        <div className="space-y-4">
          <input className="focus-ring w-full rounded border border-line px-3 py-2" type="file" accept="application/pdf" onChange={(event) => setFile(event.target.files[0])} />
          <div className="flex gap-3">
            <button disabled={!file} onClick={upload} className="focus-ring rounded bg-ink px-4 py-2 font-medium text-white disabled:opacity-40">Upload</button>
            <button disabled={!resumeId} onClick={analyze} className="focus-ring rounded border border-line px-4 py-2 font-medium disabled:opacity-40">Analyze</button>
          </div>
          <p className="text-sm text-slate-500">{status}</p>
        </div>
      </Card>
      <Card title="Resume intelligence">
        {analysis ? (
          <div className="space-y-4">
            <p className="text-3xl font-semibold">{analysis.score}/100</p>
            <Info title="Strengths" items={analysis.strengths} />
            <Info title="Missing skills" items={analysis.missingSkills} />
            <Info title="Suggestions" items={analysis.suggestions} />
            <Info title="Project ideas" items={analysis.projects} />
          </div>
        ) : (
          <p className="text-sm text-slate-500">Upload and analyze a PDF resume to see skill gaps and project suggestions.</p>
        )}
      </Card>
    </div>
  );
}

function Info({ title, items = [] }) {
  return (
    <div>
      <p className="font-medium">{title}</p>
      <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}
