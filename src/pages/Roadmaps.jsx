import React, { useState } from "react";

export default function Roadmaps() {
  const [selectedPath, setSelectedPath] = useState(null);

  // All Tech Roadmaps
  const techPaths = {
    fullstack: {
      title: "Full Stack Development",
      icon: "🚀",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-300",
      duration: "6-8 months",
      description: "Master both frontend and backend to build complete web applications",
      salary: "₹6-25 LPA",
      stages: [
        {
          level: "Beginner",
          color: "from-green-400 to-emerald-500",
          duration: "2 months",
          skills: [
            { name: "HTML5", desc: "Structure of web pages", icon: "📄" },
            { name: "CSS3", desc: "Styling & layouts", icon: "🎨" },
            { name: "JavaScript Basics", desc: "Programming fundamentals", icon: "⚡" },
            { name: "Git & GitHub", desc: "Version control", icon: "📦" }
          ]
        },
        {
          level: "Intermediate",
          color: "from-blue-400 to-indigo-500",
          duration: "2 months",
          skills: [
            { name: "React.js", desc: "Frontend framework", icon: "⚛️" },
            { name: "Node.js", desc: "Backend runtime", icon: "🟢" },
            { name: "Express.js", desc: "Backend framework", icon: "🚂" },
            { name: "MongoDB", desc: "NoSQL database", icon: "🍃" }
          ]
        },
        {
          level: "Advanced",
          color: "from-orange-400 to-red-500",
          duration: "2 months",
          skills: [
            { name: "TypeScript", desc: "Type-safe JavaScript", icon: "📘" },
            { name: "Next.js", desc: "React framework", icon: "▲" },
            { name: "PostgreSQL", desc: "Relational database", icon: "🐘" },
            { name: "Redis", desc: "Caching & sessions", icon: "🔴" }
          ]
        },
        {
          level: "Pro",
          color: "from-purple-500 to-pink-500",
          duration: "2 months",
          skills: [
            { name: "Docker", desc: "Containerization", icon: "🐳" },
            { name: "AWS/Azure", desc: "Cloud deployment", icon: "☁️" },
            { name: "CI/CD", desc: "Automated pipelines", icon: "🔄" },
            { name: "System Design", desc: "Architecture patterns", icon: "🏗️" }
          ]
        }
      ]
    },
    python: {
      title: "Python Development",
      icon: "🐍",
      color: "from-yellow-500 to-green-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-300",
      duration: "5-7 months",
      description: "From scripting to AI/ML, web development, and automation",
      salary: "₹5-30 LPA",
      stages: [
        {
          level: "Beginner",
          color: "from-green-400 to-emerald-500",
          duration: "6 weeks",
          skills: [
            { name: "Python Basics", desc: "Syntax, variables, loops", icon: "🔤" },
            { name: "Data Structures", desc: "Lists, dicts, sets", icon: "📊" },
            { name: "Functions & OOP", desc: "Classes, objects", icon: "🎯" },
            { name: "File Handling", desc: "Read/write files", icon: "📁" }
          ]
        },
        {
          level: "Intermediate",
          color: "from-blue-400 to-indigo-500",
          duration: "6 weeks",
          skills: [
            { name: "Django/Flask", desc: "Web frameworks", icon: "🌐" },
            { name: "REST APIs", desc: "Build & consume APIs", icon: "🔌" },
            { name: "Databases", desc: "SQL & ORMs", icon: "🗄️" },
            { name: "Testing", desc: "Unit & integration", icon: "✅" }
          ]
        },
        {
          level: "Advanced",
          color: "from-orange-400 to-red-500",
          duration: "8 weeks",
          skills: [
            { name: "NumPy & Pandas", desc: "Data manipulation", icon: "📈" },
            { name: "Matplotlib", desc: "Data visualization", icon: "📉" },
            { name: "Scikit-learn", desc: "Machine Learning", icon: "🤖" },
            { name: "Web Scraping", desc: "BeautifulSoup, Selenium", icon: "🕷️" }
          ]
        },
        {
          level: "Pro",
          color: "from-purple-500 to-pink-500",
          duration: "8 weeks",
          skills: [
            { name: "TensorFlow/PyTorch", desc: "Deep Learning", icon: "🧠" },
            { name: "FastAPI", desc: "Modern async APIs", icon: "⚡" },
            { name: "Celery", desc: "Task queues", icon: "🥬" },
            { name: "Deployment", desc: "Docker, AWS", icon: "🚀" }
          ]
        }
      ]
    },
    java: {
      title: "Java Development",
      icon: "☕",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      duration: "6-8 months",
      description: "Enterprise-grade applications, Android, and microservices",
      salary: "₹6-28 LPA",
      stages: [
        {
          level: "Beginner",
          color: "from-green-400 to-emerald-500",
          duration: "6 weeks",
          skills: [
            { name: "Java Basics", desc: "Syntax, JVM, JDK", icon: "📝" },
            { name: "OOP Concepts", desc: "Classes, inheritance", icon: "🎭" },
            { name: "Collections", desc: "List, Map, Set", icon: "📚" },
            { name: "Exception Handling", desc: "Try-catch, throws", icon: "⚠️" }
          ]
        },
        {
          level: "Intermediate",
          color: "from-blue-400 to-indigo-500",
          duration: "8 weeks",
          skills: [
            { name: "Spring Boot", desc: "Web framework", icon: "🌱" },
            { name: "Hibernate", desc: "ORM framework", icon: "🗃️" },
            { name: "MySQL/PostgreSQL", desc: "Databases", icon: "🐬" },
            { name: "Maven/Gradle", desc: "Build tools", icon: "🔧" }
          ]
        },
        {
          level: "Advanced",
          color: "from-orange-400 to-red-500",
          duration: "8 weeks",
          skills: [
            { name: "Microservices", desc: "Spring Cloud", icon: "🔲" },
            { name: "REST & GraphQL", desc: "API design", icon: "🌐" },
            { name: "JUnit & Mockito", desc: "Testing frameworks", icon: "✅" },
            { name: "Multithreading", desc: "Concurrency", icon: "🧵" }
          ]
        },
        {
          level: "Pro",
          color: "from-purple-500 to-pink-500",
          duration: "8 weeks",
          skills: [
            { name: "Kafka", desc: "Message queues", icon: "📨" },
            { name: "Kubernetes", desc: "Orchestration", icon: "☸️" },
            { name: "Design Patterns", desc: "Best practices", icon: "🏛️" },
            { name: "Cloud (AWS/GCP)", desc: "Deployment", icon: "☁️" }
          ]
        }
      ]
    },
    dotnet: {
      title: ".NET Development",
      icon: "🔷",
      color: "from-blue-600 to-purple-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
      duration: "6-8 months",
      description: "Microsoft ecosystem - Web, Desktop, and Enterprise apps",
      salary: "₹6-25 LPA",
      stages: [
        {
          level: "Beginner",
          color: "from-green-400 to-emerald-500",
          duration: "6 weeks",
          skills: [
            { name: "C# Basics", desc: "Syntax, types, OOP", icon: "🔤" },
            { name: ".NET Core", desc: "Runtime & CLI", icon: "⚙️" },
            { name: "Visual Studio", desc: "IDE mastery", icon: "💜" },
            { name: "NuGet", desc: "Package manager", icon: "📦" }
          ]
        },
        {
          level: "Intermediate",
          color: "from-blue-400 to-indigo-500",
          duration: "8 weeks",
          skills: [
            { name: "ASP.NET Core", desc: "Web framework", icon: "🌐" },
            { name: "Entity Framework", desc: "ORM", icon: "🗄️" },
            { name: "SQL Server", desc: "Microsoft DB", icon: "🐬" },
            { name: "Razor Pages", desc: "Server-side UI", icon: "✂️" }
          ]
        },
        {
          level: "Advanced",
          color: "from-orange-400 to-red-500",
          duration: "8 weeks",
          skills: [
            { name: "Web API", desc: "RESTful services", icon: "🔌" },
            { name: "Blazor", desc: "C# in browser", icon: "🔥" },
            { name: "Identity", desc: "Authentication", icon: "🔐" },
            { name: "SignalR", desc: "Real-time apps", icon: "📡" }
          ]
        },
        {
          level: "Pro",
          color: "from-purple-500 to-pink-500",
          duration: "8 weeks",
          skills: [
            { name: "Microservices", desc: "Distributed systems", icon: "🔲" },
            { name: "Azure", desc: "Cloud services", icon: "☁️" },
            { name: "Docker", desc: "Containerization", icon: "🐳" },
            { name: "CI/CD", desc: "Azure DevOps", icon: "🔄" }
          ]
        }
      ]
    },
    datascience: {
      title: "Data Science & AI",
      icon: "🤖",
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-300",
      duration: "8-10 months",
      description: "Analytics, Machine Learning, and Artificial Intelligence",
      salary: "₹8-40 LPA",
      stages: [
        {
          level: "Beginner",
          color: "from-green-400 to-emerald-500",
          duration: "6 weeks",
          skills: [
            { name: "Python", desc: "Programming basics", icon: "🐍" },
            { name: "Statistics", desc: "Mean, median, std", icon: "📊" },
            { name: "Linear Algebra", desc: "Matrices, vectors", icon: "🔢" },
            { name: "Probability", desc: "Distributions", icon: "🎲" }
          ]
        },
        {
          level: "Intermediate",
          color: "from-blue-400 to-indigo-500",
          duration: "8 weeks",
          skills: [
            { name: "Pandas & NumPy", desc: "Data manipulation", icon: "🐼" },
            { name: "Data Visualization", desc: "Matplotlib, Seaborn", icon: "📈" },
            { name: "SQL", desc: "Database queries", icon: "🗃️" },
            { name: "EDA", desc: "Exploratory analysis", icon: "🔍" }
          ]
        },
        {
          level: "Advanced",
          color: "from-orange-400 to-red-500",
          duration: "10 weeks",
          skills: [
            { name: "Machine Learning", desc: "Scikit-learn", icon: "🤖" },
            { name: "Feature Engineering", desc: "Data prep", icon: "🔧" },
            { name: "Model Evaluation", desc: "Metrics, validation", icon: "✅" },
            { name: "NLP Basics", desc: "Text processing", icon: "📝" }
          ]
        },
        {
          level: "Pro",
          color: "from-purple-500 to-pink-500",
          duration: "12 weeks",
          skills: [
            { name: "Deep Learning", desc: "TensorFlow, PyTorch", icon: "🧠" },
            { name: "Computer Vision", desc: "Image processing", icon: "👁️" },
            { name: "MLOps", desc: "Model deployment", icon: "🚀" },
            { name: "Big Data", desc: "Spark, Hadoop", icon: "💾" }
          ]
        }
      ]
    },
    devops: {
      title: "DevOps Engineering",
      icon: "⚙️",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-300",
      duration: "5-7 months",
      description: "Automate, deploy, and scale applications efficiently",
      salary: "₹8-35 LPA",
      stages: [
        {
          level: "Beginner",
          color: "from-green-400 to-emerald-500",
          duration: "4 weeks",
          skills: [
            { name: "Linux Basics", desc: "Commands, shell", icon: "🐧" },
            { name: "Git", desc: "Version control", icon: "📦" },
            { name: "Networking", desc: "TCP/IP, DNS", icon: "🌐" },
            { name: "Scripting", desc: "Bash, Python", icon: "📜" }
          ]
        },
        {
          level: "Intermediate",
          color: "from-blue-400 to-indigo-500",
          duration: "6 weeks",
          skills: [
            { name: "Docker", desc: "Containerization", icon: "🐳" },
            { name: "CI/CD", desc: "Jenkins, GitHub Actions", icon: "🔄" },
            { name: "Ansible", desc: "Configuration mgmt", icon: "🔧" },
            { name: "Terraform", desc: "Infrastructure as Code", icon: "🏗️" }
          ]
        },
        {
          level: "Advanced",
          color: "from-orange-400 to-red-500",
          duration: "8 weeks",
          skills: [
            { name: "Kubernetes", desc: "Orchestration", icon: "☸️" },
            { name: "AWS/Azure/GCP", desc: "Cloud platforms", icon: "☁️" },
            { name: "Monitoring", desc: "Prometheus, Grafana", icon: "📊" },
            { name: "Logging", desc: "ELK Stack", icon: "📋" }
          ]
        },
        {
          level: "Pro",
          color: "from-purple-500 to-pink-500",
          duration: "6 weeks",
          skills: [
            { name: "Service Mesh", desc: "Istio, Linkerd", icon: "🕸️" },
            { name: "Security", desc: "DevSecOps", icon: "🔐" },
            { name: "GitOps", desc: "ArgoCD, Flux", icon: "🔄" },
            { name: "SRE Practices", desc: "Reliability", icon: "🛡️" }
          ]
        }
      ]
    }
  };

  const pathKeys = Object.keys(techPaths);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl p-8" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)'
      }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative text-center">
          <span className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-4">
            🗺️ Career Roadmaps
          </span>
          <h1 className="text-4xl font-bold text-white mb-4">
            Tech Learning Paths
          </h1>
          <p className="text-purple-200 max-w-2xl mx-auto">
            Visual roadmaps from Beginner to Pro. Click on any technology to see the complete learning path with skills, duration, and resources.
          </p>
        </div>
      </section>

      {/* Tech Path Selection */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {pathKeys.map((key) => {
          const path = techPaths[key];
          const isSelected = selectedPath === key;
          
          return (
            <button
              key={key}
              onClick={() => setSelectedPath(isSelected ? null : key)}
              className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 ${
                isSelected 
                  ? `${path.bgColor} ${path.borderColor} border-2 shadow-lg scale-105` 
                  : 'bg-white border-2 border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <span className="text-4xl block mb-3">{path.icon}</span>
              <h3 className="font-bold text-slate-800 text-sm">{path.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{path.duration}</p>
              
              {isSelected && (
                <div className={`absolute top-2 right-2 w-3 h-3 rounded-full bg-gradient-to-r ${path.color}`}></div>
              )}
            </button>
          );
        })}
      </section>

      {/* Roadmap Display */}
      {selectedPath && (
        <section className={`rounded-3xl overflow-hidden ${techPaths[selectedPath].bgColor} border-2 ${techPaths[selectedPath].borderColor}`}>
          {/* Path Header */}
          <div className={`p-6 bg-gradient-to-r ${techPaths[selectedPath].color}`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{techPaths[selectedPath].icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{techPaths[selectedPath].title}</h2>
                  <p className="text-white/80">{techPaths[selectedPath].description}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-white/20 rounded-xl px-4 py-2 text-white text-center">
                  <div className="text-lg font-bold">⏱️ {techPaths[selectedPath].duration}</div>
                  <div className="text-xs text-white/70">Duration</div>
                </div>
                <div className="bg-white/20 rounded-xl px-4 py-2 text-white text-center">
                  <div className="text-lg font-bold">💰 {techPaths[selectedPath].salary}</div>
                  <div className="text-xs text-white/70">Salary Range</div>
                </div>
              </div>
            </div>
          </div>

          {/* Flowchart Path */}
          <div className="p-8">
            <div className="relative">
              {techPaths[selectedPath].stages.map((stage, idx) => (
                <div key={idx} className="relative">
                  {/* Connecting Line */}
                  {idx < techPaths[selectedPath].stages.length - 1 && (
                    <div className="absolute left-8 top-full w-1 h-8 bg-gradient-to-b from-slate-300 to-slate-200 z-0"></div>
                  )}
                  
                  {/* Stage Card */}
                  <div className="relative flex gap-6 mb-8">
                    {/* Level Badge */}
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-xl">{idx + 1}</span>
                    </div>
                    
                    {/* Stage Content */}
                    <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${stage.color}`}>
                            {stage.level}
                          </span>
                          <span className="ml-3 text-sm text-slate-500">⏱️ {stage.duration}</span>
                        </div>
                        
                        {/* Progress Indicator */}
                        <div className="flex items-center gap-1">
                          {[1,2,3,4].map((dot) => (
                            <div 
                              key={dot} 
                              className={`w-2 h-2 rounded-full ${dot <= idx + 1 ? `bg-gradient-to-r ${stage.color}` : 'bg-slate-200'}`}
                            ></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Skills Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {stage.skills.map((skill, skillIdx) => (
                          <div 
                            key={skillIdx} 
                            className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors border border-slate-100"
                          >
                            <span className="text-2xl block mb-2">{skill.icon}</span>
                            <h4 className="font-bold text-slate-800 text-sm">{skill.name}</h4>
                            <p className="text-xs text-slate-500 mt-1">{skill.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Arrow Down */}
                  {idx < techPaths[selectedPath].stages.length - 1 && (
                    <div className="flex justify-center mb-4">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${techPaths[selectedPath].stages[idx + 1].color} flex items-center justify-center shadow-md`}>
                        <span className="text-white text-xl">↓</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Completion Badge */}
              <div className="flex justify-center mt-8">
                <div className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${techPaths[selectedPath].color} text-white shadow-lg`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🎉</span>
                    <div>
                      <div className="font-bold text-lg">Congratulations!</div>
                      <div className="text-white/80 text-sm">You're now a {techPaths[selectedPath].title} Pro!</div>
                    </div>
                    <span className="text-3xl">🏆</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Quick Tips */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
          <span className="text-3xl">💡</span>
          <h3 className="font-bold text-xl mt-3">Consistency is Key</h3>
          <p className="text-white/80 mt-2">
            Dedicate 2-3 hours daily. Progress over perfection. Small steps lead to big achievements.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
          <span className="text-3xl">🛠️</span>
          <h3 className="font-bold text-xl mt-3">Build Projects</h3>
          <p className="text-white/80 mt-2">
            Apply what you learn. Create 2-3 projects at each stage. Showcase them on GitHub.
          </p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
          <span className="text-3xl">🤝</span>
          <h3 className="font-bold text-xl mt-3">Join Communities</h3>
          <p className="text-white/80 mt-2">
            Connect with developers on Discord, Twitter, and LinkedIn. Share your journey!
          </p>
        </div>
      </section>

      {/* Resources */}
      <section className="bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">📚 Free Learning Resources</h2>
        
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { name: "freeCodeCamp", desc: "Free coding tutorials", icon: "🔥", color: "bg-green-100" },
            { name: "Coursera", desc: "University courses", icon: "📖", color: "bg-blue-100" },
            { name: "YouTube", desc: "Video tutorials", icon: "▶️", color: "bg-red-100" },
            { name: "LeetCode", desc: "Coding practice", icon: "💻", color: "bg-yellow-100" },
            { name: "MDN Docs", desc: "Web documentation", icon: "📄", color: "bg-orange-100" },
            { name: "GitHub", desc: "Open source projects", icon: "🐱", color: "bg-purple-100" },
            { name: "Stack Overflow", desc: "Q&A community", icon: "❓", color: "bg-cyan-100" },
            { name: "Dev.to", desc: "Developer blogs", icon: "✍️", color: "bg-pink-100" }
          ].map((resource, idx) => (
            <div key={idx} className={`${resource.color} rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer`}>
              <span className="text-2xl">{resource.icon}</span>
              <h4 className="font-bold text-slate-800 mt-2">{resource.name}</h4>
              <p className="text-sm text-slate-600">{resource.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

