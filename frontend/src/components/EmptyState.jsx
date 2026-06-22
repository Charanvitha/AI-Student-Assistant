import React from 'react';
export default function EmptyState({ title, text }) {
  return (
    <div className="rounded border border-dashed border-line bg-slate-50 p-6 text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
}
