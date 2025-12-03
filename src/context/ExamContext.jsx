import React, { createContext, useEffect, useState, useRef, useCallback } from "react";
import { COMPANIES } from "../data/tests";
import { scoreMCQ, scoreSubjective } from "../utils/grader";
import { api } from "../utils/api";

export const ExamContext = createContext(null);

export default function ExamProvider({ children }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch companies and tests from API and merge with static data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Start with static companies
        const mergedCompanies = [...COMPANIES];
        
        // Fetch HR-created tests from API
        try {
          const response = await api.get("/api/companies/");
          const apiCompanies = response.data.map(company => ({
            id: company.id,
            name: company.name,
            tests: company.tests.map(test => ({
              id: test.test_id,
              title: test.title,
              duration_minutes: test.duration,
              description: test.description || "",
              questions: test.questions.map(q => ({
                id: q.qid,
                text: q.text,
                type: q.type,
                options: q.options.map(opt => ({
                  id: opt.option_id,
                  text: opt.text,
                  is_correct: opt.is_correct
                }))
              })),
              company: { id: company.id, name: company.name },
              isHRCreated: true, // Mark HR-created tests
              isPremium: false // HR-created tests are always free
            }))
          }));
          
          // Merge API companies with static companies
          apiCompanies.forEach(apiCompany => {
            const existingCompany = mergedCompanies.find(c => c.id === apiCompany.id);
            if (existingCompany) {
              // Merge tests - add HR-created tests to existing company
              existingCompany.tests = [...existingCompany.tests, ...apiCompany.tests];
            } else {
              // Add new company if it doesn't exist in static data
              mergedCompanies.push(apiCompany);
            }
          });
        } catch (apiError) {
          console.error("Error fetching API companies:", apiError);
          // Continue with static data only
        }
        
        setCompanies(mergedCompanies);
        if (mergedCompanies.length > 0) {
          setCurrentCompanyId(mergedCompanies[0].id);
        }
      } catch (error) {
        console.error("Error setting up companies:", error);
        // Fallback to static data
        setCompanies(COMPANIES);
        if (COMPANIES.length > 0) {
          setCurrentCompanyId(COMPANIES[0].id);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const [currentCompanyId, setCurrentCompanyId] = useState(null);
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [test, setTest] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marksForReview, setMarksForReview] = useState({});
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [sessionLog, setSessionLog] = useState([]);
  const webcamStreamRef = useRef(null);
  const snapshotIntervalRef = useRef(null);
  const [proctorState, setProctorState] = useState({ 
    cameraAllowed: null, 
    faceMissingCount: 0, 
    multipleFaceCount: 0,
    noFaceCount: 0,
    faceStatus: 'unknown', // 'ok', 'no-face', 'multiple-faces', 'unknown'
    snapshots: [],
    violations: [],
    tabSwitchCount: 0,
    isFullscreen: false,
    warningCount: 0,
    noiseLevel: 0,
    noiseAlerts: 0,
    audioAllowed: null
  });
  const [examResult, setExamResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const faceDetectorRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const noiseCheckIntervalRef = useRef(null);

  useEffect(() => {
    if (!currentCompanyId && companies.length) setCurrentCompanyId(companies[0].id);
  }, [companies, currentCompanyId]);

  useEffect(() => {
    if (!selectedTestId) return;
    
    // Try to find test in companies first
    const comp = companies.find(c => c.id === currentCompanyId);
    if (comp) {
      const t = comp.tests.find(x => x.id === selectedTestId);
      if (t) {
        setTest(t);
        setAnswers({});
        setMarksForReview({});
        setCurrentIndex(0);
        setRunning(false);
        setRemaining((t.duration_minutes || t.duration || 30) * 60);
        setSessionLog([]);
        localStorage.setItem("exam_snapshots", JSON.stringify([]));
        setProctorState({ 
          cameraAllowed: null, 
          faceMissingCount: 0, 
          multipleFaceCount: 0,
          noFaceCount: 0,
          faceStatus: 'unknown',
          snapshots: [],
          violations: [],
          tabSwitchCount: 0,
          isFullscreen: false,
          warningCount: 0,
          noiseLevel: 0,
          noiseAlerts: 0,
          audioAllowed: null
        });
        setExamResult(null);
        setShowResult(false);
        return;
      }
    }
    
    // If not found, fetch from API (for HR-created tests)
    const fetchTest = async () => {
      try {
        const response = await api.get(`/api/test/${selectedTestId}/`);
        const apiTest = {
          id: response.data.test_id,
          title: response.data.title,
          duration_minutes: response.data.duration,
          description: response.data.description || "",
          questions: response.data.questions.map(q => ({
            id: q.qid,
            text: q.text,
            type: q.type,
            options: q.options ? q.options.map(opt => ({
              id: opt.option_id,
              text: opt.text,
              is_correct: opt.is_correct
            })) : []
          })),
          company: comp || { id: currentCompanyId, name: "Company" }
        };
        setTest(apiTest);
        setAnswers({});
        setMarksForReview({});
        setCurrentIndex(0);
        setRunning(false);
        setRemaining(apiTest.duration_minutes * 60);
        setSessionLog([]);
        localStorage.setItem("exam_snapshots", JSON.stringify([]));
        setProctorState({ 
          cameraAllowed: null, 
          faceMissingCount: 0, 
          multipleFaceCount: 0,
          noFaceCount: 0,
          faceStatus: 'unknown',
          snapshots: [],
          violations: [],
          tabSwitchCount: 0,
          isFullscreen: false,
          warningCount: 0,
          noiseLevel: 0,
          noiseAlerts: 0,
          audioAllowed: null
        });
        setExamResult(null);
        setShowResult(false);
      } catch (error) {
        console.error("Error fetching test from API:", error);
      }
    };
    
    fetchTest();
  }, [selectedTestId, currentCompanyId, companies]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          clearInterval(id);
          autoSubmit();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!test) return;
    const draft = { testId: test.id, answers, marksForReview, remaining, timestamp: Date.now() };
    localStorage.setItem("exam_draft", JSON.stringify(draft));
  }, [answers, marksForReview, remaining, test]);

  // Initialize Face Detection API if available
  useEffect(() => {
    if ('FaceDetector' in window) {
      try {
        faceDetectorRef.current = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 5 });
      } catch (e) {
        console.log("FaceDetector not available, using fallback");
      }
    }
  }, []);

  async function startCamera(videoElement) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setProctorState(s => ({ ...s, cameraAllowed: false }));
      setSessionLog(l => [...l, { t: Date.now(), type: "camera-unavailable" }]);
      return;
    }
    try {
      // Request both video and audio
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 }, 
        audio: true 
      });
      webcamStreamRef.current = stream;
      if (videoElement) {
        videoElement.srcObject = stream;
        try { await videoElement.play(); } catch(e) {}
      }
      
      // Initialize audio monitoring
      await initAudioMonitoring(stream);
      
      setProctorState(s => ({ ...s, cameraAllowed: true, audioAllowed: true }));
      setSessionLog(l => [...l, { t: Date.now(), type: "camera-start" }]);
      return stream;
    } catch (err) {
      // Try video only if audio fails
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
        webcamStreamRef.current = stream;
        if (videoElement) {
          videoElement.srcObject = stream;
          try { await videoElement.play(); } catch(e) {}
        }
        setProctorState(s => ({ ...s, cameraAllowed: true, audioAllowed: false }));
        setSessionLog(l => [...l, { t: Date.now(), type: "camera-start-no-audio" }]);
        return stream;
      } catch (err2) {
        setProctorState(s => ({ ...s, cameraAllowed: false }));
        setSessionLog(l => [...l, { t: Date.now(), type: "camera-denied", err: String(err) }]);
        return null;
      }
    }
  }

  // Audio monitoring for noise detection
  async function initAudioMonitoring(stream) {
    try {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      // Start noise level monitoring
      noiseCheckIntervalRef.current = setInterval(() => {
        checkNoiseLevel();
      }, 1000);
    } catch (e) {
      console.log("Audio monitoring failed:", e);
    }
  }

  function checkNoiseLevel() {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average volume
    const sum = dataArray.reduce((a, b) => a + b, 0);
    const avg = sum / bufferLength;
    const normalizedLevel = Math.min(100, Math.round(avg * 1.5));
    
    setProctorState(s => {
      const newState = { ...s, noiseLevel: normalizedLevel };
      
      // Alert if noise is too high (threshold: 60)
      if (normalizedLevel > 60) {
        const newNoiseAlerts = (s.noiseAlerts || 0) + 1;
        newState.noiseAlerts = newNoiseAlerts;
        
        // Trigger warning immediately on first detection, then every 3rd high noise reading (every 3 seconds)
        if (newNoiseAlerts === 1 || newNoiseAlerts % 3 === 0) {
          newState.violations = [...s.violations, { 
            type: "high-noise", 
            time: Date.now(), 
            message: `High background noise detected (Level: ${normalizedLevel}) - Please reduce background noise` 
          }];
          newState.warningCount = s.warningCount + 1;
        }
      } else {
        // Reset noise alerts when noise level is normal
        if (s.noiseAlerts > 0 && normalizedLevel < 50) {
          newState.noiseAlerts = 0;
        }
      }
      return newState;
    });
  }

  function stopCamera() {
    const s = webcamStreamRef.current;
    if (s && s.getTracks) {
      s.getTracks().forEach(t => t.stop());
      webcamStreamRef.current = null;
      setSessionLog(l => [...l, { t: Date.now(), type: "camera-stop" }]);
    }
    
    // Stop audio monitoring
    if (noiseCheckIntervalRef.current) {
      clearInterval(noiseCheckIntervalRef.current);
      noiseCheckIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }

  // Simplified face detection - uses brightness and motion detection
  // More reliable than complex skin-tone algorithms
  async function detectFaces(videoEl) {
    if (!videoEl || videoEl.readyState < 2) return { count: 1, status: 'ok' }; // Default to OK if video not ready
    
    // Try using native FaceDetector API (Chrome only)
    if (faceDetectorRef.current) {
      try {
        const faces = await faceDetectorRef.current.detect(videoEl);
        return { 
          count: faces.length, 
          status: faces.length === 0 ? 'no-face' : faces.length === 1 ? 'ok' : 'multiple-faces',
          faces: faces 
        };
      } catch (e) {
        // Fall through to simplified fallback
      }
    }
    
    // Simplified fallback: Check if there's meaningful content in the center of the frame
    // This is much more reliable than complex skin-tone detection
    const canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 90;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Analyze the center region (where face should be)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const regionSize = 40;
    
    let totalBrightness = 0;
    let pixelCount = 0;
    let colorVariance = 0;
    let skinTonePixels = 0;
    
    // Sample center region
    for (let y = centerY - regionSize/2; y < centerY + regionSize/2; y += 2) {
      for (let x = centerX - regionSize/2; x < centerX + regionSize/2; x += 2) {
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) continue;
        
        const i = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        
        const brightness = (r + g + b) / 3;
        totalBrightness += brightness;
        pixelCount++;
        
        // Very lenient skin tone check - catches most skin tones
        const isSkinLike = (
          r > 50 && g > 30 && b > 15 &&  // Not too dark
          r < 255 && g < 240 && b < 230 && // Not pure white
          r > b && // Red channel typically higher than blue
          Math.abs(r - g) < 100 // Not too saturated
        );
        
        if (isSkinLike) skinTonePixels++;
      }
    }
    
    const avgBrightness = pixelCount > 0 ? totalBrightness / pixelCount : 0;
    const skinRatio = pixelCount > 0 ? skinTonePixels / pixelCount : 0;
    
    // Improved heuristics for face detection:
    // - If screen is too dark (< 20) or too bright (> 240) = probably no face or covered camera
    // - If skin-like pixels are less than 8% of center AND brightness is in middle range = likely no face
    // - If there's reasonable brightness and skin-like pixels, assume face is there
    
    if (avgBrightness < 15) {
      // Camera might be covered or very dark
      return { count: 0, status: 'no-face' };
    }
    
    if (avgBrightness > 245) {
      // Camera might be pointed at light or covered with white
      return { count: 0, status: 'no-face' };
    }
    
    // Check for face presence: need reasonable brightness AND some skin-like content
    // If brightness is moderate (30-200) but skin ratio is very low (< 8%), likely no face
    if (avgBrightness >= 30 && avgBrightness <= 200 && skinRatio < 0.08) {
      return { count: 0, status: 'no-face' };
    }
    
    // If there's reasonable brightness and some skin-like pixels, assume face is there
    if (skinRatio > 0.08 || (avgBrightness > 30 && avgBrightness < 200)) {
      return { count: 1, status: 'ok' };
    }
    
    // If brightness is very low but not completely dark, might be no face
    if (avgBrightness < 30 && skinRatio < 0.05) {
      return { count: 0, status: 'no-face' };
    }
    
    // Default to OK only if we have some indication of content
    return { count: 1, status: 'ok' };
  }

  async function captureSnapshotFromVideo(videoEl) {
    if (!videoEl || videoEl.readyState < 2) return null;
    const w = videoEl.videoWidth || 640;
    const h = videoEl.videoHeight || 480;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoEl, 0, 0, w, h);
    const data = canvas.toDataURL("image/jpeg", 0.7);
    
    // Run face detection
    const faceResult = await detectFaces(videoEl);
    
    const snaps = JSON.parse(localStorage.getItem("exam_snapshots") || "[]");
    snaps.push({ t: Date.now(), data, faces: faceResult.count });
    if (snaps.length > 200) snaps.shift();
    localStorage.setItem("exam_snapshots", JSON.stringify(snaps));
    
    setProctorState(s => {
      const newState = { 
        ...s, 
        snapshots: snaps,
        faceStatus: faceResult.status
      };
      
      // Handle face detection violations - trigger warnings immediately
      if (faceResult.status === 'no-face') {
        const newNoFaceCount = (s.noFaceCount || 0) + 1;
        newState.noFaceCount = newNoFaceCount;
        newState.faceMissingCount = (s.faceMissingCount || 0) + 1;
        
        // Trigger warning immediately on first detection, then every 2nd detection
        if (newNoFaceCount === 1 || newNoFaceCount % 2 === 0) {
          newState.violations = [...s.violations, { 
            type: "no-face", 
            time: Date.now(), 
            message: "No face detected - Please stay visible to camera" 
          }];
          newState.warningCount = s.warningCount + 1;
        }
      } else if (faceResult.status === 'multiple-faces') {
        const newMultipleFaceCount = (s.multipleFaceCount || 0) + 1;
        newState.multipleFaceCount = newMultipleFaceCount;
        
        // Trigger warning immediately on first detection, then every subsequent detection
        if (newMultipleFaceCount === 1 || newMultipleFaceCount % 1 === 0) {
          newState.violations = [...s.violations, { 
            type: "multiple-faces", 
            time: Date.now(), 
            message: `Multiple faces detected (${faceResult.count} people) - Only candidate should be visible` 
          }];
          newState.warningCount = s.warningCount + 1;
        }
      } else {
        // Reset counters when face is OK
        if (s.noFaceCount > 0 || s.multipleFaceCount > 0) {
          newState.noFaceCount = 0;
          newState.multipleFaceCount = 0;
        }
      }
      
      return newState;
    });
    
    setSessionLog(l => [...l, { t: Date.now(), type: "snapshot", faces: faceResult.count }]);
    return data;
  }

  function startAutoSnapshots(videoEl) {
    if (snapshotIntervalRef.current) clearInterval(snapshotIntervalRef.current);
    snapshotIntervalRef.current = setInterval(() => {
      captureSnapshotFromVideo(videoEl);
    }, 20000);
    setSessionLog(l => [...l, { t: Date.now(), type: "snapshot-auto-start" }]);
  }

  function stopAutoSnapshots() {
    if (snapshotIntervalRef.current) clearInterval(snapshotIntervalRef.current);
    snapshotIntervalRef.current = null;
    setSessionLog(l => [...l, { t: Date.now(), type: "snapshot-auto-stop" }]);
  }

  function startTest(videoEl) {
    if (!test) return;
    setRunning(true);
    setSessionLog(l => [...l, { t: Date.now(), type: "start" }]);
    startCamera(videoEl).then(stream => {
      if (stream) startAutoSnapshots(videoEl);
    });
  }

  function endTest() {
    setRunning(false);
    stopAutoSnapshots();
    stopCamera();
    setSessionLog(l => [...l, { t: Date.now(), type: "end" }]);
  }

  function setAnswer(qid, val) {
    setAnswers(prev => ({ ...prev, [qid]: val }));
    setSessionLog(l => [...l, { t: Date.now(), type: "answer", qid }]);
  }
  function toggleMark(qid) {
    setMarksForReview(prev => ({ ...prev, [qid]: !prev[qid] }));
  }
  function jumpToIndex(i) {
    setCurrentIndex(i);
  }

  async function submitTest() {
    if (!test) return null;
    
    try {
      // Stop proctoring first
      endTest();
      
      // Exit fullscreen
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch (e) {
        console.log("Fullscreen exit error:", e);
      }
      
      const mcq = scoreMCQ(test.questions, answers);
      const subjectiveResults = {};
      const subjectiveQuestions = test.questions.filter(x => x.type === "subjective");
      
      for (const q of subjectiveQuestions) {
        subjectiveResults[q.id] = scoreSubjective(q, answers[q.id] || "");
      }
      
      // Calculate comprehensive results
      const totalQuestions = test.questions.length;
      const answeredQuestions = Object.keys(answers).length;
      const unansweredQuestions = totalQuestions - answeredQuestions;
      const timeSpent = (test.duration_minutes * 60) - remaining;
      const avgTimePerQuestion = answeredQuestions > 0 ? Math.round(timeSpent / answeredQuestions) : 0;
      
      // Calculate subjective average
      const subjectiveScores = Object.values(subjectiveResults).map(r => r.score || 0);
      const subjectiveAvg = subjectiveScores.length > 0 
        ? Math.round(subjectiveScores.reduce((a, b) => a + b, 0) / subjectiveScores.length) 
        : 0;
      
      // Overall score (weighted: 70% MCQ, 30% subjective)
      const overallScore = Math.round(mcq.percent * 0.7 + subjectiveAvg * 0.3);
      
      // Generate suggestions based on performance
      const suggestions = generateSuggestions(mcq, subjectiveResults, proctorState, timeSpent, test.duration_minutes * 60);
      
      const result = { 
        mcq, 
        subjectiveResults,
        subjectiveAvg,
        overallScore,
        totalQuestions,
        answeredQuestions,
        unansweredQuestions,
        timeSpent,
        avgTimePerQuestion,
        totalTime: test.duration_minutes * 60,
        proctorSummary: {
          tabSwitches: proctorState.tabSwitchCount || 0,
          violations: proctorState.violations?.length || 0,
          warnings: proctorState.warningCount || 0,
          snapshotsTaken: proctorState.snapshots?.length || 0,
          noFaceAlerts: proctorState.noFaceCount || 0,
          multipleFaceAlerts: proctorState.multipleFaceCount || 0,
          noiseAlerts: proctorState.noiseAlerts || 0
        },
        suggestions,
        sessionLog, 
        submittedAt: Date.now(),
        testTitle: test.title
      };
      
      // Save to localStorage
      localStorage.setItem("last_submission", JSON.stringify(result));
      
      // Try to submit to backend (don't fail if backend is down)
      try {
        await api.post("/api/submit/", {
          test_id: test.id,
          answers: answers,
          session_id: localStorage.getItem("session_id") || "local-session"
        });
      } catch (apiErr) {
        console.log("Backend submission skipped:", apiErr.message);
      }
      
      // Update state to show results
      setSessionLog(l => [...l, { t: Date.now(), type: "submit" }]);
      setExamResult(result);
      setShowResult(true);
      
      return result;
    } catch (error) {
      console.error("Submit error:", error);
      // Even if there's an error, try to show something
      const fallbackResult = {
        mcq: { total: 0, correct: 0, percent: 0 },
        subjectiveResults: {},
        subjectiveAvg: 0,
        overallScore: 0,
        totalQuestions: test?.questions?.length || 0,
        answeredQuestions: Object.keys(answers).length,
        unansweredQuestions: (test?.questions?.length || 0) - Object.keys(answers).length,
        timeSpent: 0,
        avgTimePerQuestion: 0,
        totalTime: (test?.duration_minutes || 30) * 60,
        proctorSummary: {
          tabSwitches: 0, violations: 0, warnings: 0, snapshotsTaken: 0,
          noFaceAlerts: 0, multipleFaceAlerts: 0, noiseAlerts: 0
        },
        suggestions: [{ type: "tip", title: "Submission Complete", message: "Your exam has been submitted.", icon: "✅" }],
        sessionLog: [],
        submittedAt: Date.now(),
        testTitle: test?.title || "Exam"
      };
      setExamResult(fallbackResult);
      setShowResult(true);
      return fallbackResult;
    }
  }

  function generateSuggestions(mcq, subjectiveResults, proctorState, timeSpent, totalTime) {
    const suggestions = [];
    
    // Score-based suggestions
    if (mcq.percent < 40) {
      suggestions.push({
        type: "critical",
        title: "Focus on Fundamentals",
        message: "Your MCQ score indicates gaps in core concepts. Review basic theory and practice more questions.",
        icon: "📚"
      });
    } else if (mcq.percent < 70) {
      suggestions.push({
        type: "improvement",
        title: "Good Progress, Room for Improvement",
        message: "You have a decent understanding. Focus on problem-solving techniques and practice timed tests.",
        icon: "📈"
      });
    } else {
      suggestions.push({
        type: "positive",
        title: "Excellent MCQ Performance!",
        message: "Great job on multiple choice questions. Keep practicing to maintain this level.",
        icon: "🌟"
      });
    }
    
    // Subjective suggestions
    const subScores = Object.values(subjectiveResults).map(r => r.score || 0);
    const avgSub = subScores.length > 0 ? subScores.reduce((a,b) => a+b, 0) / subScores.length : 0;
    
    if (avgSub < 50) {
      suggestions.push({
        type: "improvement",
        title: "Improve Written Answers",
        message: "Practice writing detailed explanations. Include examples and key terminology in your answers.",
        icon: "✍️"
      });
    }
    
    // Time management
    const timeUsedPercent = (timeSpent / totalTime) * 100;
    if (timeUsedPercent < 50) {
      suggestions.push({
        type: "warning",
        title: "Time Management",
        message: "You finished very quickly. Take more time to review your answers before submitting.",
        icon: "⏱️"
      });
    } else if (timeUsedPercent > 95) {
      suggestions.push({
        type: "info",
        title: "Practice Speed",
        message: "You used almost all the time. Practice solving questions faster to have time for review.",
        icon: "🏃"
      });
    }
    
    // Proctoring behavior
    if (proctorState.tabSwitchCount > 2) {
      suggestions.push({
        type: "warning",
        title: "Stay Focused",
        message: `You switched tabs ${proctorState.tabSwitchCount} times. In real exams, this could lead to disqualification.`,
        icon: "👁️"
      });
    }
    
    if (proctorState.violations.length > 0) {
      suggestions.push({
        type: "warning",
        title: "Exam Integrity",
        message: "Some activities were flagged during the exam. Maintain focus and avoid suspicious behavior.",
        icon: "⚠️"
      });
    }
    
    // General tips
    suggestions.push({
      type: "tip",
      title: "Next Steps",
      message: "Review incorrect answers, identify weak areas, and create a study plan for improvement.",
      icon: "🎯"
    });
    
    return suggestions;
  }

  function autoSubmit() {
    submitTest();
    setSessionLog(l => [...l, { t: Date.now(), type: "auto-submit" }]);
  }
  
  function closeResult() {
    setShowResult(false);
    setExamResult(null);
    setSelectedTestId(null);
  }

  // Auto-submit when too many warnings (5 warnings = auto terminate)
  const autoSubmitRef = useRef(false);
  useEffect(() => {
    if (!running || autoSubmitRef.current) return;
    
    const MAX_WARNINGS = 5;
    if (proctorState.warningCount >= MAX_WARNINGS) {
      autoSubmitRef.current = true; // Prevent multiple auto-submits
      setSessionLog(l => [...l, { t: Date.now(), type: "auto-terminate-warnings", warningCount: proctorState.warningCount }]);
      
      // Show warning and auto-submit
      const warningMessage = `⚠️ Exam terminated due to ${MAX_WARNINGS} violations. Your answers have been auto-submitted.`;
      
      // Show alert
      alert(warningMessage);
      
      // Auto-submit immediately
      setTimeout(() => {
        submitTest();
      }, 100);
    }
  }, [proctorState.warningCount, running, submitTest]);

  // Enhanced proctoring: Tab switch detection
  useEffect(() => {
    if (!running) return;
    
    function onVis() {
      const isHidden = document.hidden;
      setSessionLog(l => [...l, { t: Date.now(), type: isHidden ? "tab-hidden" : "tab-visible" }]);
      
      if (isHidden) {
        setProctorState(s => ({
          ...s,
          tabSwitchCount: s.tabSwitchCount + 1,
          violations: [...s.violations, { type: "tab-switch", time: Date.now(), message: "Switched away from exam tab" }],
          warningCount: s.warningCount + 1
        }));
      }
    }
    
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [running]);

  // Enhanced proctoring: Fullscreen detection
  useEffect(() => {
    if (!running) return;
    
    function onFullscreenChange() {
      const isFullscreen = !!document.fullscreenElement;
      setProctorState(s => ({ ...s, isFullscreen }));
      
      if (!isFullscreen && running) {
        setProctorState(s => ({
          ...s,
          violations: [...s.violations, { type: "fullscreen-exit", time: Date.now(), message: "Exited fullscreen mode" }],
          warningCount: s.warningCount + 1
        }));
        setSessionLog(l => [...l, { t: Date.now(), type: "fullscreen-exit" }]);
      }
    }
    
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [running]);

  // Enhanced proctoring: Block right-click and copy
  useEffect(() => {
    if (!running) return;
    
    function blockContext(e) {
      e.preventDefault();
      setProctorState(s => ({
        ...s,
        violations: [...s.violations, { type: "right-click", time: Date.now(), message: "Right-click attempted" }]
      }));
    }
    
    function blockCopy(e) {
      e.preventDefault();
      setProctorState(s => ({
        ...s,
        violations: [...s.violations, { type: "copy-attempt", time: Date.now(), message: "Copy attempt blocked" }]
      }));
    }
    
    function blockKeys(e) {
      // Block F12, Ctrl+Shift+I, Ctrl+U
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I") || (e.ctrlKey && e.key === "u")) {
        e.preventDefault();
        setProctorState(s => ({
          ...s,
          violations: [...s.violations, { type: "devtools-attempt", time: Date.now(), message: "Developer tools attempt" }]
        }));
      }
    }
    
    document.addEventListener("contextmenu", blockContext);
    document.addEventListener("copy", blockCopy);
    document.addEventListener("keydown", blockKeys);
    
    return () => {
      document.removeEventListener("contextmenu", blockContext);
      document.removeEventListener("copy", blockCopy);
      document.removeEventListener("keydown", blockKeys);
    };
  }, [running]);

  // Request fullscreen
  const requestFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen();
      setProctorState(s => ({ ...s, isFullscreen: true }));
      setSessionLog(l => [...l, { t: Date.now(), type: "fullscreen-enter" }]);
    } catch (err) {
      console.error("Fullscreen request failed:", err);
    }
  }, []);

  // Exit fullscreen
  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Exit fullscreen failed:", err);
    }
  }, []);

  // Add violation manually
  const addViolation = useCallback((type, message) => {
    setProctorState(s => ({
      ...s,
      violations: [...s.violations, { type, time: Date.now(), message }],
      warningCount: s.warningCount + 1
    }));
    setSessionLog(l => [...l, { t: Date.now(), type: `violation-${type}` }]);
  }, []);

  const value = {
    companies,
    currentCompanyId,
    setCurrentCompanyId,
    selectedTestId,
    setSelectedTestId,
    test,
    currentIndex,
    setCurrentIndex,
    answers,
    setAnswer,
    marksForReview,
    toggleMark,
    jumpToIndex,
    running,
    remaining,
    setRemaining,
    startTest,
    endTest,
    captureSnapshotFromVideo,
    submitTest,
    sessionLog,
    proctorState,
    requestFullscreen,
    exitFullscreen,
    addViolation,
    examResult,
    showResult,
    closeResult
  };

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
}
