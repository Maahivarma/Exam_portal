import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExamContext } from "../context/ExamContext";
import { COMPANY_LOGOS, hasPurchased } from "../data/tests";
import { useAuth } from "../context/AuthContext";
import AIChatbot from "../components/AIChatbot";
import Gamification from "../components/Gamification";

export default function HomePage() {
  const navigate = useNavigate();
  const { companies, setSelectedTestId, setCurrentCompanyId } = useContext(ExamContext);
  const { user, isAuthenticated } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, free, premium

  // Get all tests with company info
  const allTests = companies.flatMap(c => c.tests.map(t => ({ 
    ...t, 
    company: c,
    // Preserve premium status for static tests, HR-created are always free
    isPremium: t.isHRCreated ? false : (t.isPremium || false),
    price: t.isHRCreated ? 0 : (t.price || 0),
    originalPrice: t.isHRCreated ? 0 : (t.originalPrice || 0)
  })));
  
  // Separate HR-created tests (Current Hiring) from regular tests
  const hrCreatedTestsByCompany = {};
  const regularTestsByCompany = {};
  
  companies.forEach(company => {
    const hrTests = company.tests.filter(t => t.isHRCreated);
    const regularTests = company.tests.filter(t => !t.isHRCreated);
    
    if (hrTests.length > 0) {
      hrCreatedTestsByCompany[company.id] = {
        company: company,
        tests: hrTests.map(t => ({ 
          ...t, 
          company: company,
          isPremium: false,
          price: 0
        }))
      };
    }
    
    if (regularTests.length > 0) {
      regularTestsByCompany[company.id] = {
        company: company,
        tests: regularTests.map(t => ({ 
          ...t, 
          company: company
        }))
      };
    }
  });
  
  // Filter tests based on search, company, and type
  const filteredTests = allTests.filter(t => {
    const matchesSearch = searchQuery === "" || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.company.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany = !selectedCompany || t.company.id === selectedCompany;
    const matchesType = filterType === "all" || 
      (filterType === "free" && !t.isPremium) ||
      (filterType === "premium" && t.isPremium);
    return matchesSearch && matchesCompany && matchesType;
  });

  // Company colors for visual variety
  const companyColors = {
    tcs: { bg: "from-blue-500 to-indigo-600", light: "bg-blue-50", border: "border-blue-200" },
    google: { bg: "from-red-500 to-yellow-500", light: "bg-red-50", border: "border-red-200" },
    wipro: { bg: "from-purple-500 to-pink-500", light: "bg-purple-50", border: "border-purple-200" },
    infosys: { bg: "from-blue-600 to-cyan-500", light: "bg-cyan-50", border: "border-cyan-200" },
    microsoft: { bg: "from-green-500 to-teal-500", light: "bg-green-50", border: "border-green-200" },
    amazon: { bg: "from-orange-500 to-amber-500", light: "bg-orange-50", border: "border-orange-200" },
    facebook: { bg: "from-blue-600 to-indigo-700", light: "bg-indigo-50", border: "border-indigo-200" },
    oracle: { bg: "from-red-600 to-orange-600", light: "bg-red-50", border: "border-red-200" },
    apple: { bg: "from-slate-600 to-slate-800", light: "bg-slate-50", border: "border-slate-200" },
    ibm: { bg: "from-blue-700 to-indigo-800", light: "bg-blue-50", border: "border-blue-200" },
    meta: { bg: "from-blue-600 to-indigo-700", light: "bg-indigo-50", border: "border-indigo-200" }
  };

  const getCompanyColor = (companyId) => companyColors[companyId] || companyColors.tcs;

  const handleTestClick = async (test) => {
    // For HR-created tests, fetch full test details from API
    if (test.id && test.id.includes('-')) {
      try {
        const response = await api.get(`/api/test/${test.id}/`);
        const fullTest = {
          ...test,
          questions: response.data.questions || test.questions || [],
          duration_minutes: response.data.duration || test.duration_minutes || 30
        };
        setCurrentCompanyId(test.company.id);
        setSelectedTestId(test.id);
      } catch (error) {
        console.error("Error fetching test:", error);
        // Fallback to using test data we have
        setCurrentCompanyId(test.company.id);
        setSelectedTestId(test.id);
      }
    } else {
      // Check if test is premium and not purchased
      if (test.isPremium && !hasPurchased(test.id)) {
        navigate("/payment", {
          state: {
            testInfo: {
              id: test.id,
              title: test.title,
              company: test.company.name,
              price: test.price,
              originalPrice: test.originalPrice
            }
          }
        });
      } else {
        setCurrentCompanyId(test.company.id);
        setSelectedTestId(test.id);
      }
    }
  };

  // Stats
  const freeTests = allTests.filter(t => !t.isPremium).length;
  const premiumTests = allTests.filter(t => t.isPremium).length;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <section className="relative overflow-hidden rounded-3xl p-8" style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)'
      }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative flex items-center justify-between flex-wrap gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name || "Student"}! 👋
            </h1>
            <p className="text-white/80">Ready to practice? Choose a test below and start improving!</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center bg-white/20 rounded-xl px-4 py-3">
              <div className="text-3xl font-bold text-white">{freeTests}</div>
              <div className="text-white/70 text-sm">Free Tests</div>
            </div>
            <div className="text-center bg-white/20 rounded-xl px-4 py-3">
              <div className="text-3xl font-bold text-yellow-300">{premiumTests}</div>
              <div className="text-white/70 text-sm">Premium</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="flex flex-wrap gap-4 items-center">
        {/* Search Input */}
        <div className="flex-1 min-w-[250px]">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Search tests or companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
        
        {/* Type Filter */}
        <div className="flex gap-2">
          {[
            { id: "all", label: "All Tests" },
            { id: "free", label: "🆓 Free" },
            { id: "premium", label: "👑 Premium" }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterType === f.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Companies Sidebar */}
        <aside className="md:col-span-1 space-y-4">
          {/* Company Cards */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-900">
              <h2 className="text-white font-bold flex items-center gap-2">
                <span>🏢</span> Companies
              </h2>
            </div>
            
            <div className="p-3 space-y-2">
              <button
                onClick={() => setSelectedCompany(null)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  !selectedCompany ? 'bg-purple-50 border-2 border-purple-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  All
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-slate-800">All Companies</div>
                  <div className="text-xs text-slate-500">{allTests.length} tests</div>
                </div>
              </button>
              
              {companies.map(c => {
                const colors = getCompanyColor(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCompany(selectedCompany === c.id ? null : c.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      selectedCompany === c.id 
                        ? `${colors.light} ${colors.border} border-2` 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.bg} flex items-center justify-center p-1.5`}>
                      <img 
                        src={COMPANY_LOGOS[c.id]} 
                        alt={c.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-slate-800">{c.name}</div>
                      <div className="text-xs text-slate-500">{c.tests.length} tests</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Premium Benefits */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200">
            <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-3">
              <span>👑</span> Premium Benefits
            </h3>
            <ul className="space-y-2 text-sm text-amber-700">
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Advanced questions</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Detailed solutions</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Performance analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                <span>Certificate on completion</span>
              </li>
            </ul>
          </div>

          {/* Gamification Widget */}
          <Gamification />
        </aside>

        {/* Tests Grid - Grouped by Company */}
        <main className="md:col-span-3 space-y-6">
          {/* HR-Created Tests (Current Hiring) - Show First */}
          {Object.keys(hrCreatedTestsByCompany).length > 0 && (
            <>
              {Object.entries(hrCreatedTestsByCompany)
                .filter(([companyId]) => !selectedCompany || companyId === selectedCompany)
                .map(([companyId, companyData]) => {
                  const colors = getCompanyColor(companyId);
                  const companyTests = companyData.tests.filter(t => {
                    const matchesSearch = searchQuery === "" || 
                      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      companyData.company.name.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesType = filterType === "all" || filterType === "free";
                    return matchesSearch && matchesType;
                  });

                  if (companyTests.length === 0) return null;

                  return (
                    <div key={`hr-${companyId}`} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      {/* Company Header */}
                      <div className={`p-4 bg-gradient-to-r ${colors.bg} flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center p-2`}>
                            <img 
                              src={COMPANY_LOGOS[companyId]} 
                              alt={companyData.company.name} 
                              className="w-10 h-10 object-contain"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          </div>
                          <div>
                            <h2 className="text-white font-bold text-lg">
                              Current Hiring by {companyData.company.name}
                            </h2>
                            <p className="text-white/80 text-sm">{companyTests.length} test{companyTests.length !== 1 ? 's' : ''} available</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tests for this Company */}
                      <div className="p-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          {companyTests.map((t) => {
                            return (
                              <div 
                                key={t.id}
                                className={`group relative overflow-hidden rounded-2xl border-2 ${colors.border} ${colors.light} hover:shadow-lg transition-all hover:-translate-y-1`}
                              >
                                {/* Free Badge for HR-created tests */}
                                <div className="absolute top-3 right-3 z-10">
                                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                    🆓 Free
                                  </span>
                                </div>
                                
                                {/* Gradient Top Bar */}
                                <div className={`h-2 bg-gradient-to-r ${colors.bg}`}></div>
                                
                                <div className="p-5">
                                  <div className="mb-4">
                                    <h3 className="font-bold text-slate-800 text-lg mb-1">{t.title}</h3>
                                    <p className="text-sm text-slate-500">{companyData.company.name} • {t.description || "Technical Assessment"}</p>
                                  </div>
                                  
                                  {/* Test Info */}
                                  <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                                    <span className="flex items-center gap-1">
                                      <span>⏱️</span>
                                      {t.duration_minutes || t.duration} min
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <span>📋</span>
                                      {t.questions?.length || 20} Qs
                                    </span>
                                  </div>
                                  
                                  {/* Action Button */}
                                  <button 
                                    onClick={() => handleTestClick(t)}
                                    className={`w-full py-3 rounded-xl font-bold text-white transition-all group-hover:shadow-lg bg-gradient-to-r ${colors.bg}`}
                                  >
                                    🎯 Start Test
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </>
          )}

          {/* Regular Tests (Static Tests) - Show After Current Hiring */}
          {Object.keys(regularTestsByCompany).length > 0 && (
            <>
              {Object.entries(regularTestsByCompany)
                .filter(([companyId]) => !selectedCompany || companyId === selectedCompany)
                .map(([companyId, companyData]) => {
                  const colors = getCompanyColor(companyId);
                  const companyTests = companyData.tests.filter(t => {
                    const matchesSearch = searchQuery === "" || 
                      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      companyData.company.name.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesType = filterType === "all" || 
                      (filterType === "free" && !t.isPremium) ||
                      (filterType === "premium" && t.isPremium);
                    return matchesSearch && matchesType;
                  });

                  if (companyTests.length === 0) return null;

                  return (
                    <div key={companyId} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      {/* Company Header */}
                      <div className={`p-4 bg-gradient-to-r ${colors.bg} flex items-center justify-between`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center p-2`}>
                            <img 
                              src={COMPANY_LOGOS[companyId]} 
                              alt={companyData.company.name} 
                              className="w-10 h-10 object-contain"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          </div>
                          <div>
                            <h2 className="text-white font-bold text-lg">
                              {companyData.company.name} Practice Tests
                            </h2>
                            <p className="text-white/80 text-sm">{companyTests.length} test{companyTests.length !== 1 ? 's' : ''} available</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tests for this Company */}
                      <div className="p-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          {companyTests.map((t) => {
                            const isPurchased = hasPurchased(t.id);
                            const isLocked = t.isPremium && !isPurchased;
                            
                            return (
                              <div 
                                key={t.id}
                                className={`group relative overflow-hidden rounded-2xl border-2 ${colors.border} ${colors.light} hover:shadow-lg transition-all hover:-translate-y-1`}
                              >
                                {/* Premium/Free Badge */}
                                {t.isPremium ? (
                                  <div className="absolute top-3 right-3 z-10">
                                    {isPurchased ? (
                                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500 text-white">
                                        ✓ Purchased
                                      </span>
                                    ) : (
                                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                                        👑 Premium
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <div className="absolute top-3 right-3 z-10">
                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                      🆓 Free
                                    </span>
                                  </div>
                                )}
                                
                                {/* Gradient Top Bar */}
                                <div className={`h-2 bg-gradient-to-r ${colors.bg}`}></div>
                                
                                <div className="p-5">
                                  <div className="flex items-start gap-3 mb-4">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center p-2 shadow-lg`}>
                                      <img 
                                        src={COMPANY_LOGOS[t.company.id]} 
                                        alt={t.company.name} 
                                        className="w-10 h-10 object-contain"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="font-bold text-slate-800">{t.title}</h3>
                                      <p className="text-sm text-slate-500">{t.company.name}</p>
                                    </div>
                                  </div>
                                  
                                  {/* Test Info */}
                                  <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
                                    <span className="flex items-center gap-1">
                                      <span>⏱️</span>
                                      {t.duration_minutes} min
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <span>📋</span>
                                      {t.questions?.length || 35} Qs
                                    </span>
                                  </div>
                                  
                                  {/* Price Display for Premium */}
                                  {t.isPremium && !isPurchased && (
                                    <div className="flex items-center gap-2 mb-4">
                                      <span className="text-2xl font-bold text-slate-800">₹{t.price}</span>
                                      <span className="text-sm text-slate-400 line-through">₹{t.originalPrice}</span>
                                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                        {Math.round((1 - t.price / t.originalPrice) * 100)}% OFF
                                      </span>
                                    </div>
                                  )}
                                  
                                  {/* Action Button */}
                                  <button 
                                    onClick={() => handleTestClick(t)}
                                    className={`w-full py-3 rounded-xl font-bold text-white transition-all group-hover:shadow-lg ${
                                      isLocked
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                        : `bg-gradient-to-r ${colors.bg}`
                                    }`}
                                  >
                                    {isLocked ? '🔓 Unlock Now' : '🎯 Start Test'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </main>
      </div>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: "🎯", value: "35", label: "Questions/Test", color: "from-blue-500 to-cyan-500" },
          { icon: "⏱️", value: "30-40", label: "Minutes/Test", color: "from-purple-500 to-pink-500" },
          { icon: "📷", value: "AI", label: "Proctoring", color: "from-emerald-500 to-teal-500" },
          { icon: "📊", value: "Instant", label: "Results", color: "from-orange-500 to-red-500" }
        ].map((stat, idx) => (
          <div key={idx} className={`rounded-2xl p-5 text-white bg-gradient-to-br ${stat.color}`}>
            <span className="text-3xl">{stat.icon}</span>
            <div className="text-2xl font-bold mt-2">{stat.value}</div>
            <div className="text-white/80 text-sm">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* AI Chatbot - Fixed Position */}
      <AIChatbot />
    </div>
  );
}
