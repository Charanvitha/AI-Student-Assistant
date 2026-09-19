import React from 'react';
import { useState } from 'react';
import { ExternalLink, Search } from 'lucide-react';
import Card from '../components/Card.jsx';
import { api } from '../lib/api.js';

export default function Opportunities() {
  const [query, setQuery] = useState('Find AI internships for beginners');
  const [results, setResults] = useState([]);

  async function search() {
    const { data } = await api.get('/opportunities/search', { params: { q: query } });
    setResults(data.results);
  }

  return (
    <div className="space-y-5">
      <Card title="Intelligent semantic search">
        <div className="flex flex-col gap-3 md:flex-row">
          <input className="focus-ring flex-1 rounded border border-line px-3 py-2" value={query} onChange={(event) => setQuery(event.target.value)} />
          <button onClick={search} className="focus-ring inline-flex items-center justify-center gap-2 rounded bg-ink px-4 py-2 font-medium text-white">
            <Search size={18} />
            Search
          </button>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {results.map((item) => {
          const url = item.url || fallbackUrl(item);
          return (
            <a
              key={item.title}
              className="focus-ring block rounded border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-mint hover:shadow-md"
              href={url}
              target="_blank"
              rel="noreferrer"
              title={`Open ${item.title}`}
            >
              <span className="rounded bg-slate-100 px-2 py-1 text-xs uppercase">{item.type}</span>
              <div className="mt-3 flex items-start justify-between gap-3">
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <ExternalLink className="mt-0.5 shrink-0 text-mint" size={17} />
              </div>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
              <p className="mt-4 text-xs text-slate-500">Similarity {Number(item.score || 0).toFixed(2)}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function fallbackUrl(item) {
  const title = item.title?.toLowerCase() || '';
  if (title.includes('frontend')) return 'https://internshala.com/internships/front-end-development-internship/';
  if (title.includes('ai intern') || item.type === 'internship') return 'https://internshala.com/internships/artificial-intelligence-ai-internship/';
  if (title.includes('devops')) return 'https://roadmap.sh/devops';
  if (title.includes('data scientist')) return 'https://roadmap.sh/ai-data-scientist';
  if (item.type === 'hackathon') return 'https://devpost.com/hackathons';
  return 'https://roadmap.sh/full-stack';
}
