import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "👋 Hi! I'm GtechBot, your AI assistant. I can help you with study plans, tips, roadmaps, and more! How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // AI Response Generator
  const generateResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Greetings
    if (lowerMessage.match(/hi|hello|hey|good morning|good afternoon|good evening/)) {
      return {
        text: "Hello! 👋 I'm here to help you succeed! Would you like help with:\n• 📚 Study plans\n• 🗺️ Tech roadmaps\n• 💡 Interview tips\n• 📞 Contact information\n• 🎯 Test recommendations",
        quickReplies: ["Study Plans", "Tech Roadmaps", "Interview Tips", "Contact Info"]
      };
    }

    // Study Plans
    if (lowerMessage.match(/study plan|plan|schedule|how to study|preparation plan/)) {
      return {
        text: "📚 Here's a personalized study plan for you:\n\n**Week 1-2: Foundation**\n• Review core concepts (DSA, OOP, DBMS)\n• Take 2-3 free mock tests\n• Focus on weak areas\n\n**Week 3-4: Practice**\n• Solve 50+ coding problems\n• Practice behavioral questions\n• Take advanced tests\n\n**Week 5-6: Interview Prep**\n• Mock interviews\n• System design practice\n• Final revision\n\nWould you like a detailed plan for a specific company?",
        quickReplies: ["TCS Plan", "Google Plan", "Microsoft Plan", "Custom Plan"]
      };
    }

    // Roadmaps
    if (lowerMessage.match(/roadmap|path|career|tech stack|full stack|python|java|dot net|\.net/)) {
      return {
        text: "🗺️ I can guide you through tech roadmaps! We have interactive roadmaps for:\n\n• 🚀 Full Stack Development\n• 🐍 Python Development\n• ☕ Java Development\n• 🔷 .NET Development\n• 📊 Data Science & AI\n• 🛠️ DevOps Engineering\n\nClick on 'Roadmaps' in the navigation or visit /roadmaps to see detailed flowcharts from beginner to pro level!",
        quickReplies: ["Full Stack", "Python", "Java", "View Roadmaps"]
      };
    }

    // Interview Tips
    if (lowerMessage.match(/interview|tip|advice|how to prepare|hr round|technical round/)) {
      return {
        text: "💡 Interview Tips:\n\n**Technical Round:**\n• Practice coding on LeetCode/GeeksforGeeks\n• Revise core CS concepts\n• Prepare for system design (for senior roles)\n• Practice explaining your thought process\n\n**HR Round:**\n• Use STAR method for behavioral questions\n• Research the company\n• Prepare questions to ask them\n• Be confident and authentic\n\n**Pro Tip:** Use our Interview Practice section to practice real questions! Click 'Practice' in the navigation.",
        quickReplies: ["Practice Now", "STAR Method", "Coding Tips", "HR Tips"]
      };
    }

    // Contact
    if (lowerMessage.match(/contact|email|phone|address|reach|support|help/)) {
      return {
        text: "📞 Contact Information:\n\n**Email:** support@gtechno.com\n**Phone:** +91-9876543210\n**Address:** 123 Tech Park, Bangalore, India\n**Office Hours:** Mon-Fri, 9 AM - 6 PM\n\nYou can also visit our Contact page for a contact form and social media links!",
        quickReplies: ["Visit Contact Page", "Email Support", "Social Media"]
      };
    }

    // Test Recommendations
    if (lowerMessage.match(/test|exam|mock|which test|recommend|suggest/)) {
      return {
        text: "🎯 Test Recommendations:\n\n**For Beginners:**\n• Start with free Core tests (TCS, Google, Wipro)\n• Focus on fundamentals\n• Build confidence gradually\n\n**For Intermediate:**\n• Try Advanced tests\n• Practice time management\n• Review detailed solutions\n\n**For Advanced:**\n• Premium tests with complex scenarios\n• System design questions\n• Real interview simulations\n\nWhich company are you targeting?",
        quickReplies: ["TCS Tests", "Google Tests", "Microsoft Tests", "View All"]
      };
    }

    // Pricing
    if (lowerMessage.match(/price|cost|payment|premium|free|purchase|buy/)) {
      return {
        text: "💰 Pricing Information:\n\n**Free Tests:**\n• Core mock tests for major companies\n• Basic analytics\n• Standard proctoring\n\n**Premium Tests (₹129-₹399):**\n• Advanced questions\n• Detailed solutions\n• Performance analytics\n• Certificate on completion\n• Lifetime access\n\n**Special Offers:**\n• Use coupon code 'FIRST50' for 50% off\n• Student discounts available\n• Bulk purchase discounts\n\nCheck the dashboard to see all available tests!",
        quickReplies: ["View Tests", "Payment Info", "Coupons"]
      };
    }

    // Features
    if (lowerMessage.match(/feature|what can|capabilities|help|assist/)) {
      return {
        text: "✨ I can help you with:\n\n• 📚 Personalized study plans\n• 🗺️ Tech career roadmaps\n• 💡 Interview preparation tips\n• 🎯 Test recommendations\n• 📞 Contact & support info\n• 💰 Pricing & payment help\n• 🏆 Gamification & achievements\n• 📊 Performance tracking\n\nJust ask me anything! What would you like to know?",
        quickReplies: ["Study Plan", "Roadmaps", "Tips", "Tests"]
      };
    }

    // Company-specific
    if (lowerMessage.match(/tcs|google|microsoft|amazon|meta|wipro|infosys/)) {
      const company = lowerMessage.match(/(tcs|google|microsoft|amazon|meta|wipro|infosys)/)?.[0];
      return {
        text: `🏢 ${company.charAt(0).toUpperCase() + company.slice(1)} Information:\n\n**Available Tests:**\n• Core Mock Test (${company === 'microsoft' || company === 'amazon' || company === 'meta' ? 'Premium' : 'Free'})\n• Advanced Mock Test (Premium)\n\n**Preparation Tips:**\n• Research ${company}'s interview process\n• Practice company-specific questions\n• Review their tech stack\n• Prepare for their culture fit round\n\nWould you like to start a ${company} test?`,
        quickReplies: ["Start Test", "Study Plan", "Interview Tips"]
      };
    }

    // Default responses
    const defaultResponses = [
      "That's interesting! Can you tell me more about what you need help with?",
      "I'm here to help! Try asking about study plans, roadmaps, interview tips, or test recommendations.",
      "Let me help you with that! You can ask me about:\n• Study plans\n• Tech roadmaps\n• Interview tips\n• Test recommendations\n• Contact information",
      "I understand you're looking for help. Could you be more specific? I can assist with study plans, roadmaps, tips, and more!"
    ];

    return {
      text: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
      quickReplies: ["Study Plans", "Roadmaps", "Tips", "Help"]
    };
  };

  const handleSend = (message = null) => {
    const userMessage = message || input.trim();
    if (!userMessage) return;

    // Add user message
    const newMessages = [
      ...messages,
      {
        type: "user",
        text: userMessage,
        timestamp: new Date()
      }
    ];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = generateResponse(userMessage);
      setMessages([
        ...newMessages,
        {
          type: "bot",
          text: response.text,
          quickReplies: response.quickReplies,
          timestamp: new Date()
        }
      ]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (reply) => {
    handleSend(reply);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all hover:scale-110 ${
          isOpen
            ? "bg-gradient-to-br from-purple-600 to-pink-600"
            : "bg-gradient-to-br from-blue-500 to-purple-600 animate-bounce"
        }`}
        aria-label="Toggle AI Chatbot"
      >
        {isOpen ? "✕" : "🤖"}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border-2 border-purple-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                  🤖
                </div>
                <div>
                  <h3 className="font-bold">GtechBot</h3>
                  <p className="text-xs text-white/80">AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                <span className="text-xs">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50 to-white">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.type === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-white text-slate-800 shadow-md border border-slate-200"
                  }`}
                >
                  <p className="whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>
                  {msg.quickReplies && msg.type === "bot" && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.quickReplies.map((reply, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickReply(reply)}
                          className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors"
                        >
                          {reply}
                        </button>
                      ))}
                    </div>
                  )}
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl p-3 shadow-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none text-sm"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">
              Ask about plans, tips, roadmaps, or contact info
            </p>
          </div>
        </div>
      )}
    </>
  );
}

