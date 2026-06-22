import React from 'react';
import { useState } from 'react';
import { Search } from 'lucide-react';
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
        {results.map((item) => (
          <Card key={item.title}>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs uppercase">{item.type}</span>
            <h3 className="mt-3 font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            <p className="mt-3 text-xs text-slate-500">Similarity {item.score.toFixed(2)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
