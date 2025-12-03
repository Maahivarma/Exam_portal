import React from "react";

export default function QuestionPalette({ questions, answers, marks, onJump }){
  return (
    <div className="grid grid-cols-5 gap-2">
      {questions.map((q,i)=> {
        const answered = !!answers[q.id];
        const cls = answered ? "bg-[#16a34a]/80 text-black" : "bg-white/10";
        const review = marks[q.id] ? "ring-2 ring-amber-300" : "";
        return (
          <button key={q.id} onClick={()=>onJump(i)} className={`question-circle ${cls} ${review} text-sm`}>
            {i+1}
          </button>
        );
      })}
    </div>
  );
}
