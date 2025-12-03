import React, { useContext } from "react";
import { ExamContext } from "../context/ExamContext";

export default function TestListPage(){
  const { companies, selectTest } = useContext(ExamContext);

  return (
    <div className="grid grid-cols-3 gap-6">
      <aside className="col-span-1">
        <div className="card-neon p-4">
          <h3 className="font-semibold mb-3">Companies</h3>
          <ul className="space-y-3">
            {companies.map(c=>(
              <li key={c.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-slate-400">{c.tests.length} tests</div>
                </div>
                <div>
                  <button className="px-3 py-1 neon-btn text-black rounded" onClick={()=>selectTest(c.id, c.tests[0].id)}>Open</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="col-span-2">
        <div className="card-neon p-6">
          <h2 className="text-xl font-semibold">Featured tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {companies.flatMap(c => c.tests.map(t => ({...t, company:c}))).map(t => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-[#07124a]/20 via-[#04202d]/6 to-[#3b0a2c]/6 border border-white/5">
                <div>
                  <div className="font-medium text-white">{t.title}</div>
                  <div className="text-xs text-slate-300">{t.company.name} • {t.duration_minutes} min</div>
                </div>
                <div>
                  <button className="px-4 py-2 neon-btn text-black rounded" onClick={()=>selectTest(t.company.id, t.id)}>Start</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
