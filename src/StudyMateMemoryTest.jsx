import React, { useState, useEffect, useRef } from 'react';
import { Brain, Clock, Target, Zap, Trophy, Heart, Sparkles, Star } from 'lucide-react';

const EMOJI_POOL = ['🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎹', '🎺', '🎻', '🎬', '📚', '📖', '✏️', '🔬', '🔭', '💡', '🌟', '⭐', '🌈', '🦋', '🐝', '🌸', '🌺', '🍀', '🎃', '🎄', '🎁', '🎈', '🎉', '🎊'];

const StudyMateMemoryTest = () => {
  const [stage, setStage] = useState('welcome'); // welcome, memorize, recall, results
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [userOrder, setUserOrder] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [profile, setProfile] = useState(null);
  const [shuffledEmojis, setShuffledEmojis] = useState([]);
  const timerRef = useRef(null);

  // Generate random emojis for the test
  const generateEmojis = () => {
    const shuffled = [...EMOJI_POOL].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  };

  // Start the test
  const startTest = () => {
    const emojis = generateEmojis();
    setSelectedEmojis(emojis);
    setUserOrder([]);
    setShuffledEmojis([]);
    setTimeLeft(30);
    setStage('memorize');
  };

  // Timer effect
  useEffect(() => {
    if (stage === 'memorize' || stage === 'recall') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            if (stage === 'memorize') {
              // Shuffle emojis once when transitioning to recall stage
              const shuffled = [...selectedEmojis].sort(() => Math.random() - 0.5);
              setShuffledEmojis(shuffled);
              setStage('recall');
              setTimeLeft(30);
            } else {
              evaluateResults();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [stage, selectedEmojis]);

  // Handle emoji selection during recall
  const handleEmojiClick = (emoji) => {
    if (!userOrder.includes(emoji) && userOrder.length < 10) {
      setUserOrder([...userOrder, emoji]);
    }
  };

  // Remove emoji from user order
  const removeEmoji = (index) => {
    setUserOrder(userOrder.filter((_, i) => i !== index));
  };

  // Evaluate results
  const evaluateResults = () => {
    clearInterval(timerRef.current);
    
    let correctCount = 0;
    userOrder.forEach((emoji, index) => {
      if (emoji === selectedEmojis[index]) {
        correctCount++;
      }
    });

    const percentage = (correctCount / 10) * 100;
    setScore(percentage);

    // Generate profile based on score
    let profileData;
    if (percentage >= 70) {
      profileData = {
        type: 'The Deep Thinker',
        icon: '🧠',
        color: 'from-purple-500 to-pink-500',
        description: 'Your brain is built for intense focus and deep understanding!',
        duration: '40-50 minutes',
        breakTime: '10-15 minutes',
        method: 'Deep Reading + Problem Solving',
        style: 'Theory-heavy subjects with comprehensive summaries',
        time: 'Morning or whenever you feel most alert',
        tips: [
          'Tackle complex topics head-on - your brain loves the challenge',
          'Take comprehensive notes and create mind maps',
          'Perfect for mathematics, philosophy, and detailed analysis'
        ]
      };
    } else if (percentage >= 40) {
      profileData = {
        type: 'The Balanced Learner',
        icon: '⚡',
        color: 'from-blue-500 to-teal-500',
        description: 'You have a beautifully balanced brain that thrives with rhythm and routine!',
        duration: '25-30 minutes',
        breakTime: '5-7 minutes',
        method: 'Active Recall + Practice',
        style: 'Mix of theory and practice with regular revision',
        time: 'Flexible - you adapt well to different times',
        tips: [
          'Use the classic Pomodoro technique - it\'s made for you',
          'Review yesterday\'s learning before starting new topics',
          'Mix subjects to keep your brain engaged and fresh'
        ]
      };
    } else {
      profileData = {
        type: 'The Fast Thinker',
        icon: '⚡',
        color: 'from-orange-500 to-red-500',
        description: 'Your brain is lightning-fast and loves variety and visual excitement!',
        duration: '15-20 minutes',
        breakTime: '3-5 minutes',
        method: 'Flashcards + Visual Learning',
        style: 'Short bursts with lots of variety and visuals',
        time: 'Evening or in multiple mini-sessions throughout the day',
        tips: [
          'Embrace your speed! Short, frequent sessions are your superpower',
          'Use colorful notes, diagrams, and videos',
          'Switch subjects often to keep your brilliant brain engaged',
          'Quiz yourself constantly - make it a game!'
        ]
      };
    }

    setProfile(profileData);
    setStage('results');
  };

  // Welcome Screen
  if (stage === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="mb-6">
<img src="/brain-icon.png" alt="Brain" className="w-40 h-20 mx-auto mb-4" />
<img src="/logo.png" alt="Brain" className="w-40 h-15 mx-auto mb-2" />

            <p className="text-lg text-purple-600 font-semibold">Memory & Focus Test</p>
          </div>
          
          <div className="bg-purple-50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">How it works:</h2>
            <div className="text-left space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl">1️⃣</span>
                <p className="text-gray-700 pt-1"><strong>Memorize</strong> 10 emojis in 30 seconds</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">2️⃣</span>
                <p className="text-gray-700 pt-1"><strong>Recall</strong> them in order in the next 30 seconds</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">3️⃣</span>
                <p className="text-gray-700 pt-1"><strong>Discover</strong> your unique study pattern!</p>
              </div>
            </div>
          </div>

          <button
            onClick={startTest}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg text-lg"
          >
            Start Your Brain Journey 🚀
          </button>
        </div>
      </div>
    );
  }

  // Memorization Stage
  if (stage === 'memorize') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Memorize These!</h2>
            </div>
            <div className="bg-blue-50 rounded-full px-6 py-3 inline-block">
              <p className="text-3xl font-bold text-blue-600">{timeLeft}s</p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3 mb-6">
            {selectedEmojis.map((emoji, index) => (
              <div
                key={index}
                className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-4xl shadow-md transform hover:scale-110 transition-transform"
              >
                {emoji}
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-sm">
            Remember the order! You'll need to recall them next 🧠
          </p>
        </div>
      </div>
    );
  }

  // Recall Stage
  if (stage === 'recall') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="w-8 h-8 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">Tap in Order!</h2>
            </div>
            <div className="bg-green-50 rounded-full px-6 py-3 inline-block">
              <p className="text-3xl font-bold text-green-600">{timeLeft}s</p>
            </div>
          </div>

          {/* User's selected order */}
          <div className="bg-purple-50 rounded-2xl p-4 mb-4 min-h-[80px]">
            <p className="text-sm font-semibold text-gray-700 mb-2">Your Order ({userOrder.length}/10):</p>
            <div className="flex flex-wrap gap-2">
              {userOrder.map((emoji, index) => (
                <div
                  key={index}
                  onClick={() => removeEmoji(index)}
                  className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-md cursor-pointer hover:bg-red-50 transition-colors"
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Shuffled emojis to select from */}
          <div className="grid grid-cols-5 gap-3">
            {shuffledEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                disabled={userOrder.includes(emoji)}
                className={`aspect-square rounded-xl flex items-center justify-center text-3xl shadow-md transition-all ${
                  userOrder.includes(emoji)
                    ? 'bg-gray-200 opacity-50 cursor-not-allowed'
                    : 'bg-gradient-to-br from-green-100 to-teal-100 hover:scale-110 cursor-pointer'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {userOrder.length === 10 && (
            <button
              onClick={evaluateResults}
              className="w-full mt-6 bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Submit & See Results! ✨
            </button>
          )}
        </div>
      </div>
    );
  }

  // Results Screen
  if (stage === 'results' && profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 overflow-y-auto max-h-screen">
          {/* Score Section */}
          <div className="text-center mb-8">
            <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Memory Score</h2>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl py-4 px-6 inline-block">
              <p className="text-5xl font-bold">{score}%</p>
            </div>
          </div>

          {/* Profile Card */}
          <div className={`bg-gradient-to-r ${profile.color} rounded-3xl p-8 text-white mb-6 shadow-xl`}>
            <div className="text-center mb-6">
              <div className="text-7xl mb-4">{profile.icon}</div>
              <h3 className="text-3xl font-bold mb-2">{profile.type}</h3>
              <p className="text-lg opacity-90">{profile.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 bg-white/10 backdrop-blur rounded-2xl p-6">
              <div>
                <p className="text-sm opacity-80 mb-1">⏱️ Perfect Study Duration</p>
                <p className="text-xl font-bold">{profile.duration}</p>
              </div>
              <div>
                <p className="text-sm opacity-80 mb-1">☕ Break Time</p>
                <p className="text-xl font-bold">{profile.breakTime}</p>
              </div>
              <div>
                <p className="text-sm opacity-80 mb-1">📚 Best Method</p>
                <p className="text-xl font-bold">{profile.method}</p>
              </div>
              <div>
                <p className="text-sm opacity-80 mb-1">🎯 Study Style</p>
                <p className="text-xl font-bold">{profile.style}</p>
              </div>
              <div>
                <p className="text-sm opacity-80 mb-1">🌟 Ideal Time</p>
                <p className="text-xl font-bold">{profile.time}</p>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-purple-50 rounded-2xl p-6 mb-6">
            <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Your Personalized Study Tips
            </h4>
            <ul className="space-y-3">
              {profile.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{tip}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center mb-6">
            <Heart className="w-12 h-12 mx-auto mb-3" />
            <h4 className="text-2xl font-bold mb-2">Ready to unlock your full potential?</h4>
            <p className="mb-4 opacity-90">Start your personalized learning journey today with StudyMate!</p>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 inline-block">
              <p className="text-sm mb-2">Scan to Start:</p>
              <div className="bg-white w-32 h-32 rounded-xl mx-auto flex items-center justify-center p-2">
  <img src="/qr.png" alt="Download QR Code" className="w-full h-full object-contain" />
</div>
            </div>
          </div>

          <button
            onClick={() => {
              setStage('welcome');
              setScore(0);
              setProfile(null);
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Try Again 🔄
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default StudyMateMemoryTest;