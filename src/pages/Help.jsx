import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Help() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      category: "Getting Started",
      icon: "🚀",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click on 'Sign Up' in the top navigation, fill in your details (username, email, password), and you're ready to go!"
        },
        {
          q: "Is Gtechno free to use?",
          a: "Yes! All our practice tests and features are completely free. We believe quality education should be accessible to everyone."
        },
        {
          q: "What browsers are supported?",
          a: "Gtechno works best on Google Chrome and Microsoft Edge. Make sure you're using the latest version for the best experience."
        }
      ]
    },
    {
      category: "Taking Tests",
      icon: "📝",
      questions: [
        {
          q: "How do I start a test?",
          a: "After logging in, go to Dashboard, select a company, and click 'Start' on any test. You'll see instructions before the test begins."
        },
        {
          q: "Can I pause a test?",
          a: "No, tests cannot be paused once started. This simulates real exam conditions. Make sure you have enough time before starting."
        },
        {
          q: "What happens if my internet disconnects?",
          a: "Your answers are auto-saved. If you reconnect quickly, you can continue. However, if the session times out, you may need to retake the test."
        },
        {
          q: "Can I retake a test?",
          a: "Absolutely! You can take any test multiple times to improve your scores and track your progress."
        }
      ]
    },
    {
      category: "Proctoring",
      icon: "📷",
      questions: [
        {
          q: "Why do I need to allow camera access?",
          a: "Our AI proctoring system uses your camera to ensure exam integrity by detecting your face and checking for multiple persons."
        },
        {
          q: "What does the proctoring monitor?",
          a: "We monitor: face presence, multiple faces, tab switches, fullscreen exits, and background noise levels."
        },
        {
          q: "What if my face isn't detected?",
          a: "Make sure you're in a well-lit room and positioned directly in front of your camera. Avoid bright backlights."
        },
        {
          q: "Is my webcam data stored?",
          a: "Snapshots are stored locally in your browser during the test. We don't upload or store your video data on our servers."
        }
      ]
    },
    {
      category: "Results & Scoring",
      icon: "📊",
      questions: [
        {
          q: "How is my score calculated?",
          a: "MCQ questions are auto-graded. Subjective answers use AI-powered similarity matching with reference answers. Overall score combines both."
        },
        {
          q: "What do the suggestions mean?",
          a: "After each test, you receive personalized feedback based on your performance, time management, and proctoring behavior."
        },
        {
          q: "Can I see my past results?",
          a: "Your most recent submission is saved locally. We're working on a history feature for future updates."
        }
      ]
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-10 md:p-16" style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)'
      }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-20 w-56 h-56 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm mb-6">
            <span>❓</span>
            <span>We're Here to Help</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Help <span className="text-yellow-200">Center</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of Gtechno
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: "🚀", title: "Getting Started", desc: "New to Gtechno?" },
          { icon: "📝", title: "Taking Tests", desc: "Test instructions" },
          { icon: "📷", title: "Proctoring", desc: "Camera & security" },
          { icon: "📧", title: "Contact Support", desc: "Need more help?", link: "/contact" }
        ].map((item, idx) => (
          <Link
            key={idx}
            to={item.link || "#"}
            className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group"
          >
            <span className="text-3xl group-hover:scale-110 inline-block transition-transform">{item.icon}</span>
            <h3 className="font-bold text-slate-800 mt-3">{item.title}</h3>
            <p className="text-sm text-slate-500">{item.desc}</p>
          </Link>
        ))}
      </section>

      {/* System Requirements */}
      <section className="bg-white rounded-3xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span>💻</span> System Requirements
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700">Minimum Requirements</h3>
            {[
              { icon: "🌐", text: "Chrome 80+ or Edge 80+ browser" },
              { icon: "📷", text: "Webcam with 480p resolution" },
              { icon: "🎤", text: "Microphone (for noise detection)" },
              { icon: "📶", text: "Stable internet connection (1 Mbps+)" },
              { icon: "🖥️", text: "Screen resolution: 1280x720 minimum" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <span className="text-xl">{item.icon}</span>
                <span className="text-slate-600">{item.text}</span>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700">Before Starting a Test</h3>
            {[
              { icon: "✅", text: "Allow camera & microphone permissions" },
              { icon: "✅", text: "Close unnecessary browser tabs" },
              { icon: "✅", text: "Ensure stable internet connection" },
              { icon: "✅", text: "Sit in a well-lit, quiet room" },
              { icon: "✅", text: "Keep your face clearly visible to camera" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <span className="text-xl text-green-600">{item.icon}</span>
                <span className="text-slate-600">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section>
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-3">
            📚 Knowledge Base
          </span>
          <h2 className="text-3xl font-bold text-slate-800">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-6">
          {faqs.map((category, catIdx) => (
            <div key={catIdx} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  {category.category}
                </h3>
              </div>
              
              <div className="divide-y">
                {category.questions.map((faq, faqIdx) => {
                  const isOpen = openFaq === `${catIdx}-${faqIdx}`;
                  return (
                    <div key={faqIdx}>
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : `${catIdx}-${faqIdx}`)}
                        className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-medium text-slate-800">{faq.q}</span>
                        <span className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-slate-600 bg-slate-50 border-l-4 border-amber-400">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="text-center py-12 rounded-3xl" style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)'
      }}>
        <span className="text-5xl">🤔</span>
        <h2 className="text-3xl font-bold text-white mt-4">Still Have Questions?</h2>
        <p className="text-white/80 mt-3 max-w-xl mx-auto">
          Can't find what you're looking for? Our support team is happy to help!
        </p>
        <div className="mt-8">
          <Link 
            to="/contact" 
            className="px-8 py-4 bg-white text-purple-700 rounded-xl font-bold hover:shadow-lg transition-all inline-block"
          >
            📧 Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}
