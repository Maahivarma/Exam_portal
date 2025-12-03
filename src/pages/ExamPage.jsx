import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExamContext } from "../context/ExamContext";
import QuestionCard from "../components/QuestionCard";
import { COMPANY_LOGOS } from "../data/tests";

function formatTime(sec) {
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

// Pre-exam instructions modal
function PreExamModal({ test, onStart }) {
  const [agreed, setAgreed] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    async function testMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraReady(true);
        setAudioReady(true);
      } catch (err) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraReady(true);
        } catch (e) {
          setCameraReady(false);
        }
      }
    }
    testMedia();
    
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)'
    }}>
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto border border-white/20">
        {/* Header */}
        <div className="relative p-8 rounded-t-3xl overflow-hidden" style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)'
        }}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 w-20 h-20 bg-white/30 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 right-4 w-32 h-32 bg-pink-300/30 rounded-full blur-xl"></div>
          </div>
          <div className="relative flex items-center gap-5">
            <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-lg">
              <img 
                src={COMPANY_LOGOS[test.id.split("-")[0]]} 
                alt="logo" 
                className="w-14 h-14 object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div className="text-white">
              <h2 className="text-3xl font-bold">{test.title}</h2>
              <p className="text-white/80 mt-1">{test.questions.length} Questions • {test.duration_minutes} Minutes</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-8 space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
            <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📋</span> Exam Instructions
            </h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm">✓</span>
                <span>The exam runs in <strong className="text-indigo-700">fullscreen mode</strong>. Do not exit fullscreen.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm">✓</span>
                <span><strong className="text-indigo-700">Webcam & microphone</strong> will be active for proctoring.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm">✓</span>
                <span><strong className="text-indigo-700">Face detection</strong> monitors your presence. Stay visible!</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm">✓</span>
                <span><strong className="text-indigo-700">Noise detection</strong> monitors background sounds.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center text-white text-sm">✓</span>
                <span><strong className="text-indigo-700">Only YOU</strong> should be visible. Multiple faces = violation!</span>
              </li>
            </ul>
          </div>

          {/* Camera & Audio Preview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-4 border border-cyan-100">
              <h4 className="text-sm font-bold text-cyan-800 mb-3 flex items-center gap-2">
                <span>📷</span> Camera Check
              </h4>
              <div className="relative">
                <div className="w-full aspect-video bg-slate-900 rounded-xl overflow-hidden">
                  <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                </div>
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                  cameraReady ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {cameraReady ? '● Live' : '○ Off'}
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 rounded-2xl p-4 border border-fuchsia-100">
              <h4 className="text-sm font-bold text-fuchsia-800 mb-3 flex items-center gap-2">
                <span>🎤</span> Microphone Check
              </h4>
              <div className="space-y-3">
                <div className={`p-4 rounded-xl ${audioReady ? 'bg-green-100' : 'bg-amber-100'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-4 h-4 rounded-full ${audioReady ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></span>
                    <span className={`font-medium ${audioReady ? 'text-green-700' : 'text-amber-700'}`}>
                      {audioReady ? 'Microphone Active' : 'Audio Optional'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Background noise will be monitored during the exam</p>
              </div>
            </div>
          </div>

          {/* Agreement */}
          <label className="flex items-start gap-4 p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.01]" style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: '2px solid #fbbf24'
          }}>
            <input 
              type="checkbox" 
              checked={agreed} 
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-6 h-6 accent-amber-600 rounded"
            />
            <span className="text-amber-900 font-medium">
              I understand the exam rules and agree to be proctored. I confirm that I am alone and will not use any unfair means during this examination.
            </span>
          </label>

          {/* Start Button */}
          <button
            onClick={onStart}
            disabled={!agreed || !cameraReady}
            className={`w-full py-5 rounded-2xl font-bold text-xl transition-all transform ${
              agreed && cameraReady
                ? "text-white shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
            style={agreed && cameraReady ? {
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)'
            } : {}}
          >
            {!cameraReady ? "⏳ Checking Camera..." : !agreed ? "✋ Please Accept Terms" : "🚀 Start Exam"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Results Modal Component
function ResultsModal({ result, onClose, onGoHome }) {
  if (!result) return null;

  const getScoreGradient = (score) => {
    if (score >= 80) return "from-emerald-400 via-green-500 to-teal-500";
    if (score >= 60) return "from-blue-400 via-indigo-500 to-purple-500";
    if (score >= 40) return "from-amber-400 via-orange-500 to-red-400";
    return "from-red-400 via-rose-500 to-pink-500";
  };

  const getGrade = (score) => {
    if (score >= 90) return { grade: "A+", label: "Outstanding!", emoji: "🏆" };
    if (score >= 80) return { grade: "A", label: "Excellent!", emoji: "🌟" };
    if (score >= 70) return { grade: "B", label: "Very Good", emoji: "👏" };
    if (score >= 60) return { grade: "C", label: "Good", emoji: "👍" };
    if (score >= 50) return { grade: "D", label: "Pass", emoji: "✅" };
    return { grade: "F", label: "Needs Work", emoji: "📚" };
  };

  const gradeInfo = getGrade(result.overallScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto" style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)'
    }}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden">
        {/* Header with Score */}
        <div className={`p-10 text-white relative overflow-hidden bg-gradient-to-r ${getScoreGradient(result.overallScore)}`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white/20 rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative text-center">
            <div className="text-6xl mb-4">{gradeInfo.emoji}</div>
            <h2 className="text-4xl font-bold mb-2">Exam Completed!</h2>
            <p className="text-white/80 text-lg">{result.testTitle}</p>
            
            <div className="mt-8 flex items-center justify-center gap-10">
              <div className="text-center">
                <div className="text-8xl font-black">{result.overallScore}%</div>
                <div className="text-white/80 mt-2 text-lg">Overall Score</div>
              </div>
              <div className="text-center">
                <div className="w-28 h-28 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border-4 border-white/30">
                  <span className="text-5xl font-black">{gradeInfo.grade}</span>
                </div>
                <div className="text-white/80 mt-3 text-lg font-medium">{gradeInfo.label}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6 max-h-[55vh] overflow-auto">
          {/* Score Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: `${result.mcq.percent}%`, label: "MCQ Score", sub: `${result.mcq.correct}/${result.mcq.total}`, gradient: "from-blue-500 to-cyan-500" },
              { value: `${result.subjectiveAvg}%`, label: "Subjective", sub: "Average", gradient: "from-purple-500 to-pink-500" },
              { value: `${result.answeredQuestions}/${result.totalQuestions}`, label: "Answered", sub: "Questions", gradient: "from-amber-500 to-orange-500" },
              { value: formatTime(result.timeSpent), label: "Time Used", sub: `of ${formatTime(result.totalTime)}`, gradient: "from-emerald-500 to-teal-500" }
            ].map((item, idx) => (
              <div key={idx} className={`rounded-2xl p-5 text-white bg-gradient-to-br ${item.gradient}`}>
                <div className="text-3xl font-bold">{item.value}</div>
                <div className="text-white/90 text-sm font-medium mt-1">{item.label}</div>
                <div className="text-white/70 text-xs">{item.sub}</div>
              </div>
            ))}
          </div>

          {/* Proctoring Summary */}
          <div className="rounded-2xl p-6" style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)'
          }}>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🔒</span> Proctoring Summary
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { value: result.proctorSummary.tabSwitches, label: "Tab Switches", bad: result.proctorSummary.tabSwitches > 0 },
                { value: result.proctorSummary.violations, label: "Violations", bad: result.proctorSummary.violations > 0 },
                { value: result.proctorSummary.noFaceAlerts || 0, label: "No Face", bad: (result.proctorSummary.noFaceAlerts || 0) > 0 },
                { value: result.proctorSummary.multipleFaceAlerts || 0, label: "Multi Face", bad: (result.proctorSummary.multipleFaceAlerts || 0) > 0 },
                { value: result.proctorSummary.noiseAlerts || 0, label: "Noise Alerts", bad: (result.proctorSummary.noiseAlerts || 0) > 5 },
                { value: result.proctorSummary.snapshotsTaken, label: "Snapshots", bad: false }
              ].map((item, idx) => (
                <div key={idx} className={`text-center p-3 rounded-xl ${item.bad ? 'bg-red-100' : 'bg-white'}`}>
                  <div className={`text-2xl font-bold ${item.bad ? 'text-red-600' : 'text-slate-700'}`}>{item.value}</div>
                  <div className="text-xs text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">💡</span> Personalized Suggestions
            </h3>
            <div className="space-y-3">
              {result.suggestions.map((suggestion, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border-l-4 ${
                    suggestion.type === "critical" ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-500" :
                    suggestion.type === "warning" ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-500" :
                    suggestion.type === "improvement" ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500" :
                    suggestion.type === "positive" ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-500" :
                    "bg-gradient-to-r from-slate-50 to-gray-50 border-slate-400"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{suggestion.icon}</span>
                    <div>
                      <div className="font-bold text-slate-800">{suggestion.title}</div>
                      <div className="text-sm text-slate-600 mt-1">{suggestion.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-slate-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-500">
              Submitted at {new Date(result.submittedAt).toLocaleString()}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 text-slate-700 bg-slate-200 rounded-xl font-bold hover:bg-slate-300 transition-all"
              >
                View Details
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (onGoHome) onGoHome();
                }}
                className="px-8 py-3 text-white rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                }}
              >
                🏠 Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Warning Toast Component
function WarningToast({ message, count, type }) {
  const getBg = () => {
    if (type === 'no-face') return 'from-orange-500 to-red-500';
    if (type === 'multiple-faces') return 'from-rose-500 to-pink-600';
    if (type === 'high-noise') return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-rose-600';
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] animate-bounce">
      <div className={`bg-gradient-to-r ${getBg()} text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4`}>
        <span className="text-3xl">⚠️</span>
        <div>
          <div className="font-bold text-lg">{message}</div>
          <div className="text-sm text-white/80">Warning {count}/5 - Multiple violations may terminate exam</div>
        </div>
      </div>
    </div>
  );
}

// Face Status Indicator
function FaceStatusIndicator({ status, faceCount }) {
  const getConfig = () => {
    switch (status) {
      case 'ok':
        return { bg: 'bg-green-500', text: '✓ Face OK', color: 'text-green-400' };
      case 'no-face':
        return { bg: 'bg-red-500 animate-pulse', text: '✗ No Face!', color: 'text-red-400' };
      case 'multiple-faces':
        return { bg: 'bg-orange-500 animate-pulse', text: `⚠ ${faceCount} Faces!`, color: 'text-orange-400' };
      default:
        return { bg: 'bg-slate-500', text: '? Checking', color: 'text-slate-400' };
    }
  };
  
  const config = getConfig();
  
  return (
    <div className={`px-3 py-1.5 rounded-full text-xs font-bold text-white ${config.bg}`}>
      {config.text}
    </div>
  );
}

// Noise Level Meter
function NoiseMeter({ level }) {
  const getColor = () => {
    if (level < 30) return 'bg-green-500';
    if (level < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400">🔊</span>
      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-200 ${getColor()}`}
          style={{ width: `${Math.min(100, level)}%` }}
        ></div>
      </div>
      <span className={`text-xs font-medium ${level > 60 ? 'text-red-400' : 'text-slate-400'}`}>
        {level}
      </span>
    </div>
  );
}

export default function ExamPage() {
  const navigate = useNavigate();
  const {
    test,
    selectedTestId,
    currentIndex,
    setCurrentIndex,
    answers,
    setAnswer,
    marksForReview,
    toggleMark,
    running,
    remaining,
    startTest,
    captureSnapshotFromVideo,
    submitTest,
    proctorState,
    requestFullscreen,
    examResult,
    showResult,
    closeResult
  } = useContext(ExamContext);

  const videoRef = useRef(null);
  const [showPreExam, setShowPreExam] = useState(true);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningType, setWarningType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastWarningCount = useRef(0);

  useEffect(() => {
    if (!selectedTestId) {
      setShowPreExam(true);
    }
  }, [selectedTestId]);

  // Show warning when violations occur
  useEffect(() => {
    if (proctorState.warningCount > lastWarningCount.current && running) {
      lastWarningCount.current = proctorState.warningCount;
      const lastViolation = proctorState.violations[proctorState.violations.length - 1];
      setWarningMessage(lastViolation?.message || "Suspicious activity detected");
      setWarningType(lastViolation?.type || "");
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 4000);
    }
  }, [proctorState.warningCount, proctorState.violations, running]);

  // Continuous face detection during exam
  useEffect(() => {
    if (!running || !videoRef.current) return;
    
    const faceCheckInterval = setInterval(() => {
      captureSnapshotFromVideo(videoRef.current);
    }, 5000); // Check every 5 seconds
    
    return () => clearInterval(faceCheckInterval);
  }, [running, captureSnapshotFromVideo]);

  if (!selectedTestId || !test) return null;

  // Show results if exam is submitted
  if (showResult && examResult) {
    return <ResultsModal result={examResult} onClose={closeResult} onGoHome={() => navigate("/")} />;
  }

  // Show pre-exam modal if not started
  if (showPreExam && !running) {
    const handleStart = async () => {
      setShowPreExam(false);
      await requestFullscreen();
      setTimeout(() => {
        startTest(videoRef.current);
      }, 500);
    };
    return <PreExamModal test={test} onStart={handleStart} />;
  }

  const q = test.questions[currentIndex];
  const isLowTime = remaining < 300;
  const isCriticalTime = remaining < 60;

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (window.confirm("Are you sure you want to submit? This cannot be undone.")) {
      setIsSubmitting(true);
      try {
        await submitTest();
      } catch (error) {
        console.error("Submit error:", error);
        alert("Submission complete!");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-40" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)'
    }}>
      {/* Warning Toast */}
      {showWarning && (
        <WarningToast message={warningMessage} count={proctorState.warningCount} type={warningType} />
      )}

      {/* Colorful Top Bar */}
      <div className="h-16 flex items-center justify-between px-6" style={{
        background: 'linear-gradient(90deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.3) 50%, rgba(217,70,239,0.3) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
            }}>
              <img 
                src={COMPANY_LOGOS[test.id.split("-")[0]]} 
                alt="logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div>
              <div className="text-white font-bold">{test.title}</div>
              <div className="text-purple-300 text-xs">{test.description}</div>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className={`px-8 py-2.5 rounded-2xl font-mono text-2xl font-black ${
          isCriticalTime ? "animate-pulse" : ""
        }`} style={{
          background: isCriticalTime 
            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
            : isLowTime 
              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white'
        }}>
          ⏱️ {formatTime(remaining)}
        </div>

        {/* Status */}
        <div className="flex items-center gap-4">
          <FaceStatusIndicator 
            status={proctorState.faceStatus} 
            faceCount={proctorState.snapshots[proctorState.snapshots.length - 1]?.faces || 0} 
          />
          <div className="text-purple-300 text-sm font-medium">
            Q: {currentIndex + 1}/{test.questions.length}
          </div>
          <div className="text-emerald-400 text-sm font-medium">
            ✓ {Object.keys(answers).length} answered
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-[calc(100vh-64px)] flex">
        {/* Left Sidebar */}
        <div className="w-80 p-4 flex flex-col gap-4" style={{
          background: 'rgba(15,23,42,0.5)',
          borderRight: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* Webcam */}
          <div className="rounded-2xl overflow-hidden" style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.2) 100%)',
            border: '2px solid rgba(139,92,246,0.3)'
          }}>
            <div className="px-4 py-2 flex items-center justify-between" style={{
              background: 'linear-gradient(90deg, rgba(239,68,68,0.3) 0%, rgba(217,70,239,0.3) 100%)'
            }}>
              <span className="text-white text-sm font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                📷 LIVE PROCTORING
              </span>
              <FaceStatusIndicator 
                status={proctorState.faceStatus} 
                faceCount={proctorState.snapshots[proctorState.snapshots.length - 1]?.faces || 0}
              />
            </div>
            <div className="aspect-video bg-black relative">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              />
              {proctorState.faceStatus === 'no-face' && (
                <div className="absolute inset-0 border-4 border-red-500 animate-pulse rounded-lg"></div>
              )}
              {proctorState.faceStatus === 'multiple-faces' && (
                <div className="absolute inset-0 border-4 border-orange-500 animate-pulse rounded-lg"></div>
              )}
            </div>
          </div>

          {/* Noise Level */}
          <div className="rounded-2xl p-4" style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(5,150,105,0.1) 100%)',
            border: '1px solid rgba(16,185,129,0.3)'
          }}>
            <div className="text-emerald-400 text-xs font-bold mb-2">🎤 NOISE LEVEL</div>
            <NoiseMeter level={proctorState.noiseLevel || 0} />
            {proctorState.noiseLevel > 60 && (
              <div className="mt-2 text-xs text-red-400 animate-pulse">⚠️ High noise detected!</div>
            )}
          </div>

          {/* Progress */}
          <div className="rounded-2xl p-4" style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)',
            border: '1px solid rgba(139,92,246,0.3)'
          }}>
            <div className="text-purple-400 text-xs font-bold mb-3">📊 PROGRESS</div>
            <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(139,92,246,0.2)' }}>
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${((currentIndex + 1) / test.questions.length) * 100}%`,
                  background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)'
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-2">
              <span className="text-purple-300">Question {currentIndex + 1}</span>
              <span className="text-purple-300">{test.questions.length} total</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 rounded-2xl p-4" style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(217,119,6,0.1) 100%)',
            border: '1px solid rgba(245,158,11,0.3)'
          }}>
            <div className="text-amber-400 text-xs font-bold mb-3">📈 SESSION STATS</div>
            <div className="space-y-2 text-sm">
              {[
                { label: "Answered", value: Object.keys(answers).length, color: "text-green-400" },
                { label: "Unanswered", value: test.questions.length - Object.keys(answers).length, color: "text-slate-400" },
                { label: "Marked", value: Object.values(marksForReview).filter(Boolean).length, color: "text-amber-400" },
                { label: "Tab Switches", value: proctorState.tabSwitchCount, color: proctorState.tabSwitchCount > 0 ? "text-red-400" : "text-green-400" },
                { label: "No Face", value: proctorState.noFaceCount || 0, color: proctorState.noFaceCount > 0 ? "text-red-400" : "text-green-400" },
                { label: "Multi Face", value: proctorState.multipleFaceCount || 0, color: proctorState.multipleFaceCount > 0 ? "text-orange-400" : "text-green-400" }
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-slate-400">{item.label}</span>
                  <span className={`font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Question Area */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-3xl mx-auto">
            {/* Question Card */}
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              {/* Question Header */}
              <div className="p-5 flex items-center justify-between" style={{
                background: 'linear-gradient(90deg, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.3) 50%, rgba(217,70,239,0.3) 100%)'
              }}>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 rounded-xl text-white font-bold" style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  }}>
                    Q{currentIndex + 1}
                  </span>
                  <span className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
                    q.type === "mcq" 
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                      : "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                  }`}>
                    {q.type.toUpperCase()}
                  </span>
                  {marksForReview[q.id] && (
                    <span className="bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl text-sm border border-amber-500/30">
                      📌 Marked
                    </span>
                  )}
                </div>
                {answers[q.id] && (
                  <span className="text-emerald-400 font-bold">✓ Answered</span>
                )}
              </div>

              {/* Question Content */}
              <div className="p-8">
                <h3 className="text-2xl text-white font-medium mb-8 leading-relaxed">{q.text}</h3>
                <QuestionCard q={q} value={answers[q.id]} onChange={(v) => setAnswer(q.id, v)} />
              </div>

              {/* Navigation */}
              <div className="p-5 flex items-center justify-between" style={{
                background: 'rgba(15,23,42,0.5)',
                borderTop: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                      currentIndex === 0 
                        ? "bg-slate-700/50 text-slate-500 cursor-not-allowed" 
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    }`}
                  >
                    ← Previous
                  </button>
                  <button 
                    onClick={() => setCurrentIndex(Math.min(test.questions.length - 1, currentIndex + 1))}
                    disabled={currentIndex === test.questions.length - 1}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                      currentIndex === test.questions.length - 1
                        ? "bg-slate-700/50 text-slate-500 cursor-not-allowed" 
                        : "text-white"
                    }`}
                    style={currentIndex !== test.questions.length - 1 ? {
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                    } : {}}
                  >
                    Next →
                  </button>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => toggleMark(q.id)}
                    className={`px-5 py-3 rounded-xl font-bold transition-all ${
                      marksForReview[q.id] 
                        ? "text-white" 
                        : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20"
                    }`}
                    style={marksForReview[q.id] ? {
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    } : {}}
                  >
                    {marksForReview[q.id] ? "📌 Marked" : "Mark for Review"}
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-xl font-bold text-white transition-all ${
                      isSubmitting ? 'opacity-70 cursor-wait' : 'hover:shadow-lg hover:shadow-red-500/30'
                    }`}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                    }}
                  >
                    {isSubmitting ? '⏳ Submitting...' : '🏁 Submit Exam'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
