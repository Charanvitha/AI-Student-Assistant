import React from 'react';
export default function Card({ title, action, children }) {
  return (
    <section className="rounded border border-line bg-white p-5 shadow-sm">
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
