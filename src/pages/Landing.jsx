import React from "react";
import { Link } from "react-router-dom";
import { COMPANY_LOGOS, COMPANIES } from "../data/tests";
import { useAuth } from "../context/AuthContext";
import AIChatbot from "../components/AIChatbot";

export default function Landing() {
  const { isAuthenticated, user } = useAuth();

  // Last Year Recruitment Data
  const recruitmentData = [
    { company: "TCS", hired: "45,000+", package: "3.5-7 LPA", roles: ["Developer", "Analyst", "Consultant"], color: "from-blue-500 to-indigo-600" },
    { company: "Infosys", hired: "35,000+", package: "3.6-8 LPA", roles: ["SE", "SSE", "Technology Analyst"], color: "from-blue-600 to-cyan-600" },
    { company: "Wipro", hired: "30,000+", package: "3.5-6.5 LPA", roles: ["Project Engineer", "Developer"], color: "from-purple-500 to-pink-600" },
    { company: "Google", hired: "500+", package: "25-50 LPA", roles: ["SWE", "SRE", "Product Manager"], color: "from-red-500 to-yellow-500" },
    { company: "Amazon", hired: "5,000+", package: "15-40 LPA", roles: ["SDE", "Data Engineer", "DevOps"], color: "from-orange-500 to-amber-500" },
    { company: "Microsoft", hired: "2,000+", package: "18-45 LPA", roles: ["SWE", "PM", "Data Scientist"], color: "from-green-500 to-teal-500" }
  ];

  // Interview Tips
  const interviewTips = [
    { icon: "📚", title: "Master DSA", tip: "Focus on Arrays, Strings, Trees, Graphs, DP. Practice 200+ problems on LeetCode." },
    { icon: "💻", title: "Build Projects", tip: "Create 3-4 solid projects. Host them on GitHub with proper documentation." },
    { icon: "🗣️", title: "Communication", tip: "Practice explaining your thought process. Use STAR method for behavioral questions." },
    { icon: "🎯", title: "Company Research", tip: "Understand company values, products, and recent news before interviews." },
    { icon: "⏰", title: "Time Management", tip: "In coding rounds, spend 5 min understanding, 20 min coding, 5 min testing." },
    { icon: "🔄", title: "Mock Interviews", tip: "Practice with peers or use platforms like Pramp. Record and review yourself." }
  ];

  // Tech Roadmaps Preview
  const roadmapPreviews = [
    { icon: "🚀", title: "Full Stack", color: "from-purple-500 to-pink-500", duration: "6-8 months" },
    { icon: "🐍", title: "Python", color: "from-yellow-500 to-green-500", duration: "5-7 months" },
    { icon: "☕", title: "Java", color: "from-red-500 to-orange-500", duration: "6-8 months" },
    { icon: "🔷", title: ".NET", color: "from-blue-600 to-purple-600", duration: "6-8 months" },
    { icon: "🤖", title: "Data Science", color: "from-cyan-500 to-blue-500", duration: "8-10 months" },
    { icon: "⚙️", title: "DevOps", color: "from-orange-500 to-red-500", duration: "5-7 months" }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-8 md:p-12" style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)'
      }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            {isAuthenticated ? (
              <>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm mb-4">
                  <span>👋</span>
                  <span>Welcome back to Gtechno, {user?.name}!</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  Ready to Continue Your <span className="text-yellow-300">Learning Journey?</span>
                </h1>
                <p className="text-white/80 mt-4 text-lg">
                  Pick up where you left off and keep improving your skills with practice tests.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link to="/dashboard" className="px-8 py-4 bg-white text-purple-700 rounded-xl font-bold text-lg hover:shadow-lg transition-all">
                    📝 Go to Dashboard
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm mb-4">
                  <span>🚀</span>
                  <span>Start your journey today</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                  <span className="text-yellow-300">Unlock</span> Your Career Potential
                </h1>
                <p className="text-white/80 mt-4 text-lg">
                  Practice with real company assessments, learn tech roadmaps, and land your dream job.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link to="/signup" className="px-8 py-4 bg-white text-purple-700 rounded-xl font-bold text-lg hover:shadow-lg transition-all">
                    🎉 Get Started Free
                  </Link>
                  <Link to="/login" className="px-8 py-4 bg-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/30 transition-all">
                    Login
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🎯", title: "Practice Tests", desc: "1000+ real exam questions", color: "from-emerald-400 to-teal-500" },
              { icon: "🏆", title: "Competitions", desc: "Weekly coding contests", color: "from-amber-400 to-orange-500" },
              { icon: "📊", title: "Analytics", desc: "AI-powered insights", color: "from-blue-400 to-indigo-500" },
              { icon: "🎓", title: "Certificates", desc: "Shareable credentials", color: "from-pink-400 to-rose-500" }
            ].map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 transition-all cursor-pointer">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="font-bold text-white mt-2">{item.title}</h3>
                <p className="text-white/70 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features - Detailed */}
      <section className="grid md:grid-cols-4 gap-6">
        {[
          {
            icon: "🎯",
            title: "Practice Tests",
            features: ["Company-specific questions", "Timed mock exams", "AI proctoring", "Instant results"],
            stats: "1000+ Questions",
            color: "from-emerald-500 to-teal-600",
            bgLight: "bg-emerald-50"
          },
          {
            icon: "🏆",
            title: "Competitions",
            features: ["Weekly coding contests", "Global leaderboard", "Win prizes & goodies", "Certificate rewards"],
            stats: "500+ Participants/Week",
            color: "from-amber-500 to-orange-600",
            bgLight: "bg-amber-50"
          },
          {
            icon: "📊",
            title: "Analytics",
            features: ["Performance tracking", "Weak area detection", "Improvement trends", "Peer comparison"],
            stats: "AI-Powered Insights",
            color: "from-blue-500 to-indigo-600",
            bgLight: "bg-blue-50"
          },
          {
            icon: "🎓",
            title: "Certificates",
            features: ["Skill verification", "LinkedIn shareable", "QR code verified", "Industry recognized"],
            stats: "10K+ Issued",
            color: "from-pink-500 to-rose-600",
            bgLight: "bg-pink-50"
          }
        ].map((item, idx) => (
          <div key={idx} className={`${item.bgLight} rounded-2xl p-6 border hover:shadow-lg transition-all`}>
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-4`}>
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
            <p className={`text-sm font-medium mt-1 bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>{item.stats}</p>
            <ul className="mt-4 space-y-2">
              {item.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Tech Roadmaps Preview Section */}
      <section className="rounded-3xl overflow-hidden" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)'
      }}>
        <div className="p-8">
          <div className="text-center mb-8">
            <span className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-3">
              🗺️ Career Roadmaps
            </span>
            <h2 className="text-3xl font-bold text-white">Tech Learning Paths</h2>
            <p className="text-purple-200 mt-2">Visual flowcharts from Beginner to Pro for every tech stack</p>
          </div>

          {/* Roadmap Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {roadmapPreviews.map((roadmap, idx) => (
              <div 
                key={idx} 
                className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center border border-white/20 hover:bg-white/20 transition-all"
              >
                <span className="text-4xl block mb-3">{roadmap.icon}</span>
                <h3 className="font-bold text-white">{roadmap.title}</h3>
                <p className="text-purple-300 text-sm mt-1">{roadmap.duration}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Link 
              to="/roadmaps" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
            >
              <span>🗺️</span>
              <span>Explore All Roadmaps</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Last Year Recruitment Stats */}
      <section>
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-3">
            📈 2024 Hiring Stats
          </span>
          <h2 className="text-3xl font-bold text-slate-800">Last Year Recruitment Highlights</h2>
          <p className="text-slate-500 mt-2">Top companies that hired freshers in 2024</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {recruitmentData.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
              <div className={`h-2 bg-gradient-to-r ${item.color}`}></div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{item.company}</h3>
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                    <img 
                      src={COMPANY_LOGOS[item.company.toLowerCase()]} 
                      alt={item.company}
                      className="w-8 h-8 object-contain"
                      onError={(e) => { e.currentTarget.parentElement.innerHTML = '🏢'; }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{item.hired}</div>
                    <div className="text-xs text-slate-500">Freshers Hired</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{item.package}</div>
                    <div className="text-xs text-slate-500">Package Range</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-slate-500 mb-2">Popular Roles:</div>
                  <div className="flex flex-wrap gap-2">
                    {item.roles.map((role, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interview Tips Section - Interactive */}
      <section className="rounded-3xl p-8" style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)'
      }}>
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 bg-amber-600 text-white rounded-full text-sm font-medium mb-3">
            💡 Interview Practice
          </span>
          <h2 className="text-3xl font-bold text-slate-800">Master Your Interviews</h2>
          <p className="text-amber-800 mt-2">Click on any category to start practicing real interview questions</p>
        </div>

        {/* Practice Categories */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { icon: "🧮", title: "DSA", desc: "Data Structures", color: "from-blue-500 to-indigo-600" },
            { icon: "🎭", title: "Behavioral", desc: "STAR Method", color: "from-purple-500 to-pink-600" },
            { icon: "💻", title: "Technical", desc: "CS Concepts", color: "from-green-500 to-emerald-600" },
            { icon: "🤝", title: "HR Round", desc: "Soft Skills", color: "from-amber-500 to-orange-600" },
            { icon: "🏗️", title: "System Design", desc: "Architecture", color: "from-cyan-500 to-blue-600" },
            { icon: "🧠", title: "Aptitude", desc: "Reasoning", color: "from-rose-500 to-red-600" }
          ].map((cat, idx) => (
            <Link
              key={idx}
              to="/interview-practice"
              className="bg-white/80 backdrop-blur rounded-2xl p-5 text-center hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <h3 className="font-bold text-slate-800">{cat.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>

        {/* Quick Tips */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {interviewTips.slice(0, 3).map((tip, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur rounded-2xl p-6 hover:shadow-lg transition-all">
              <span className="text-4xl">{tip.icon}</span>
              <h3 className="font-bold text-slate-800 mt-3">{tip.title}</h3>
              <p className="text-slate-600 mt-2 text-sm">{tip.tip}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            to="/interview-practice"
            className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white rounded-xl font-bold text-lg hover:bg-amber-700 hover:shadow-lg transition-all"
          >
            <span>🎯</span>
            <span>Start Interview Practice</span>
            <span>→</span>
          </Link>
        </div>

        {/* Quick Checklist */}
        <div className="mt-8 bg-white/60 backdrop-blur rounded-2xl p-6">
          <h3 className="font-bold text-slate-800 mb-4">🎯 Quick Checklist Before Interview</h3>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              "✅ Resume updated & reviewed",
              "✅ Company research done",
              "✅ Common questions practiced",
              "✅ Technical concepts revised",
              "✅ Projects demo ready",
              "✅ Questions to ask prepared",
              "✅ Proper attire selected",
              "✅ Interview link/location confirmed"
            ].map((item, idx) => (
              <div key={idx} className="text-sm text-slate-700">{item}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-3">
            Trusted by Industry Leaders
          </span>
          <h2 className="text-3xl font-bold text-slate-800">Practice for Top Companies</h2>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-7 gap-6 items-center">
          {COMPANIES.map(c => (
            <div key={c.id} className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center bg-white p-2 border shadow-sm">
                <img src={COMPANY_LOGOS[c.id]} alt={c.name} className="w-12 h-12 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <span className="text-sm font-medium text-slate-700">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: "50K+", label: "Active Users", icon: "👥" },
          { value: "1000+", label: "Practice Questions", icon: "📝" },
          { value: "7", label: "Top Companies", icon: "🏢" },
          { value: "95%", label: "Success Rate", icon: "📈" }
        ].map((stat, idx) => (
          <div key={idx} className="text-center p-6 rounded-2xl bg-white shadow-lg">
            <span className="text-3xl">{stat.icon}</span>
            <div className="text-3xl font-bold mt-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-slate-500 text-sm">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="text-center py-12 rounded-3xl" style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)'
        }}>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Start Your Journey?</h2>
          <p className="text-purple-200 mt-4 max-w-xl mx-auto">
            Join 50,000+ students preparing for their dream careers with Gtechno
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="px-8 py-4 bg-white text-purple-700 rounded-xl font-bold text-lg hover:shadow-lg transition-all">
              🚀 Create Free Account
            </Link>
            <Link to="/roadmaps" className="px-8 py-4 bg-white/10 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
              🗺️ Explore Roadmaps
            </Link>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section>
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-3">
            ⭐ Success Stories
          </span>
          <h2 className="text-3xl font-bold text-slate-800">What Our Users Say</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Abhishek", role: "Software Developer at TCS", quote: "Gtechno's practice tests are incredibly realistic! Landed my dream job!", avatar: "👨‍💻", color: "from-blue-500 to-indigo-600" },
            { name: "Kiran", role: "Data Engineer at Infosys", quote: "My scores improved by 40% in just 2 weeks of practice!", avatar: "👨‍🎓", color: "from-emerald-500 to-teal-600" },
            { name: "MD Hassan", role: "Full Stack Developer at Wipro", quote: "Best platform for company-specific practice!", avatar: "👨‍💼", color: "from-purple-500 to-pink-600" },
            { name: "Kathivaran", role: "Cloud Engineer at Amazon", quote: "The proctoring feature simulates real exam conditions perfectly!", avatar: "🧑‍💻", color: "from-orange-500 to-red-600" },
            { name: "S Chaitra", role: "Business Analyst at Google", quote: "Made tech preparation easy for non-tech background!", avatar: "👩‍💼", color: "from-cyan-500 to-blue-600" },
            { name: "Amrutha", role: "Software Engineer at Microsoft", quote: "From zero confidence to cracking Microsoft! Thank you Gtechno!", avatar: "👩‍💻", color: "from-pink-500 to-rose-600" }
          ].map((testimonial, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-2xl`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-slate-600 italic">"{testimonial.quote}"</p>
              <div className="flex gap-1 mt-4 text-amber-400">
                {[1,2,3,4,5].map(i => <span key={i}>⭐</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Chatbot - Fixed Position */}
      <AIChatbot />
    </div>
  );
}
