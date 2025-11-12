import React, { useState, useEffect } from 'react';
import { Rocket, Zap, Flame, Sparkles, Clock, Lightbulb, Target, TrendingUp, Award, Coffee } from 'lucide-react';

function EnhancedLoadingScreen() {
  const [currentTip, setCurrentTip] = useState(0);
  const [timeLeft, setTimeLeft] = useState(50);

  const interviewTips = [
    {
      icon: Target,
      title: "First Impression",
      tip: "The first 7 seconds matter! Smile, maintain eye contact, and offer a firm handshake to set a positive tone.",
      color: "text-blue-400"
    },
    {
      icon: Lightbulb,
      title: "STAR Method",
      tip: "Use STAR (Situation, Task, Action, Result) to structure your behavioral interview answers effectively.",
      color: "text-yellow-400"
    },
    {
      icon: TrendingUp,
      title: "Research is Key",
      tip: "Spend at least 2 hours researching the company's culture, recent news, and values before your interview.",
      color: "text-green-400"
    },
    {
      icon: Award,
      title: "Ask Questions",
      tip: "Prepare 3-5 thoughtful questions about the role, team dynamics, and growth opportunities to show genuine interest.",
      color: "text-purple-400"
    },
    {
      icon: Coffee,
      title: "Body Language",
      tip: "Sit upright, nod occasionally, and lean slightly forward to show engagement and confidence.",
      color: "text-orange-400"
    },
    {
      icon: Zap,
      title: "Practice Out Loud",
      tip: "Rehearse answers verbally, not just mentally. It helps you sound more natural and confident during the actual interview.",
      color: "text-pink-400"
    }
  ];

  useEffect(() => {
    // Rotate tips every 6 seconds
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % interviewTips.length);
    }, 6000);

    // Countdown timer
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(tipInterval);
      clearInterval(timerInterval);
    };
  }, []);

  const CurrentIcon = interviewTips[currentTip].icon;
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 p-8">
        {/* Glassmorphic Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 shadow-2xl p-12 max-w-md w-full">
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 opacity-50 animate-pulse"></div>
          
          <div className="relative z-10 flex flex-col items-center space-y-8">
            {/* Multi-layered Spinner */}
            <div className="relative w-32 h-32">
              {/* Outer Ring */}
              <div className="absolute inset-0 border-4 border-purple-200/20 rounded-full"></div>
              
              {/* Middle Ring - Spinning */}
              <div className="absolute inset-0 border-4 border-transparent border-l-purple-500 border-t-purple-500 rounded-full animate-spin"></div>
              
              {/* Inner Ring - Counter Spinning */}
              <div className="absolute inset-2 border-4 border-transparent border-r-pink-500 border-b-pink-500 rounded-full animate-spin-reverse"></div>
              
              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg animate-pulse">
                  <Rocket className="text-white w-8 h-8" />
                </div>
              </div>
              
              {/* Orbiting Icons */}
              <div className="absolute inset-0 animate-spin-slow">
                <Sparkles className="absolute top-0 left-1/2 transform -translate-x-1/2 text-yellow-400 w-5 h-5" />
              </div>
              <div className="absolute inset-0 animate-spin-slow-reverse">
                <Zap className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-blue-400 w-5 h-5" />
              </div>
            </div>

            {/* Loading Text with Timer */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-extrabold text-white animate-pulse">
                Loading Your Experience
              </h2>
              
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
              </div>
              
              <p className="text-white/70 font-medium max-w-xs">
                Preparing the latest interview insights just for you...
              </p>

              {/* Timer Display */}
              <div className="flex items-center justify-center space-x-2 text-purple-300 bg-black/20 rounded-lg px-4 py-2 border border-purple-400/30">
                <Clock className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-semibold">
                  {timeLeft > 0 ? `~${timeLeft}s` : 'Almost there...'}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-black/20 rounded-full h-2 overflow-hidden border border-white/10">
              <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full animate-progress"></div>
            </div>

            {/* Server Info */}
            <div className="w-full p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-400/30">
              <div className="flex items-center space-x-2 text-blue-300 text-xs">
                <Rocket className="w-4 h-4" />
                <p>
                  <span className="font-semibold">Note:</span> Server instance is starting up. This may take up to 50 seconds on first load.
                </p>
              </div>
            </div>

            {/* Rotating Interview Tips */}
            <div className="w-full p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30 min-h-[120px]">
              <div className="flex items-start space-x-3">
                <CurrentIcon className={`${interviewTips[currentTip].color} w-6 h-6 flex-shrink-0 mt-1 animate-pulse`} />
                <div className="text-white/80 text-sm space-y-2 animate-fade-in">
                  <p className="font-bold text-white flex items-center space-x-2">
                    <span>💡 Interview Tip: {interviewTips[currentTip].title}</span>
                  </p>
                  <p className="leading-relaxed">
                    {interviewTips[currentTip].tip}
                  </p>
                </div>
              </div>
              
              {/* Tip Progress Dots */}
              <div className="flex justify-center space-x-2 mt-4">
                {interviewTips.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentTip
                        ? 'bg-purple-400 w-6'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="text-center space-y-2">
          <p className="text-white/50 text-sm font-medium">
            Initializing your experience...
          </p>
          <div className="flex flex-col items-center justify-center space-y-1 text-purple-400">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3 h-3" />
              <span className="text-xs font-semibold">© 2025 IMS Connect</span>
              <Sparkles className="w-3 h-3" />
            </div>
            <span className="text-xs text-white/40 font-medium">Empowering Students</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes spin-slow-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 2s linear infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 4s linear infinite;
        }
        
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default EnhancedLoadingScreen;