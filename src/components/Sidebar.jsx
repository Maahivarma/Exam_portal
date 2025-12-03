import React from "react";

export default function Sidebar({ questions, answers, marks, onJump }) {
  return (
    <div>
      <div className="mb-4 text-sm text-gray-600">Questions</div>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, i) => {
          const answered = !!answers[q.id];
          const cls = answered ? "bg-green-200" : "bg-gray-200";
          const review = marks[q.id] ? "ring-2 ring-yellow-300" : "";

          return (
            <button
              key={q.id}
              onClick={() => onJump(i)}
              className={`p-2 rounded ${cls} ${review}`}
              title={q.text}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
