import React, { useContext, useRef } from "react";
import Webcam from "react-webcam";
import { ExamContext } from "../context/ExamContext";

export default function ProctorBox(){
  const webcamRef = useRef(null);
  const { captureSnapshot } = useContext(ExamContext);

  function snap(){
    if(!webcamRef.current) return;
    const img = webcamRef.current.getScreenshot();
    if(img) captureSnapshot(img);
  }

  return (
    <div className="card-neon p-4">
      <div className="text-sm text-slate-300 mb-2">Proctor</div>
      <div className="w-full h-36 rounded overflow-hidden bg-white/5">
        <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full h-full object-cover" />
      </div>
      <div className="mt-3 flex gap-2 items-center">
        <button onClick={snap} className="px-3 py-1 bg-white/5 rounded">Snapshot</button>
        <div className="text-xs text-slate-400">Snapshots are saved locally</div>
      </div>
    </div>
  );
}
