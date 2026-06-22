import React from 'react';
import { useState } from 'react';
import { Send } from 'lucide-react';
import Card from '../components/Card.jsx';
import { api } from '../lib/api.js';

export default function Copilot() {
  const [message, setMessage] = useState('How can I become a Full Stack Developer while managing assignments?');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  async function send(event) {
    event.preventDefault();
    if (!message.trim()) return;
    const next = [...history, { role: 'user', content: message }];
    setHistory(next);
    setMessage('');
    setLoading(true);
    try {
      const { data } = await api.post('/copilot/chat', { message, history: next });
      setHistory([...next, { role: 'assistant', content: data.answer, meta: data }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card title="AI copilot chat">
        <div className="min-h-[420px] space-y-3">
          {history.map((item, index) => (
            <div key={`${item.role}-${index}`} className={`rounded p-3 text-sm ${item.role === 'user' ? 'ml-auto max-w-[80%] bg-ink text-white' : 'mr-auto max-w-[85%] bg-slate-100'}`}>
              {item.content}
            </div>
          ))}
          {loading && <p className="text-sm text-slate-500">Coordinating agents...</p>}
        </div>
        <form onSubmit={send} className="mt-4 flex gap-3">
          <input className="focus-ring flex-1 rounded border border-line px-3 py-2" value={message} onChange={(event) => setMessage(event.target.value)} />
          <button className="focus-ring inline-flex items-center gap-2 rounded bg-ink px-4 py-2 font-medium text-white">
            <Send size={18} />
            Send
          </button>
        </form>
      </Card>
    </div>
  );
}
