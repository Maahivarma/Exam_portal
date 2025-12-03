import React from "react";
export default function TopBar(){
  return (
    <div className="header px-6">
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-xl font-semibold">Exam Portal</div>
          <div className="small-muted">Mock tests platform</div>
        </div>
        <div className="small-muted">Local Demo</div>
      </div>
    </div>
  );
}
