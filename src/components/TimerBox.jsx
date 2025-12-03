import React, { useContext } from "react";
import { ExamContext } from "../context/ExamContext";

function fmt(sec){
  const mm = String(Math.floor(sec/60)).padStart(2,"0");
  const ss = String(sec%60).padStart(2,"0");
  return `${mm}:${ss}`;
}

export default function TimerBox(){
  const { remaining, running } = useContext(ExamContext);
  return (
    <div className="card-neon p-4 text-center">
      <div className="text-xs text-slate-300">Time Remaining</div>
      <div className="text-3xl font-mono font-semibold mt-2">{fmt(remaining)}</div>
      <div className="text-xs text-slate-400 mt-1">{running ? "Running" : "Not started"}</div>
    </div>
  );
}
