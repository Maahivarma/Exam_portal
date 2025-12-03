import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-10 md:p-16" style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #8b5cf6 100%)'
      }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-56 h-56 bg-cyan-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm mb-6">
            <span>🏢</span>
            <span>About Our Company</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            About <span className="text-yellow-300">Gtechno</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Empowering careers through innovative assessment solutions and AI-powered learning platforms
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
            Our Story
          </span>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Transforming Education & Recruitment
          </h2>
          <p className="text-slate-600 mb-4">
            Founded in 2020, <strong>Gtechno</strong> emerged from a simple idea: make quality education 
            and fair recruitment accessible to everyone. We believe that talent exists everywhere, 
            and our mission is to help discover and nurture it.
          </p>
          <p className="text-slate-600 mb-4">
            Our AI-powered assessment platform has helped over 50,000+ students practice for 
            technical interviews, while partnering with 100+ companies to streamline their 
            hiring process.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">2020</div>
              <div className="text-sm text-slate-500">Founded</div>
            </div>
            <div className="h-12 w-px bg-slate-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">50K+</div>
              <div className="text-sm text-slate-500">Users</div>
            </div>
            <div className="h-12 w-px bg-slate-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">100+</div>
              <div className="text-sm text-slate-500">Partners</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: "🎯", title: "Our Mission", desc: "Democratize access to quality technical education", color: "from-blue-500 to-cyan-500" },
            { icon: "👁️", title: "Our Vision", desc: "Be the global leader in AI-powered assessments", color: "from-purple-500 to-pink-500" },
            { icon: "💎", title: "Our Values", desc: "Innovation, Integrity, Inclusivity", color: "from-amber-500 to-orange-500" },
            { icon: "🚀", title: "Our Goal", desc: "Help 1 million students land dream jobs", color: "from-emerald-500 to-teal-500" }
          ].map((item, idx) => (
            <div key={idx} className={`p-5 rounded-2xl text-white bg-gradient-to-br ${item.color}`}>
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-bold mt-3">{item.title}</h3>
              <p className="text-white/80 text-sm mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What We Offer */}
      <section className="rounded-3xl p-8 md:p-12" style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)'
      }}>
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
            Our Services
          </span>
          <h2 className="text-3xl font-bold text-slate-800">What We Offer</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "📝",
              title: "Practice Assessments",
              description: "Company-specific mock tests with real exam patterns from Google, Amazon, TCS, and more.",
              features: ["35+ questions per test", "MCQ & Subjective", "Timed tests", "Instant results"]
            },
            {
              icon: "🤖",
              title: "AI Proctoring",
              description: "State-of-the-art proctoring with face detection, noise monitoring, and integrity checks.",
              features: ["Face detection", "Multi-face alerts", "Tab monitoring", "Noise detection"]
            },
            {
              icon: "📊",
              title: "Smart Analytics",
              description: "Detailed performance analysis with personalized improvement suggestions.",
              features: ["Score breakdown", "Weak area analysis", "Progress tracking", "Study tips"]
            }
          ].map((service, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <span className="text-4xl">{service.icon}</span>
              <h3 className="text-xl font-bold text-slate-800 mt-4">{service.title}</h3>
              <p className="text-slate-600 mt-2 text-sm">{service.description}</p>
              <ul className="mt-4 space-y-2">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section>
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium mb-3">
            Meet Our Team
          </span>
          <h2 className="text-3xl font-bold text-slate-800">The People Behind Gtechno</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { name: "Mahesh Varma", role: "Founder & CEO", avatar: "👨‍💼", color: "from-purple-500 to-indigo-600" },
            { name: "Kiran Kumar", role: "CTO", avatar: "👨‍💻", color: "from-blue-500 to-cyan-600" },
            { name: "Abhishek Reddy", role: "Head of Product", avatar: "👨‍🎨", color: "from-emerald-500 to-teal-600" },
            { name: "Amrutha S", role: "Head of Operations", avatar: "👩‍💼", color: "from-pink-500 to-rose-600" }
          ].map((member, idx) => (
            <div key={idx} className="text-center group">
              <div className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-5xl shadow-lg group-hover:scale-110 transition-transform`}>
                {member.avatar}
              </div>
              <h3 className="font-bold text-slate-800 mt-4">{member.name}</h3>
              <p className="text-slate-500 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Company Details */}
      <section className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Company Information</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              <span className="text-2xl">🏢</span>
              <div>
                <h4 className="font-semibold text-slate-800">Company Name</h4>
                <p className="text-slate-600">Gtechno Solutions Pvt. Ltd.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              <span className="text-2xl">📍</span>
              <div>
                <h4 className="font-semibold text-slate-800">Headquarters</h4>
                <p className="text-slate-600">Bangalore, Karnataka, India</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              <span className="text-2xl">🌐</span>
              <div>
                <h4 className="font-semibold text-slate-800">Website</h4>
                <p className="text-purple-600">www.gtechno.in</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              <span className="text-2xl">📧</span>
              <div>
                <h4 className="font-semibold text-slate-800">Email</h4>
                <p className="text-slate-600">contact@gtechno.in</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              <span className="text-2xl">📞</span>
              <div>
                <h4 className="font-semibold text-slate-800">Phone</h4>
                <p className="text-slate-600">+91 80 1234 5678</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
              <span className="text-2xl">🕐</span>
              <div>
                <h4 className="font-semibold text-slate-800">Business Hours</h4>
                <p className="text-slate-600">Mon - Fri: 9:00 AM - 6:00 PM IST</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 rounded-3xl" style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)'
      }}>
        <h2 className="text-3xl font-bold text-white">Join the Gtechno Community</h2>
        <p className="text-white/80 mt-3 max-w-xl mx-auto">
          Start your journey towards your dream career today
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link 
            to="/signup" 
            className="px-8 py-4 bg-white text-purple-700 rounded-xl font-bold hover:shadow-lg transition-all"
          >
            🚀 Get Started Free
          </Link>
          <Link 
            to="/contact" 
            className="px-8 py-4 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-all"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
