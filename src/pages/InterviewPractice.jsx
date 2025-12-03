import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function InterviewPractice() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState({ correct: 0, attempted: 0 });

  // Interview Practice Categories
  const categories = {
    dsa: {
      title: "Data Structures & Algorithms",
      icon: "🧮",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      description: "Practice coding problems commonly asked in interviews",
      questions: [
        {
          q: "What is the time complexity of binary search?",
          a: "O(log n) - Binary search divides the search interval in half each time, making it logarithmic.",
          hint: "Think about how many times you can divide n by 2",
          difficulty: "Easy"
        },
        {
          q: "Explain the difference between Stack and Queue.",
          a: "Stack follows LIFO (Last In First Out) - like a stack of plates. Queue follows FIFO (First In First Out) - like a line at a store. Stack uses push/pop, Queue uses enqueue/dequeue.",
          hint: "Think about real-world examples",
          difficulty: "Easy"
        },
        {
          q: "How would you detect a cycle in a linked list?",
          a: "Use Floyd's Cycle Detection (Tortoise and Hare): Use two pointers, one moving 1 step and another moving 2 steps. If they meet, there's a cycle. Time: O(n), Space: O(1).",
          hint: "Two pointers with different speeds",
          difficulty: "Medium"
        },
        {
          q: "What is Dynamic Programming? Give an example.",
          a: "DP is solving complex problems by breaking them into simpler subproblems and storing results to avoid redundant calculations. Example: Fibonacci - instead of recursive O(2^n), use memoization for O(n).",
          hint: "Overlapping subproblems + optimal substructure",
          difficulty: "Medium"
        },
        {
          q: "Explain how HashMap works internally in Java.",
          a: "HashMap uses an array of buckets. Key's hashCode() determines bucket index. Collisions handled via linked list (or tree in Java 8+). Load factor (0.75) triggers resizing. Average O(1) for get/put.",
          hint: "Hashing + collision handling",
          difficulty: "Hard"
        }
      ]
    },
    behavioral: {
      title: "Behavioral Questions",
      icon: "🎭",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      description: "Practice STAR method responses for HR rounds",
      questions: [
        {
          q: "Tell me about yourself.",
          a: "Structure: Present → Past → Future. Start with current role/education, highlight relevant experience, mention key achievements, and express enthusiasm for this opportunity. Keep it 2-3 minutes.",
          hint: "Use the Present-Past-Future formula",
          difficulty: "Easy"
        },
        {
          q: "Describe a time you faced a conflict at work/college.",
          a: "STAR Method: Situation (team disagreement), Task (resolve without escalation), Action (listened to all sides, proposed compromise), Result (project completed successfully, better team communication).",
          hint: "Use STAR: Situation, Task, Action, Result",
          difficulty: "Medium"
        },
        {
          q: "What is your greatest weakness?",
          a: "Choose a real weakness that isn't critical for the job. Show self-awareness and improvement steps. Example: 'I used to struggle with public speaking, so I joined Toastmasters and now present regularly.'",
          hint: "Be honest but show growth",
          difficulty: "Medium"
        },
        {
          q: "Why should we hire you?",
          a: "Connect your skills to job requirements. Highlight unique value you bring. Show enthusiasm and cultural fit. Example: 'My combination of technical skills in X, experience with Y, and passion for Z makes me ideal for this role.'",
          hint: "Match your skills to their needs",
          difficulty: "Medium"
        },
        {
          q: "Where do you see yourself in 5 years?",
          a: "Show ambition aligned with company growth. Be realistic but aspirational. Example: 'I see myself as a senior developer leading projects, mentoring juniors, and contributing to architectural decisions.'",
          hint: "Balance ambition with realism",
          difficulty: "Easy"
        }
      ]
    },
    technical: {
      title: "Technical Concepts",
      icon: "💻",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      description: "Core CS concepts asked in technical rounds",
      questions: [
        {
          q: "What is the difference between Process and Thread?",
          a: "Process: Independent execution unit with own memory space. Thread: Lightweight unit within a process, shares memory. Threads are faster to create/switch. Inter-process communication is slower than inter-thread.",
          hint: "Think about memory and resource sharing",
          difficulty: "Medium"
        },
        {
          q: "Explain REST API principles.",
          a: "REST: Stateless, Client-Server, Cacheable, Uniform Interface, Layered System. Uses HTTP methods (GET, POST, PUT, DELETE). Resources identified by URIs. JSON/XML for data exchange.",
          hint: "Stateless + HTTP methods + Resources",
          difficulty: "Easy"
        },
        {
          q: "What is ACID in databases?",
          a: "Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions don't interfere), Durability (committed data persists). Ensures reliable database transactions.",
          hint: "Four guarantees for transactions",
          difficulty: "Medium"
        },
        {
          q: "Explain OOP principles with examples.",
          a: "Encapsulation (private data, public methods), Inheritance (class extends another), Polymorphism (same method, different behavior), Abstraction (hide complexity, show essentials). Example: Animal → Dog, Cat with speak() method.",
          hint: "4 pillars of OOP",
          difficulty: "Easy"
        },
        {
          q: "What is the difference between SQL and NoSQL?",
          a: "SQL: Relational, structured schema, ACID, vertical scaling (MySQL, PostgreSQL). NoSQL: Non-relational, flexible schema, BASE, horizontal scaling (MongoDB, Redis). Choose based on data structure and scaling needs.",
          hint: "Structure vs Flexibility, Scaling approach",
          difficulty: "Medium"
        }
      ]
    },
    hr: {
      title: "HR & Situational",
      icon: "🤝",
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      description: "Common HR questions and situational scenarios",
      questions: [
        {
          q: "What are your salary expectations?",
          a: "Research market rates first. Give a range based on research. Example: 'Based on my skills and market research, I'm looking at ₹X-Y LPA, but I'm open to discussion based on the complete package.'",
          hint: "Research + Range + Flexibility",
          difficulty: "Medium"
        },
        {
          q: "Why do you want to leave your current job?",
          a: "Stay positive, focus on growth. Never badmouth. Example: 'I've learned a lot, but I'm seeking new challenges and growth opportunities that align with my career goals in [specific area].'",
          hint: "Focus on growth, not complaints",
          difficulty: "Medium"
        },
        {
          q: "How do you handle pressure and stress?",
          a: "Share specific strategies: prioritization, breaking tasks down, taking breaks, seeking help when needed. Give an example of successfully handling a stressful situation.",
          hint: "Specific strategies + Real example",
          difficulty: "Easy"
        },
        {
          q: "Describe a time you showed leadership.",
          a: "STAR: Led a college project/team initiative. Delegated tasks, motivated team, resolved conflicts, achieved goals. Show impact with numbers if possible.",
          hint: "Leadership isn't just about title",
          difficulty: "Medium"
        },
        {
          q: "Do you have any questions for us?",
          a: "Always say YES! Ask about: Team structure, typical day, growth opportunities, company culture, next steps. Shows genuine interest. Avoid salary questions in early rounds.",
          hint: "Always have 2-3 thoughtful questions",
          difficulty: "Easy"
        }
      ]
    },
    system: {
      title: "System Design",
      icon: "🏗️",
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-50",
      description: "High-level design questions for senior roles",
      questions: [
        {
          q: "How would you design a URL shortener like bit.ly?",
          a: "Components: Web servers, Application servers, Database, Cache. Flow: Generate unique short code (base62), store mapping, redirect on access. Consider: collision handling, analytics, expiration, rate limiting.",
          hint: "Think about uniqueness and scalability",
          difficulty: "Medium"
        },
        {
          q: "Design a basic chat application.",
          a: "Components: WebSocket servers for real-time, Message queue, Database for history, Redis for presence. Features: 1-1 chat, group chat, online status, message delivery status. Scale with sharding.",
          hint: "Real-time communication + persistence",
          difficulty: "Hard"
        },
        {
          q: "How would you design a rate limiter?",
          a: "Algorithms: Token Bucket, Leaky Bucket, Fixed Window, Sliding Window. Implementation: Redis for distributed systems. Consider: per-user vs global limits, response headers, graceful degradation.",
          hint: "Multiple algorithms, each with trade-offs",
          difficulty: "Medium"
        },
        {
          q: "Design Twitter's news feed.",
          a: "Push vs Pull model. Push: Fan-out on write (good for users with few followers). Pull: Fan-out on read (good for celebrities). Hybrid approach. Cache hot data. Rank by relevance and time.",
          hint: "Push vs Pull trade-offs",
          difficulty: "Hard"
        },
        {
          q: "How would you design a parking lot system?",
          a: "Classes: ParkingLot, Level, Spot, Vehicle (Car, Bike, Truck). Spot types by size. Entry/Exit gates. Ticketing system. Pricing strategy. Display board for availability. Consider: reservations, payments.",
          hint: "OOP design + real-world constraints",
          difficulty: "Medium"
        }
      ]
    },
    aptitude: {
      title: "Aptitude & Reasoning",
      icon: "🧠",
      color: "from-rose-500 to-red-600",
      bgColor: "bg-rose-50",
      description: "Quantitative and logical reasoning practice",
      questions: [
        {
          q: "A train travels 360 km in 4 hours. What is its speed in m/s?",
          a: "Speed = 360/4 = 90 km/hr. To convert to m/s: multiply by 5/18. So, 90 × 5/18 = 25 m/s.",
          hint: "km/hr to m/s: multiply by 5/18",
          difficulty: "Easy"
        },
        {
          q: "If 6 workers can complete a job in 8 days, how many days will 4 workers take?",
          a: "Work = Workers × Days = 6 × 8 = 48 worker-days. For 4 workers: 48/4 = 12 days. (Inverse proportion)",
          hint: "Total work remains constant",
          difficulty: "Easy"
        },
        {
          q: "Find the next number: 2, 6, 12, 20, 30, ?",
          a: "Differences: 4, 6, 8, 10, 12. Pattern: differences increase by 2. Next: 30 + 12 = 42.",
          hint: "Look at the differences between numbers",
          difficulty: "Medium"
        },
        {
          q: "A is twice as old as B. 5 years ago, A was 3 times B's age. Find their ages.",
          a: "Let B = x, A = 2x. Five years ago: 2x-5 = 3(x-5). Solving: 2x-5 = 3x-15, x = 10. So B = 10, A = 20.",
          hint: "Set up equations for current and past ages",
          difficulty: "Medium"
        },
        {
          q: "In a class, 60% passed in English, 70% in Math. 40% passed in both. What % failed in both?",
          a: "Using inclusion-exclusion: Passed at least one = 60 + 70 - 40 = 90%. Failed both = 100 - 90 = 10%.",
          hint: "P(A∪B) = P(A) + P(B) - P(A∩B)",
          difficulty: "Medium"
        }
      ]
    }
  };

  const handleNext = () => {
    if (selectedCategory && currentQuestion < categories[selectedCategory].questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
      setShowAnswer(false);
      setUserAnswer("");
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(curr => curr - 1);
      setShowAnswer(false);
      setUserAnswer("");
    }
  };

  const handleReveal = () => {
    setShowAnswer(true);
    setScore(s => ({ ...s, attempted: s.attempted + 1 }));
  };

  const markCorrect = () => {
    setScore(s => ({ ...s, correct: s.correct + 1 }));
    handleNext();
  };

  const resetCategory = () => {
    setSelectedCategory(null);
    setCurrentQuestion(0);
    setShowAnswer(false);
    setUserAnswer("");
    setScore({ correct: 0, attempted: 0 });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl p-8" style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)'
      }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-4">
                💡 Interview Practice
              </span>
              <h1 className="text-4xl font-bold text-white mb-2">Master Your Interviews</h1>
              <p className="text-amber-100">Practice with real interview questions. Click, practice, and ace your interviews!</p>
            </div>
            
            {selectedCategory && (
              <button
                onClick={resetCategory}
                className="px-6 py-3 bg-white text-amber-700 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                ← Back to Categories
              </button>
            )}
          </div>
        </div>
      </section>

      {!selectedCategory ? (
        /* Category Selection */
        <section className="grid md:grid-cols-3 gap-6">
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`${cat.bgColor} rounded-2xl p-6 text-left border-2 border-transparent hover:shadow-xl transition-all hover:-translate-y-1 group`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800">{cat.title}</h3>
              <p className="text-slate-600 mt-2 text-sm">{cat.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-slate-500">{cat.questions.length} questions</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${cat.color}`}>
                  Start Practice →
                </span>
              </div>
            </button>
          ))}
        </section>
      ) : (
        /* Practice Mode */
        <div className="grid md:grid-cols-3 gap-6">
          {/* Question Card */}
          <div className="md:col-span-2">
            <div className={`${categories[selectedCategory].bgColor} rounded-2xl overflow-hidden`}>
              {/* Progress Bar */}
              <div className="h-2 bg-slate-200">
                <div 
                  className={`h-full bg-gradient-to-r ${categories[selectedCategory].color} transition-all`}
                  style={{ width: `${((currentQuestion + 1) / categories[selectedCategory].questions.length) * 100}%` }}
                ></div>
              </div>
              
              <div className="p-8">
                {/* Question Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`px-4 py-2 rounded-full text-white text-sm font-medium bg-gradient-to-r ${categories[selectedCategory].color}`}>
                    Question {currentQuestion + 1} of {categories[selectedCategory].questions.length}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    categories[selectedCategory].questions[currentQuestion].difficulty === 'Easy' 
                      ? 'bg-green-100 text-green-700'
                      : categories[selectedCategory].questions[currentQuestion].difficulty === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {categories[selectedCategory].questions[currentQuestion].difficulty}
                  </span>
                </div>

                {/* Question */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                  <h2 className="text-xl font-bold text-slate-800 leading-relaxed">
                    {categories[selectedCategory].questions[currentQuestion].q}
                  </h2>
                  
                  {/* Hint */}
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                    <span className="text-amber-700 text-sm">
                      💡 Hint: {categories[selectedCategory].questions[currentQuestion].hint}
                    </span>
                  </div>
                </div>

                {/* User Answer Area */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Answer (Practice writing it out):
                  </label>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here to practice..."
                    className="w-full h-32 p-4 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Answer Section */}
                {!showAnswer ? (
                  <button
                    onClick={handleReveal}
                    className={`w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r ${categories[selectedCategory].color} hover:shadow-lg transition-all`}
                  >
                    🔓 Reveal Answer
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">✅</span>
                        <span className="font-bold text-green-800">Model Answer:</span>
                      </div>
                      <p className="text-green-700 leading-relaxed">
                        {categories[selectedCategory].questions[currentQuestion].a}
                      </p>
                    </div>

                    {/* Self Assessment */}
                    <div className="flex gap-3">
                      <button
                        onClick={markCorrect}
                        className="flex-1 py-3 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 transition-colors"
                      >
                        ✅ I Got It Right
                      </button>
                      <button
                        onClick={handleNext}
                        className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
                      >
                        ❌ Need More Practice
                      </button>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={handlePrev}
                    disabled={currentQuestion === 0}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      currentQuestion === 0 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentQuestion === categories[selectedCategory].questions.length - 1}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      currentQuestion === categories[selectedCategory].questions.length - 1
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-slate-800 text-white hover:bg-slate-900'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-slate-800 mb-4">📊 Your Progress</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{score.correct}</div>
                  <div className="text-xs text-green-700">Correct</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">{score.attempted}</div>
                  <div className="text-xs text-blue-700">Attempted</div>
                </div>
              </div>
              {score.attempted > 0 && (
                <div className="mt-4 p-3 bg-slate-50 rounded-xl text-center">
                  <span className="text-lg font-bold text-slate-800">
                    {Math.round((score.correct / score.attempted) * 100)}% Accuracy
                  </span>
                </div>
              )}
            </div>

            {/* Question Navigator */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="font-bold text-slate-800 mb-4">🎯 Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {categories[selectedCategory].questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentQuestion(idx);
                      setShowAnswer(false);
                      setUserAnswer("");
                    }}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${
                      idx === currentQuestion
                        ? `bg-gradient-to-r ${categories[selectedCategory].color} text-white`
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className={`${categories[selectedCategory].bgColor} rounded-2xl p-6`}>
              <h3 className="font-bold text-slate-800 mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Practice speaking answers aloud</li>
                <li>• Time yourself (2-3 min per answer)</li>
                <li>• Use STAR method for behavioral</li>
                <li>• Record yourself for review</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* More Resources */}
      <section className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">📚 More Practice Resources</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { title: "LeetCode", desc: "Coding problems", icon: "💻", link: "#" },
            { title: "Pramp", desc: "Mock interviews", icon: "🎤", link: "#" },
            { title: "GeeksforGeeks", desc: "CS concepts", icon: "📖", link: "#" },
            { title: "InterviewBit", desc: "Structured prep", icon: "🎯", link: "#" }
          ].map((resource, idx) => (
            <a
              key={idx}
              href={resource.link}
              className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <span className="text-2xl">{resource.icon}</span>
              <h4 className="font-bold text-slate-800 mt-2">{resource.title}</h4>
              <p className="text-sm text-slate-500">{resource.desc}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

