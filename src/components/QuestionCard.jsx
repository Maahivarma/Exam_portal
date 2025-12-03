import React from "react";

export default function QuestionCard({ q, value, onChange }) {
  if (!q) return null;

  if (q.type === "mcq") {
    const gradients = [
      "from-indigo-500 to-purple-500",
      "from-purple-500 to-pink-500",
      "from-pink-500 to-rose-500",
      "from-cyan-500 to-blue-500"
    ];

    return (
      <div className="space-y-4">
        {q.options.map((opt, idx) => (
          <label 
            key={opt.id} 
            className={`flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all transform hover:scale-[1.01] ${
              value === opt.id 
                ? "text-white shadow-lg" 
                : "text-slate-300 hover:bg-white/5"
            }`}
            style={value === opt.id ? {
              background: `linear-gradient(135deg, rgba(99,102,241,0.4) 0%, rgba(139,92,246,0.4) 100%)`,
              border: '2px solid rgba(139,92,246,0.6)'
            } : {
              background: 'rgba(255,255,255,0.05)',
              border: '2px solid rgba(255,255,255,0.1)'
            }}
          >
            <div 
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg`}
              style={{
                background: value === opt.id 
                  ? `linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)`
                  : `linear-gradient(135deg, rgba(100,116,139,0.5) 0%, rgba(71,85,105,0.5) 100%)`
              }}
            >
              {String.fromCharCode(65 + idx)}
            </div>
            <input 
              type="radio" 
              name={q.id} 
              checked={value === opt.id} 
              onChange={() => onChange(opt.id)} 
              className="hidden" 
            />
            <span className="flex-1 text-lg">{opt.text}</span>
            {value === opt.id && (
              <span className="text-2xl">✓</span>
            )}
          </label>
        ))}
      </div>
    );
  }

  return (
    <div>
      <textarea 
        value={value || ""} 
        onChange={(e) => onChange(e.target.value)} 
        rows={10} 
        className="w-full p-5 rounded-2xl text-white placeholder-slate-500 focus:outline-none resize-none transition-all text-lg"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '2px solid rgba(139,92,246,0.3)',
        }}
        onFocus={(e) => {
          e.target.style.border = '2px solid rgba(139,92,246,0.6)';
          e.target.style.boxShadow = '0 0 20px rgba(139,92,246,0.2)';
        }}
        onBlur={(e) => {
          e.target.style.border = '2px solid rgba(139,92,246,0.3)';
          e.target.style.boxShadow = 'none';
        }}
        placeholder="Type your detailed answer here..."
      />
      <div className="flex items-center justify-between mt-4">
        <span className="text-purple-300 text-sm flex items-center gap-2">
          <span className="text-lg">💡</span> Write comprehensive answers with examples for better scores
        </span>
        <span className="px-3 py-1 rounded-full text-sm font-medium" style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(217,70,239,0.2) 100%)',
          color: '#c4b5fd'
        }}>
          {(value || "").length} chars
        </span>
      </div>
    </div>
  );
}
