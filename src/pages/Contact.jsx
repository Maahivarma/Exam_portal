import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-10 md:p-16" style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)'
      }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-56 h-56 bg-emerald-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm mb-6">
            <span>💬</span>
            <span>We'd Love to Hear From You</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Get in <span className="text-yellow-300">Touch</span>
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Have questions? We're here to help and answer any question you might have
          </p>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          {[
            {
              icon: "📍",
              title: "Visit Us",
              lines: ["Gtechno Solutions Pvt. Ltd.", "123 Tech Park, Whitefield", "Bangalore - 560066", "Karnataka, India"],
              color: "from-blue-500 to-indigo-600"
            },
            {
              icon: "📧",
              title: "Email Us",
              lines: ["General: contact@gtechno.in", "Support: support@gtechno.in", "Careers: careers@gtechno.in"],
              color: "from-purple-500 to-pink-600"
            },
            {
              icon: "📞",
              title: "Call Us",
              lines: ["+91 80 1234 5678", "+91 98765 43210", "Mon-Fri: 9AM - 6PM IST"],
              color: "from-emerald-500 to-teal-600"
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-4`}>
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3">{item.title}</h3>
              {item.lines.map((line, i) => (
                <p key={i} className="text-slate-600 text-sm">{line}</p>
              ))}
            </div>
          ))}

          {/* Social Links */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {[
                { icon: "📘", label: "Facebook", color: "bg-blue-100 hover:bg-blue-200 text-blue-600" },
                { icon: "🐦", label: "Twitter", color: "bg-sky-100 hover:bg-sky-200 text-sky-600" },
                { icon: "💼", label: "LinkedIn", color: "bg-indigo-100 hover:bg-indigo-200 text-indigo-600" },
                { icon: "📸", label: "Instagram", color: "bg-pink-100 hover:bg-pink-200 text-pink-600" }
              ].map((social, idx) => (
                <button
                  key={idx}
                  className={`w-12 h-12 rounded-xl ${social.color} flex items-center justify-center text-xl transition-colors`}
                  title={social.label}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center text-4xl mb-6">
                  ✅
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Message Sent!</h2>
                <p className="text-slate-600 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Send us a Message</h2>
                <p className="text-slate-500 mb-6">Fill out the form below and we'll respond as soon as possible</p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                      <option value="careers">Careers</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Tell us how we can help you..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all ${
                      isSubmitting 
                        ? 'opacity-70 cursor-wait' 
                        : 'hover:shadow-lg hover:shadow-emerald-500/30'
                    }`}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Sending...
                      </span>
                    ) : (
                      "📨 Send Message"
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map Section (Placeholder) */}
      <section className="rounded-3xl overflow-hidden shadow-lg" style={{ height: '400px' }}>
        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl">🗺️</span>
            <p className="mt-4 text-slate-600">Interactive Map</p>
            <p className="text-sm text-slate-500">Bangalore, Karnataka, India</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="rounded-3xl p-8 md:p-12" style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)'
      }}>
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 bg-amber-600 text-white rounded-full text-sm font-medium mb-3">
            ❓ FAQ
          </span>
          <h2 className="text-3xl font-bold text-slate-800">Frequently Asked Questions</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[
            {
              q: "How do I reset my password?",
              a: "Click on 'Forgot Password' on the login page and follow the instructions sent to your email."
            },
            {
              q: "Are the tests free?",
              a: "Yes! All practice tests are completely free. Premium features may be added in the future."
            },
            {
              q: "How does AI proctoring work?",
              a: "Our AI monitors your webcam for face detection, checks for multiple persons, and tracks tab switches."
            },
            {
              q: "Can I retake a test?",
              a: "Absolutely! You can take any test multiple times to improve your scores."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur rounded-2xl p-5">
              <h4 className="font-bold text-slate-800 flex items-start gap-2">
                <span className="text-amber-600">Q:</span>
                {faq.q}
              </h4>
              <p className="text-slate-600 mt-2 text-sm pl-6">
                <span className="text-emerald-600 font-medium">A:</span> {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
