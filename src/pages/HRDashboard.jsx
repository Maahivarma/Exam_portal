import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

export default function HRDashboard() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hrUser, setHrUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [selectedTopic, setSelectedTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [testForm, setTestForm] = useState({
    company_id: "",
    test_title: "",
    test_duration: 30
  });
  const [activeTab, setActiveTab] = useState("generate"); // "generate" or "analytics"
  const [analytics, setAnalytics] = useState(null);
  const [selectedTestAnalytics, setSelectedTestAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [candidates, setCandidates] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [showCandidates, setShowCandidates] = useState(false);

  const topics = [
    "Python", "Java", "JavaScript", "C++", "C#", ".NET",
    "React", "Node.js", "Django", "Spring Boot", "SQL",
    "MongoDB", "AWS", "Docker", "Kubernetes", "DevOps"
  ];

  // Check if HR is logged in
  useEffect(() => {
    const storedHr = localStorage.getItem("hr_user");
    if (storedHr) {
      setHrUser(JSON.parse(storedHr));
      setIsLoggedIn(true);
    }
  }, []);

  // Fetch companies
  useEffect(() => {
    if (isLoggedIn) {
      fetchCompanies();
      fetchAnalytics();
    }
  }, [isLoggedIn]);

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const response = await api.get("/api/hr/analytics/");
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchTestDetails = async (testId) => {
    try {
      const response = await api.get(`/api/hr/analytics/?test_id=${testId}`);
      setSelectedTestAnalytics(response.data);
      // Also fetch candidates
      fetchCandidates(testId);
    } catch (error) {
      console.error("Error fetching test details:", error);
    }
  };

  const fetchCandidates = async (testId) => {
    try {
      const response = await api.get(`/api/hr/candidates/${testId}/`);
      setCandidates(response.data);
      setShowCandidates(true);
      // Load selected candidates from localStorage
      const saved = localStorage.getItem(`selected_candidates_${testId}`);
      if (saved) {
        setSelectedCandidates(JSON.parse(saved));
      } else {
        setSelectedCandidates([]);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const toggleCandidateSelection = (username) => {
    setSelectedCandidates(prev => {
      const newSelection = prev.includes(username)
        ? prev.filter(u => u !== username)
        : [...prev, username];
      // Save to localStorage
      if (selectedTestAnalytics) {
        localStorage.setItem(`selected_candidates_${selectedTestAnalytics.test_id}`, JSON.stringify(newSelection));
      }
      return newSelection;
    });
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get("/api/companies/");
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Attempting login with:", loginForm.username);
      const response = await api.post("/api/hr/login/", loginForm);
      console.log("Login response:", response.data);
      if (response.data.success) {
        setHrUser(response.data.user);
        setIsLoggedIn(true);
        localStorage.setItem("hr_user", JSON.stringify(response.data.user));
      } else {
        alert(response.data.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.detail ||
                          error.message || 
                          "Login failed. Please check if backend server is running.";
      alert(errorMessage);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setHrUser(null);
    setGeneratedQuestions([]);
    setSelectedQuestions([]);
    localStorage.removeItem("hr_user");
  };

  const handleGenerateQuestions = async () => {
    if (!selectedTopic) {
      alert("Please select a topic");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post("/api/hr/generate-questions/", {
        topic: selectedTopic,
        count: 50,
        difficulty: difficulty,
        user_id: hrUser?.id
      });

      if (response.data.success) {
        setGeneratedQuestions(response.data.questions);
        setSelectedQuestions([]);
        alert(`Generated ${response.data.count} questions!`);
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      alert(error.response?.data?.error || "Failed to generate questions");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleQuestionSelection = (questionId) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        if (prev.length >= 20) {
          alert("Maximum 20 questions can be selected");
          return prev;
        }
        return [...prev, questionId];
      }
    });
  };

  const handleCreateTest = async () => {
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question");
      return;
    }

    if (selectedQuestions.length > 20) {
      alert("Maximum 20 questions allowed");
      return;
    }

    if (!testForm.company_id || !testForm.test_title) {
      alert("Please fill in all test details");
      return;
    }

    try {
      const response = await api.post("/api/hr/select-questions/", {
        question_ids: selectedQuestions,
        company_id: testForm.company_id,
        test_title: testForm.test_title,
        test_duration: testForm.test_duration
      });

      if (response.data.success) {
        alert(`Test created successfully! ${response.data.questions_added} questions added.`);
        setGeneratedQuestions([]);
        setSelectedQuestions([]);
        setTestForm({ company_id: "", test_title: "", test_duration: 30 });
        // Refresh analytics
        fetchAnalytics();
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to create test");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">👔</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800">HR Login</h1>
            <p className="text-slate-500 mt-2">Access the AI Question Generator</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Login
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            <p>Note: Create HR user in Django admin first</p>
            <p className="mt-2">
              <button
                onClick={() => navigate("/")}
                className="text-purple-600 hover:underline"
              >
                ← Back to Home
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <span>🤖</span> AI Question Generator
              </h1>
              <p className="text-slate-500 mt-1">Welcome, {hrUser?.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mt-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab("generate")}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === "generate"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              📝 Generate Questions
            </button>
            <button
              onClick={() => {
                setActiveTab("analytics");
                fetchAnalytics();
              }}
              className={`px-6 py-3 font-medium transition-all ${
                activeTab === "analytics"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              📊 Test Analytics
            </button>
          </div>
        </div>

        {activeTab === "generate" ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Question Generation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Generation Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Generate Questions</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Topic</label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select Topic</option>
                    {topics.map(topic => (
                      <option key={topic} value={topic}>{topic}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateQuestions}
                disabled={!selectedTopic || isGenerating}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                  !selectedTopic || isGenerating
                    ? "bg-slate-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg"
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Generating 50 Questions...
                  </span>
                ) : (
                  "🤖 Generate 50 Questions"
                )}
              </button>
            </div>

            {/* Generated Questions */}
            {generatedQuestions.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-800">
                    Generated Questions ({generatedQuestions.length})
                  </h2>
                  <div className="text-sm text-slate-500">
                    Selected: {selectedQuestions.length}/20
                  </div>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {generatedQuestions.map((q, idx) => {
                    const isSelected = selectedQuestions.includes(q.id);
                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-purple-500 bg-purple-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                        onClick={() => toggleQuestionSelection(q.id)}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleQuestionSelection(q.id)}
                            className="mt-1 w-5 h-5"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                q.type === "mcq"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-green-100 text-green-700"
                              }`}>
                                {q.type.toUpperCase()}
                              </span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                q.difficulty === "easy"
                                  ? "bg-green-100 text-green-700"
                                  : q.difficulty === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}>
                                {q.difficulty}
                              </span>
                            </div>
                            <p className="text-slate-800 font-medium">{q.question_text}</p>
                            
                            {q.type === "mcq" && q.options && (
                              <div className="mt-3 space-y-1">
                                {q.options.map((opt, optIdx) => (
                                  <div
                                    key={optIdx}
                                    className={`text-sm p-2 rounded ${
                                      opt.is_correct
                                        ? "bg-green-50 text-green-700"
                                        : "bg-slate-50 text-slate-600"
                                    }`}
                                  >
                                    {opt.is_correct && "✓ "}
                                    {opt.text}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {q.type === "subjective" && q.correct_answer && (
                              <div className="mt-3 p-3 bg-slate-50 rounded text-sm text-slate-600">
                                <strong>Answer:</strong> {q.correct_answer}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Test Creation */}
          <div className="space-y-6">
            {/* Test Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-4">Create Test</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                  <select
                    value={testForm.company_id}
                    onChange={(e) => setTestForm({ ...testForm, company_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select Company</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Test Title</label>
                  <input
                    type="text"
                    value={testForm.test_title}
                    onChange={(e) => setTestForm({ ...testForm, test_title: e.target.value })}
                    placeholder="e.g., Python Developer Assessment"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={testForm.test_duration}
                    onChange={(e) => setTestForm({ ...testForm, test_duration: parseInt(e.target.value) || 30 })}
                    min="10"
                    max="120"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-slate-600">
                    <strong>Selected Questions:</strong> {selectedQuestions.length}/20
                  </div>
                  {selectedQuestions.length === 0 && (
                    <p className="text-xs text-slate-500 mt-2">Select questions from the list to create a test</p>
                  )}
                </div>

                <button
                  onClick={handleCreateTest}
                  disabled={selectedQuestions.length === 0 || !testForm.company_id || !testForm.test_title}
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                    selectedQuestions.length === 0 || !testForm.company_id || !testForm.test_title
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg"
                  }`}
                >
                  ✅ Create Test with {selectedQuestions.length} Questions
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-3">📋 Instructions</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>1. Select a topic and difficulty</li>
                <li>2. Click "Generate 50 Questions"</li>
                <li>3. Review and select up to 20 questions</li>
                <li>4. Fill in test details</li>
                <li>5. Click "Create Test"</li>
              </ul>
            </div>
          </div>
        </div>
        ) : (
        /* Analytics Tab */
        <div className="space-y-6">
          {loadingAnalytics ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading analytics...</p>
            </div>
          ) : analytics ? (
            <>
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="text-3xl mb-2">📝</div>
                  <div className="text-2xl font-bold text-slate-800">{analytics.total_tests || 0}</div>
                  <div className="text-sm text-slate-500">Total Tests</div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="text-3xl mb-2">👥</div>
                  <div className="text-2xl font-bold text-slate-800">
                    {analytics.tests?.reduce((sum, t) => sum + (t.total_attempts || 0), 0) || 0}
                  </div>
                  <div className="text-sm text-slate-500">Total Attempts</div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="text-3xl mb-2">✅</div>
                  <div className="text-2xl font-bold text-slate-800">
                    {analytics.tests?.reduce((sum, t) => sum + (t.completed || 0), 0) || 0}
                  </div>
                  <div className="text-sm text-slate-500">Completed</div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="text-3xl mb-2">📊</div>
                  <div className="text-2xl font-bold text-slate-800">
                    {analytics.tests?.length > 0 
                      ? Math.round(analytics.tests.reduce((sum, t) => sum + (t.average_score || 0), 0) / analytics.tests.length)
                      : 0}%
                  </div>
                  <div className="text-sm text-slate-500">Avg Score</div>
                </div>
              </div>

              {/* Tests List */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">All Tests</h2>
                {analytics.tests && analytics.tests.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.tests.map((test) => (
                      <div
                        key={test.test_id}
                        className="border-2 border-slate-200 rounded-xl p-4 hover:border-purple-300 transition-all cursor-pointer"
                        onClick={() => fetchTestDetails(test.test_id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-800">{test.test_title}</h3>
                            <p className="text-sm text-slate-500">{test.company}</p>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-blue-600">{test.total_attempts || 0}</div>
                              <div className="text-xs text-slate-500">Attempts</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-green-600">{test.completed || 0}</div>
                              <div className="text-xs text-slate-500">Completed</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-purple-600">{test.average_score || 0}%</div>
                              <div className="text-xs text-slate-500">Avg Score</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-orange-600">{test.question_count || 0}</div>
                              <div className="text-xs text-slate-500">Questions</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <p>No tests created yet. Create your first test in the "Generate Questions" tab.</p>
                  </div>
                )}
              </div>

              {/* Test Details */}
              {selectedTestAnalytics && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-800">{selectedTestAnalytics.test_title}</h2>
                    <button
                      onClick={() => setSelectedTestAnalytics(null)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-blue-600">{selectedTestAnalytics.total_attempts}</div>
                      <div className="text-sm text-slate-600">Total Attempts</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-green-600">{selectedTestAnalytics.completed}</div>
                      <div className="text-sm text-slate-600">Completed</div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-purple-600">{selectedTestAnalytics.average_score}%</div>
                      <div className="text-sm text-slate-600">Avg Score</div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-orange-600">{selectedTestAnalytics.in_progress || 0}</div>
                      <div className="text-sm text-slate-600">In Progress</div>
                    </div>
                  </div>

                  {/* Score Distribution */}
                  {selectedTestAnalytics.score_distribution && (
                    <div className="mb-6">
                      <h3 className="font-bold text-slate-800 mb-3">Score Distribution</h3>
                      <div className="space-y-2">
                        {Object.entries(selectedTestAnalytics.score_distribution).map(([range, count]) => (
                          <div key={range} className="flex items-center gap-3">
                            <div className="w-20 text-sm text-slate-600">{range}%</div>
                            <div className="flex-1 bg-slate-200 rounded-full h-4 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
                                style={{ width: `${(count / selectedTestAnalytics.total_attempts) * 100}%` }}
                              ></div>
                            </div>
                            <div className="w-12 text-sm font-medium text-slate-700">{count}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Candidates Section */}
                  {showCandidates && candidates && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800">👥 Candidates ({candidates.total_candidates})</h3>
                        <div className="text-sm text-slate-500">
                          Selected: {selectedCandidates.length}
                        </div>
                      </div>
                      
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {candidates.candidates.map((candidate, idx) => {
                          const isSelected = selectedCandidates.includes(candidate.username);
                          const getScoreColor = (score) => {
                            if (score >= 80) return "text-green-600";
                            if (score >= 60) return "text-blue-600";
                            if (score >= 40) return "text-orange-600";
                            return "text-red-600";
                          };
                          
                          return (
                            <div
                              key={idx}
                              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                                isSelected
                                  ? "border-green-500 bg-green-50"
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                              onClick={() => toggleCandidateSelection(candidate.username)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleCandidateSelection(candidate.username)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-5 h-5"
                                  />
                                  <div className="flex-1">
                                    <div className="font-bold text-slate-800">{candidate.username}</div>
                                    <div className="text-xs text-slate-500">
                                      {new Date(candidate.started).toLocaleString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`text-xl font-bold ${getScoreColor(candidate.overall_score)}`}>
                                    {candidate.overall_score}%
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    MCQ: {candidate.mcq_score}% | Sub: {candidate.subjective_avg}%
                                  </div>
                                  {candidate.time_taken && (
                                    <div className="text-xs text-slate-400 mt-1">
                                      ⏱️ {Math.round(candidate.time_taken / 60)} min
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {selectedCandidates.length > 0 && (
                        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-bold text-green-800">
                                ✓ {selectedCandidates.length} Candidate{selectedCandidates.length !== 1 ? 's' : ''} Selected
                              </div>
                              <div className="text-sm text-green-700 mt-1">
                                {selectedCandidates.join(", ")}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                alert(`Selected ${selectedCandidates.length} candidates for next round!\n\nCandidates: ${selectedCandidates.join(", ")}`);
                                // Here you could add API call to mark candidates as selected
                              }}
                              className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                            >
                              ✅ Forward to Next Round
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recent Attempts */}
                  {selectedTestAnalytics.recent_attempts && selectedTestAnalytics.recent_attempts.length > 0 && (
                    <div>
                      <h3 className="font-bold text-slate-800 mb-3">Recent Attempts</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {selectedTestAnalytics.recent_attempts.map((attempt, idx) => (
                          <div key={idx} className="border border-slate-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-slate-800">{attempt.username}</div>
                                <div className="text-xs text-slate-500">
                                  {new Date(attempt.started).toLocaleString()}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-purple-600">{attempt.score_mcq || 0}%</div>
                                <div className="text-xs text-slate-500">
                                  {attempt.ended ? "Completed" : "In Progress"}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <p className="text-slate-500">No analytics data available</p>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}

