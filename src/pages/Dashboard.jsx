import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard(){
  const { user, logout } = useContext(AuthContext);
  const last = JSON.parse(localStorage.getItem("last_submission")||"null") || null;

  return (
    <div className="mb-6 grid grid-cols-3 gap-6">
      <div className="col-span-1 card-neon p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#06b6d4] to-[#7c3aed] flex items-center justify-center text-black font-bold">{user?.name?.charAt(0)||'U'}</div>
          <div>
            <div className="font-semibold text-white">{user?.name}</div>
            <div className="text-xs text-slate-300">{user?.username}</div>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-300">
          <div>Recent:</div>
          <div className="mt-2">
            {last ? <div>Last MCQ score: {last.mcq?.percent || 0}%</div> : <div>No attempts yet</div>}
          </div>
        </div>

        <div className="mt-4">
          <button onClick={logout} className="px-3 py-1 rounded bg-red-600 text-white">Logout</button>
        </div>
      </div>

      <div className="col-span-2 card-neon p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-400">Welcome back</div>
            <div className="text-lg font-semibold">Start a mock test</div>
          </div>
          <div className="text-sm text-slate-300">Good luck!</div>
        </div>

        <div className="mt-4 text-sm text-slate-300">Your dashboard overview is here — upcoming improvements: leaderboards, analytics, badges.</div>
      </div>
    </div>
  );
}
