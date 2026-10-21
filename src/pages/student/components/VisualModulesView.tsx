import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  RotateCcw
} from 'lucide-react';
import { CURRICULUM_MODULES } from '../../../data/modulesData';
import { Student } from '../../../types';
import { studentSpeech } from '../../../utils/studentSpeech';

interface VisualModulesViewProps {
  student: Student;
  language: 'en' | 'hi';
}

// 4 Module Did You Know & 3-Step Action Strips
const MODULE_ENRICHMENT = [
  {
    id: 1,
    didYouKnow: {
      en: "Sandy soils feel gritty like beach sand, while clay soils feel silky and moldable like pottery clay! 🏺",
      hi: "रेतीली मिट्टी समुद्री रेत की तरह खुरदरी लगती है, जबकि चिकनी मिट्टी कुम्हार की मिट्टी जैसी मुलायम और लचकदार होती है! 🏺"
    },
    actionStrip: [
      { step: '1', icon: '🔍', title: { en: 'Feel Texture', hi: 'मिट्टी को छुएं' } },
      { step: '2', icon: '🌈', title: { en: 'Check pH', hi: 'pH रंग देखें' } },
      { step: '3', icon: '🌱', title: { en: 'Pick Best Crop', hi: 'सही फसल चुनें' } }
    ]
  },
  {
    id: 2,
    didYouKnow: {
      en: "Taking soil samples in a zig-zag 'W' shape across the field prevents picking accidental cow dung patches! 🐄",
      hi: "खेत में 'W' आकार में टेढ़ा-मेढ़ा चलकर मिट्टी लेने से पूरे खेत की सही और निष्पक्ष जांच होती है! 🐄"
    },
    actionStrip: [
      { step: '1', icon: '🚶‍♂️', title: { en: 'Walk W-Shape', hi: 'W-पथ पर चलें' } },
      { step: '2', icon: '⛏️', title: { en: 'Auger 15cm', hi: '15cm गहरा गड्ढा' } },
      { step: '3', icon: '🥣', title: { en: 'Sieve 2mm', hi: '2mm छलनी छानें' } }
    ]
  },
  {
    id: 3,
    didYouKnow: {
      en: "SoiLENZ device uses optical reflectance sensors — like taking an MRI scan of the soil without hurting it! ⚡",
      hi: "SoiLENZ यंत्र ऑप्टिकल प्रकाश किरणों से मिट्टी की जांच करता है — जैसे बिना दर्द मिट्टी का एक्स-रे करना! ⚡"
    },
    actionStrip: [
      { step: '1', icon: '🥣', title: { en: 'Dish Sample', hi: 'कटोरी में भरें' } },
      { step: '2', icon: '📱', title: { en: 'Scan 90 Sec', hi: '90s स्कैन करें' } },
      { step: '3', icon: '📊', title: { en: 'View Health Score', hi: 'हेल्थ स्कोर देखें' } }
    ]
  },
  {
    id: 4,
    didYouKnow: {
      en: "Adding organic compost holds 20,000 extra liters of rainwater per acre, shielding crops from summer droughts! 💧",
      hi: "गोबर की जैविक खाद मिलाने से मिट्टी प्रति एकड़ 20,000 लीटर अधिक वर्षा जल सोखकर रखती है! 💧"
    },
    actionStrip: [
      { step: '1', icon: '📜', title: { en: 'Soil Health Card', hi: 'हेल्थ कार्ड बनाएं' } },
      { step: '2', icon: '👨‍🌾', title: { en: 'Visit Farmer', hi: 'किसान से मिलें' } },
      { step: '3', icon: '🌾', title: { en: 'Bumper Harvest', hi: 'भरपूर पैदावार' } }
    ]
  }
];

// Interactive Quizzes per module
const MODULE_QUIZZES = [
  {
    moduleId: 1,
    question: {
      en: 'Which soil layer holds the most organic matter, earthworms and plant food? 🪱',
      hi: 'कौन सी मिट्टी की परत में सबसे अधिक खाद, केंचुए और पौधों का भोजन होता है? 🪱'
    },
    options: [
      { id: 'a', text: { en: '🌱 Topsoil (Horizon A)', hi: '🌱 ऊपरी टॉपसॉइल' }, isCorrect: true },
      { id: 'b', text: { en: '🪨 Dense Subsoil (Horizon B)', hi: '🪨 घनी सबसॉइल' }, isCorrect: false },
      { id: 'c', text: { en: '⛰️ Solid Bedrock (Horizon R)', hi: '⛰️ कठोर चट्टानी बेडरॉक' }, isCorrect: false }
    ],
    explanation: {
      en: 'Topsoil is rich in dark humus made from decomposed leaves and earthworm castings!',
      hi: 'टॉपसॉइल सड़ी पत्तियों और केंचुए की खाद से बनी सबसे उपजाऊ काली मिट्टी होती है!'
    }
  },
  {
    moduleId: 2,
    question: {
      en: 'How deep should student scientists extract core soil using the field auger? ⛏️',
      hi: 'खेत में ऑगर से मिट्टी का नमूना कितनी गहराई से निकालना चाहिए? ⛏️'
    },
    options: [
      { id: 'a', text: { en: '🌱 0 to 15 cm deep', hi: '🌱 0 से 15 सेमी गहरा' }, isCorrect: true },
      { id: 'b', text: { en: '📏 Just 1 cm on top', hi: '📏 केवल 1 सेमी ऊपर से' }, isCorrect: false },
      { id: 'c', text: { en: '🕳️ 5 meters underground', hi: '🕳️ 5 मीटर पाताल तक' }, isCorrect: false }
    ],
    explanation: {
      en: '0-15 cm is the exact root zone where crops feed on nutrients!',
      hi: '0-15 सेमी वह मुख्य जड़ क्षेत्र है जहां पौधे सबसे ज्यादा भोजन लेते हैं!'
    }
  },
  {
    moduleId: 3,
    question: {
      en: 'What nutrient should you recommend if plant leaves turn pale yellow? 🍃',
      hi: 'यदि पौधे की पत्तियां पीली पड़ जाएं, तो कौन सा पोषक तत्व देना चाहिए? 🍃'
    },
    options: [
      { id: 'a', text: { en: '🟢 Nitrogen (N)', hi: '🟢 नाइट्रोजन (N)' }, isCorrect: true },
      { id: 'b', text: { en: '🧂 Table Salt', hi: '🧂 खाने का नमक' }, isCorrect: false },
      { id: 'c', text: { en: '🧊 Crushed Ice', hi: '🧊 बर्फ के टुकड़े' }, isCorrect: false }
    ],
    explanation: {
      en: 'Nitrogen builds green chlorophyll! Without it, leaves turn pale and yellow.',
      hi: 'नाइट्रोजन हरी क्लोरोफिल बनाता है! इसके बिना पत्तियां पीली पड़ जाती हैं।'
    }
  },
  {
    moduleId: 4,
    question: {
      en: 'Why is vermicompost (earthworm compost) magical for rural farmers? 🪱',
      hi: 'केंचुआ खाद (वर्मीकम्पोस्ट) किसान भाइयों के लिए जादुई क्यों है? 🪱'
    },
    options: [
      { id: 'a', text: { en: '💧 Holds water and restores living soil', hi: '💧 पानी सोखता है और मिट्टी जीवित रखता है' }, isCorrect: true },
      { id: 'b', text: { en: '🔥 Makes the field very hot', hi: '🔥 खेत को बहुत गर्म कर देता है' }, isCorrect: false },
      { id: 'c', text: { en: '🚫 Stops all seeds from growing', hi: '🚫 बीजों को उगने से रोकता है' }, isCorrect: false }
    ],
    explanation: {
      en: 'Vermicompost is packed with beneficial microbes and keeps the ground cool and moist!',
      hi: 'केंचुआ खाद में मित्र बैक्टीरिया होते हैं जो खेत को नम और हरा-भरा रखते हैं!'
    }
  }
];

export const VisualModulesView: React.FC<VisualModulesViewProps> = ({
  student,
  language
}) => {
  const [activeQuizModule, setActiveQuizModule] = useState<number | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [activeSpeechModule, setActiveSpeechModule] = useState<number | null>(null);

  // Mini-Game state: Module 1 Match Soil to Crop
  const [activeGameModule, setActiveGameModule] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [gameMessage, setGameMessage] = useState<string | null>(null);

  const handleReadModule = (moduleId: number, text: string) => {
    if (activeSpeechModule === moduleId && studentSpeech.isSpeaking()) {
      studentSpeech.stop();
      setActiveSpeechModule(null);
    } else {
      setActiveSpeechModule(moduleId);
      studentSpeech.speak(text, language);
      const interval = setInterval(() => {
        if (!studentSpeech.isSpeaking()) {
          setActiveSpeechModule(null);
          clearInterval(interval);
        }
      }, 500);
    }
  };

  const handleOpenQuiz = (modId: number) => {
    setActiveQuizModule(modId);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setActiveGameModule(null);
  };

  const handleSubmitQuiz = (isCorrect: boolean) => {
    setIsAnswerSubmitted(true);
    if (isCorrect) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleMatchSoil = (soilType: string, cropName: string) => {
    setMatchedPairs(prev => ({ ...prev, [soilType]: cropName }));
    if (Object.keys(matchedPairs).length >= 2) {
      setGameMessage(language === 'hi' ? 'शाबाश! आपने सभी सही जोड़ियां मिला दीं! 🎉' : 'Awesome! All crops matched successfully! 🎉');
      confetti({ particleCount: 40, spread: 50 });
    }
  };

  const resetGame = () => {
    setMatchedPairs({});
    setGameMessage(null);
  };

  return (
    <div className="space-y-6">

      {/* Main Grid of 4 Visual Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CURRICULUM_MODULES.map(mod => {
          const isDone = mod.id <= student.modulesCompleted;
          const enrich = MODULE_ENRICHMENT.find(e => e.id === mod.id) || MODULE_ENRICHMENT[0];
          const isSpeaking = activeSpeechModule === mod.id;

          return (
            <div
              key={mod.id}
              className="bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-6 border-2 border-emerald-200 shadow-sm flex flex-col justify-between hover:border-emerald-400 transition-all"
            >
              <div>
                {/* Header: Code + Audio button + Done status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                    {mod.code} • 18 Hours
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleReadModule(mod.id, `${mod.title}. ${mod.description}`)}
                      className={`p-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer min-h-[36px] ${
                        isSpeaking ? 'bg-rose-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      aria-label="Read module description aloud"
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
                      <span className="text-xs">{isSpeaking ? 'Stop' : 'Listen'}</span>
                    </button>

                    <span className={`px-2.5 py-1 rounded-full font-black text-xs ${
                      isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {isDone ? 'Passed 🏆' : 'Active 🌱'}
                    </span>
                  </div>
                </div>

                {/* Big Visual Illustration & Title */}
                <div className="rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-slate-100 mb-4 bg-slate-50 aspect-video relative group">
                  <img
                    src={mod.image}
                    alt={`Illustration for ${mod.title}`}
                    width={500}
                    height={280}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <h4 className="font-black text-white text-base sm:text-lg leading-tight drop-shadow-sm">
                      {mod.title}
                    </h4>
                  </div>
                </div>

                {/* 2-line Short Child-Friendly Description */}
                <p className="text-sm text-slate-600 font-medium mb-4 leading-relaxed">
                  {mod.description}
                </p>

                {/* 3-Step Picture Strip */}
                <div className="bg-gradient-to-r from-emerald-50 to-sky-50 rounded-2xl p-3 border border-emerald-200 mb-4">
                  <span className="text-[11px] font-black text-emerald-900 uppercase tracking-wider block mb-2">
                    {language === 'hi' ? '3-चरणीय गतिविधि 🎬:' : '3-Step Action Strip 🎬:'}
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {enrich.actionStrip.map((act) => (
                      <div key={act.step} className="bg-white rounded-xl p-2 border border-emerald-200/80 shadow-2xs">
                        <span className="text-xl block mb-0.5">{act.icon}</span>
                        <span className="text-[11px] font-bold text-slate-800 line-clamp-1">
                          {act.title[language]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Did You Know? Fun Fact */}
                <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-200 text-xs text-amber-950 flex items-start gap-2 mb-4">
                  <span className="text-lg">💡</span>
                  <div>
                    <span className="font-black block mb-0.5">
                      {language === 'hi' ? 'क्या आप जानते हैं?' : 'Did you know?'}
                    </span>
                    <p className="leading-relaxed font-medium">
                      {enrich.didYouKnow[language]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Play Quiz + Mini Game */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenQuiz(mod.id)}
                  className="flex-1 py-3 px-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 min-h-[48px]"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{language === 'hi' ? 'चित्र प्रश्नोत्तरी ❓' : 'Picture Quiz ❓'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveGameModule(mod.id);
                    setActiveQuizModule(null);
                    resetGame();
                  }}
                  className="py-3 px-4 rounded-2xl bg-purple-100 hover:bg-purple-200 text-purple-950 font-black text-xs border border-purple-300 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 min-h-[48px]"
                >
                  <span>🎮 {language === 'hi' ? 'मिनी खेल' : 'Mini-Game'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pop-up / Inline Visual Quiz Modal */}
      {activeQuizModule !== null && (() => {
        const quiz = MODULE_QUIZZES.find(q => q.moduleId === activeQuizModule) || MODULE_QUIZZES[0];
        const selectedOpt = quiz.options.find(o => o.id === selectedAnswer);
        const isCorrect = Boolean(selectedOpt?.isCorrect);

        return (
          <div className="bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-8 border-3 border-emerald-400 shadow-lg animate-fadeIn">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {language === 'hi' ? `मॉड्यूल ${activeQuizModule} चित्र क्विज़` : `Module ${activeQuizModule} Picture Quiz`}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setActiveQuizModule(null)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer min-h-[40px]"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-base sm:text-lg font-extrabold text-slate-800 mb-5">
              {quiz.question[language]}
            </p>

            {/* Picture Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {quiz.options.map(opt => {
                const isChosen = selectedAnswer === opt.id;
                let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-emerald-50 hover:border-emerald-300';
                if (isChosen) {
                  btnStyle = 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-102';
                }
                if (isAnswerSubmitted && isChosen) {
                  btnStyle = isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white';
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={isAnswerSubmitted}
                    onClick={() => {
                      setSelectedAnswer(opt.id);
                      handleSubmitQuiz(opt.isCorrect);
                    }}
                    className={`p-4 rounded-2xl border-2 font-bold text-sm text-left transition-all cursor-pointer min-h-[64px] flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt.text[language]}</span>
                    {isAnswerSubmitted && isChosen && (
                      <span className="text-lg">{isCorrect ? '🎉' : '🌱'}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback Banner */}
            {isAnswerSubmitted && (
              <div className={`p-4 rounded-2xl border-2 text-sm font-medium animate-fadeIn ${
                isCorrect 
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-950' 
                  : 'bg-amber-100 border-amber-300 text-amber-950'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{isCorrect ? '🎉' : '🌱'}</span>
                  <span className="font-black text-base">
                    {isCorrect 
                      ? (language === 'hi' ? 'शाबाश! बिल्कुल सही जवाब! ⭐' : 'Great Job! Super Correct! ⭐')
                      : (language === 'hi' ? 'कोई बात नहीं! फिर से कोशिश करें 🌱' : 'Almost! Try again next time 🌱')}
                  </span>
                </div>
                <p className="mt-1 leading-relaxed">
                  💡 {quiz.explanation[language]}
                </p>
              </div>
            )}
          </div>
        );
      })()}

      {/* Mini-Game: Match Soil to Crop */}
      {activeGameModule !== null && (
        <div className="bg-gradient-to-r from-purple-100 via-sky-50 to-emerald-100 rounded-3xl sm:rounded-4xl p-6 sm:p-7 border-3 border-purple-300 shadow-lg animate-fadeIn">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              <h3 className="text-lg sm:text-xl font-black text-purple-950">
                {language === 'hi' ? 'मिट्टी और फसल मिलाओ खेल! 🌾' : 'Soil & Crop Matching Quest! 🌾'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetGame}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 flex items-center gap-1 cursor-pointer"
                title="Reset game"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveGameModule(null)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 cursor-pointer min-h-[38px]"
              >
                ✕ Close
              </button>
            </div>
          </div>

          <p className="text-sm font-bold text-slate-700 mb-4">
            {language === 'hi' 
              ? 'टैप करें और मिलाएं: कौन सी फसल किस मिट्टी में सबसे खुश रहती है?' 
              : 'Tap to pair each soil type with its favorite happy crop!'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {/* Clay Soil */}
            <div className="p-4 rounded-2xl bg-white border-2 border-emerald-300 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-2xl block mb-1">🏺</span>
                <span className="font-black text-sm text-slate-900 block">
                  {language === 'hi' ? 'चिकनी मिट्टी (Clay)' : 'Clay Soil'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {language === 'hi' ? 'पानी रोक कर रखती है' : 'Holds lots of water'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleMatchSoil('clay', 'Paddy / Rice 🌾')}
                className={`mt-3 py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer min-h-[44px] ${
                  matchedPairs['clay'] 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                }`}
              >
                {matchedPairs['clay'] ? `✓ ${matchedPairs['clay']}` : (language === 'hi' ? '+ धान / चावल जोड़ें' : '+ Pair with Rice 🌾')}
              </button>
            </div>

            {/* Sandy Soil */}
            <div className="p-4 rounded-2xl bg-white border-2 border-amber-300 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-2xl block mb-1">🏖️</span>
                <span className="font-black text-sm text-slate-900 block">
                  {language === 'hi' ? 'रेतीली मिट्टी (Sandy)' : 'Sandy Soil'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {language === 'hi' ? 'हवादार और भुरभुरी' : 'Warm, aerated & loose'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleMatchSoil('sandy', 'Groundnut / Peanuts 🥜')}
                className={`mt-3 py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer min-h-[44px] ${
                  matchedPairs['sandy'] 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                }`}
              >
                {matchedPairs['sandy'] ? `✓ ${matchedPairs['sandy']}` : (language === 'hi' ? '+ मूंगफली जोड़ें' : '+ Pair with Peanuts 🥜')}
              </button>
            </div>

            {/* Loamy Soil */}
            <div className="p-4 rounded-2xl bg-white border-2 border-sky-300 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-2xl block mb-1">🥦</span>
                <span className="font-black text-sm text-slate-900 block">
                  {language === 'hi' ? 'दोमट मिट्टी (Loamy)' : 'Loamy Soil'}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {language === 'hi' ? 'संतुलित ऑल-राउंडर' : 'Perfect all-rounder balance'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleMatchSoil('loamy', 'Vegetables & Wheat 🥦')}
                className={`mt-3 py-2 px-3 rounded-xl font-black text-xs transition-all cursor-pointer min-h-[44px] ${
                  matchedPairs['loamy'] 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-sky-100 text-sky-900 hover:bg-sky-200'
                }`}
              >
                {matchedPairs['loamy'] ? `✓ ${matchedPairs['loamy']}` : (language === 'hi' ? '+ सब्जियां व गेहूं जोड़ें' : '+ Pair with Veggies 🥦')}
              </button>
            </div>
          </div>

          {gameMessage && (
            <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-400 text-emerald-950 font-black text-sm text-center shadow-xs animate-bounce">
              {gameMessage}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
