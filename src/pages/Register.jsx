import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Register(){
  const { register, setView } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function doRegister(e){
    e.preventDefault();
    register(username, password);
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card-neon p-6">
        <h2 className="text-2xl font-bold">Create account</h2>
        <p className="text-sm text-slate-300 mt-1">Register for the Exam Portal</p>
        <form className="mt-6" onSubmit={doRegister}>
          <input required value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="w-full p-3 rounded mt-3 bg-transparent border border-white/10" />
          <input required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-3 rounded mt-3 bg-transparent border border-white/10" />
          <div className="flex items-center justify-between mt-4">
            <button className="neon-btn text-white px-4 py-2 rounded">Register</button>
            <button type="button" onClick={()=>setView("login")} className="text-sm text-slate-300">Back to login</button>
          </div>
        </form>
      </div>
    </div>
  );
}
