import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Lock, CheckCircle2, Volume2, VolumeX, Star, HelpCircle } from 'lucide-react';
import { SYSTEM_BADGES } from '../../../data/modulesData';
import { Student } from '../../../types';
import { studentSpeech } from '../../../utils/studentSpeech';

interface PlayfulBadgesViewProps {
  student: Student;
  language: 'en' | 'hi';
}

interface BadgeIllustrationProps {
  id: string;
  isUnlocked: boolean;
}

const BadgeIllustration: React.FC<BadgeIllustrationProps> = ({ id, isUnlocked }) => {
  const filterClass = isUnlocked ? 'filter drop-shadow-md' : 'grayscale opacity-60';

  switch (id) {
    case 'badge-sampler':
      return (
        <svg viewBox="0 0 100 100" className={`w-20 h-20 sm:w-24 sm:h-24 transition-transform hover:scale-105 ${filterClass}`}>
          <defs>
            <linearGradient id="grad-sampler" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <radialGradient id="gold-shine" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#EAB308" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="44" fill="url(#grad-sampler)" stroke="#FDE047" strokeWidth="4" />
          <circle cx="50" cy="50" r="36" fill="#065F46" opacity="0.6" />
          {/* Compass Rose */}
          <polygon points="50,18 55,45 82,50 55,55 50,82 45,55 18,50 45,45" fill="url(#gold-shine)" />
          {/* Center Needle & Sprout */}
          <circle cx="50" cy="50" r="10" fill="#FFFFFF" stroke="#047857" strokeWidth="2" />
          <path d="M48 50 Q50 38 54 44" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="50" cy="50" r="3" fill="#EAB308" />
          {/* Star Sparkles */}
          <circle cx="28" cy="28" r="2.5" fill="#FEF08A" />
          <circle cx="72" cy="72" r="2.5" fill="#FEF08A" />
        </svg>
      );

    case 'badge-tester':
      return (
        <svg viewBox="0 0 100 100" className={`w-20 h-20 sm:w-24 sm:h-24 transition-transform hover:scale-105 ${filterClass}`}>
          <defs>
            <linearGradient id="grad-tester" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="44" fill="url(#grad-tester)" stroke="#38BDF8" strokeWidth="4" />
          {/* Handheld Lens Body */}
          <rect x="26" y="24" width="48" height="42" rx="10" fill="#0369A1" stroke="#BAE6FD" strokeWidth="2" />
          {/* Digital Screen / Lens */}
          <circle cx="50" cy="42" r="14" fill="#38BDF8" opacity="0.3" stroke="#BAE6FD" strokeWidth="1.5" />
          <circle cx="50" cy="42" r="8" fill="#F0FDF4" />
          {/* Sensor Scan Beam */}
          <path d="M38 56 L42 74 L58 74 L62 56 Z" fill="#38BDF8" opacity="0.4" />
          <circle cx="50" cy="74" r="4" fill="#FACC15" />
          {/* Handle */}
          <rect x="45" y="66" width="10" height="20" rx="4" fill="#0C4A6E" />
          {/* Sparkles */}
          <circle cx="70" cy="26" r="3" fill="#FDE047" />
        </svg>
      );

    case 'badge-reporter':
      return (
        <svg viewBox="0 0 100 100" className={`w-20 h-20 sm:w-24 sm:h-24 transition-transform hover:scale-105 ${filterClass}`}>
          <defs>
            <linearGradient id="grad-reporter" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#6D28D9" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="44" fill="url(#grad-reporter)" stroke="#C4B5FD" strokeWidth="4" />
          {/* Report Clipboard */}
          <rect x="30" y="22" width="40" height="54" rx="6" fill="#F8FAFC" stroke="#7C3AED" strokeWidth="2" />
          <rect x="42" y="18" width="16" height="7" rx="3" fill="#7C3AED" />
          {/* Bar Chart inside report */}
          <rect x="38" y="52" width="6" height="14" rx="2" fill="#10B981" />
          <rect x="47" y="44" width="6" height="22" rx="2" fill="#3B82F6" />
          <rect x="56" y="36" width="6" height="30" rx="2" fill="#F59E0B" />
          {/* Golden Seal */}
          <circle cx="62" cy="66" r="7" fill="#F59E0B" stroke="#FEF3C7" strokeWidth="1.5" />
          <polygon points="62,62 63.5,65 67,65 64,67 65,70 62,68 59,70 60,67 57,65 60.5,65" fill="#FFFFFF" />
        </svg>
      );

    case 'badge-farmer-friend':
      return (
        <svg viewBox="0 0 100 100" className={`w-20 h-20 sm:w-24 sm:h-24 transition-transform hover:scale-105 ${filterClass}`}>
          <defs>
            <linearGradient id="grad-farmer" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="44" fill="url(#grad-farmer)" stroke="#FDE68A" strokeWidth="4" />
          {/* Sun background */}
          <circle cx="50" cy="38" r="18" fill="#FEF08A" opacity="0.5" />
          {/* Golden Wheat Stalks */}
          <path d="M42 68 Q46 50 50 40 Q54 50 58 68" stroke="#78350F" strokeWidth="3" fill="none" />
          {/* Wheat grains */}
          <ellipse cx="44" cy="46" rx="4" ry="2.5" fill="#FEF3C7" stroke="#92400E" strokeWidth="1" transform="rotate(-30 44 46)" />
          <ellipse cx="56" cy="46" rx="4" ry="2.5" fill="#FEF3C7" stroke="#92400E" strokeWidth="1" transform="rotate(30 56 46)" />
          <ellipse cx="43" cy="54" rx="4" ry="2.5" fill="#FEF3C7" stroke="#92400E" strokeWidth="1" transform="rotate(-30 43 54)" />
          <ellipse cx="57" cy="54" rx="4" ry="2.5" fill="#FEF3C7" stroke="#92400E" strokeWidth="1" transform="rotate(30 57 54)" />
          <circle cx="50" cy="38" r="4" fill="#FEF3C7" stroke="#92400E" strokeWidth="1" />
          {/* Helping hands base */}
          <path d="M30 76 Q50 68 70 76" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'badge-ambassador':
      return (
        <svg viewBox="0 0 100 100" className={`w-20 h-20 sm:w-24 sm:h-24 transition-transform hover:scale-105 ${filterClass}`}>
          <defs>
            <linearGradient id="grad-ambassador" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#BE185D" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="44" fill="url(#grad-ambassador)" stroke="#FBCFE8" strokeWidth="4" />
          {/* Golden Ribbon Trophy */}
          <polygon points="50,22 58,38 76,40 62,52 66,70 50,60 34,70 38,52 24,40 42,38" fill="#FACC15" stroke="#EAB308" strokeWidth="2" />
          {/* Center Earth Leaf */}
          <circle cx="50" cy="47" r="8" fill="#10B981" />
          <path d="M47 47 Q50 42 53 47" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Hanging Ribbon Tails */}
          <polygon points="42,66 38,82 46,78 50,82 46,66" fill="#F43F5E" />
          <polygon points="58,66 62,82 54,78 50,82 54,66" fill="#E11D48" />
        </svg>
      );

    default:
      return (
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100 flex items-center justify-center text-3xl">
          🌟
        </div>
      );
  }
};

export const PlayfulBadgesView: React.FC<PlayfulBadgesViewProps> = ({ student, language }) => {
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const badgeDetails: Record<string, {
    title: { en: string; hi: string };
    howToEarn: { en: string; hi: string };
    xp: number;
    tip: { en: string; hi: string };
  }> = {
    'badge-sampler': {
      title: { en: 'Master Sampler 🌾', hi: 'मास्टर नमूना संग्राहक 🌾' },
      howToEarn: {
        en: 'Collect 20+ verified soil samples in the field using the zigzag pattern.',
        hi: 'खेत में ज़िगज़ैग तकनीक से 20+ सत्यापित मिट्टी के नमूने एकत्र करें।'
      },
      xp: 150,
      tip: {
        en: 'Always scrape dry surface grass before augering 15cm down!',
        hi: '15 सेमी गड्ढा करने से पहले ऊपर की सूखी घास हमेशा साफ करें!'
      }
    },
    'badge-tester': {
      title: { en: 'SoiLENZ Digital Tester 🔬', hi: 'SoiLENZ डिजिटल परीक्षक 🔬' },
      howToEarn: {
        en: 'Run 30+ precision scans with the handheld SoiLENZ sensor.',
        hi: 'हाथ के SoiLENZ सेंसर से 30+ सटीक परीक्षण पूरे करें।'
      },
      xp: 200,
      tip: {
        en: 'Keep the sensor glass clean with a soft dry microfiber cloth.',
        hi: 'सेंसर के कांच को हमेशा मुलायम सूखे कपड़े से साफ रखें।'
      }
    },
    'badge-reporter': {
      title: { en: 'Data & Health Card Hero 📊', hi: 'डेटा और स्वास्थ्य कार्ड विशेषज्ञ 📊' },
      howToEarn: {
        en: 'Generate 15+ official Soil Health Cards for village farmers.',
        hi: 'गांव के किसानों के लिए 15+ आधिकारिक मृदा स्वास्थ्य कार्ड बनाएं।'
      },
      xp: 150,
      tip: {
        en: 'Explain the N-P-K colors clearly to the farmer.',
        hi: 'किसान को N-P-K के रंगों का मतलब सरल भाषा में समझाएं।'
      }
    },
    'badge-farmer-friend': {
      title: { en: 'Farmer Friend & Guide 🤝', hi: 'किसान मित्र और मार्गदर्शक 🤝' },
      howToEarn: {
        en: 'Visit and advise over 50 farming families in your village cluster.',
        hi: 'अपने क्षेत्र के 50 से अधिक किसान परिवारों से मिलकर सलाह दें।'
      },
      xp: 250,
      tip: {
        en: 'Listen to the farmer’s crop history before giving advice!',
        hi: 'सलाह देने से पहले हमेशा किसान की पिछली फसल का हाल सुनें!'
      }
    },
    'badge-ambassador': {
      title: { en: 'Village Soil Ambassador 🏅', hi: 'ग्राम मृदा दूत 🏅' },
      howToEarn: {
        en: 'Lead a village gathering and present the soil capstone project.',
        hi: 'ग्राम चौपाल में भाषण दें और मिट्टी संरक्षण प्रोजेक्ट प्रस्तुत करें।'
      },
      xp: 300,
      tip: {
        en: 'Demonstrate how earthworms make topsoil rich and fertile!',
        hi: 'दिखाएं कि केंचुए कैसे मिट्टी को उपजाऊ और भुरभुरा बनाते हैं!'
      }
    }
  };

  const unlockedCount = student.badgeIds.length;
  const totalBadges = SYSTEM_BADGES.length;
  const totalEarnedXP = student.badgeIds.reduce((sum, bId) => {
    return sum + (badgeDetails[bId]?.xp || 100);
  }, 0);

  const handleBadgeClick = (badgeId: string, isUnlocked: boolean) => {
    setSelectedBadgeId(badgeId);

    if (isUnlocked) {
      // Confetti burst
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleReadBadge = (badgeId: string) => {
    const detail = badgeDetails[badgeId];
    if (!detail) return;

    if (isSpeaking && studentSpeech.isSpeaking()) {
      studentSpeech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToSpeak = language === 'hi'
        ? `${detail.title.hi}. कैसे कमाएं: ${detail.howToEarn.hi}. सुझाव: ${detail.tip.hi}`
        : `${detail.title.en}. How to earn: ${detail.howToEarn.en}. Helpful tip: ${detail.tip.en}`;
      studentSpeech.speak(textToSpeak, language);
      const timer = setInterval(() => {
        if (!studentSpeech.isSpeaking()) {
          setIsSpeaking(false);
          clearInterval(timer);
        }
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Playful Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-emerald-500 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-amber-100 border border-white/30">
              <Sparkles className="w-4 h-4 text-yellow-200" />
              {language === 'hi' ? 'बैज और उपलब्धियां' : 'Achievement Badges'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {language === 'hi' ? 'आपकी चमचमाती ट्राफियां!' : 'Your Shiny Trophies!'} 🏆
            </h2>
            <p className="text-sm sm:text-base text-yellow-100 max-w-lg font-medium">
              {language === 'hi'
                ? 'हर नया काम सीखने और किसानों की मदद करने पर आपको नया बैज और स्टार्स मिलते हैं!'
                : 'Every test you perform and farmer you guide unlocks a shining badge and XP stars!'}
            </p>
          </div>

          {/* XP & Count Showcase */}
          <div className="flex items-center gap-3 bg-white/95 rounded-2xl p-4 text-slate-800 shadow-md shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl shadow-inner">
              ⭐
            </div>
            <div>
              <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                {language === 'hi' ? 'कुल अनुभव अंक' : 'Total XP Earned'}
              </div>
              <div className="text-2xl font-black text-slate-900">
                {totalEarnedXP} <span className="text-xs text-amber-500 font-bold">XP</span>
              </div>
              <div className="text-[11px] font-semibold text-emerald-700">
                {unlockedCount} / {totalBadges} {language === 'hi' ? 'बैज अनलॉक' : 'Badges Unlocked'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SYSTEM_BADGES.map(badge => {
          const isUnlocked = student.badgeIds.includes(badge.id);
          const detail = badgeDetails[badge.id] || {
            title: { en: badge.name, hi: badge.name },
            howToEarn: { en: badge.description, hi: badge.description },
            xp: 100,
            tip: { en: 'Keep exploring!', hi: 'आगे बढ़ते रहें!' }
          };
          const isSelected = selectedBadgeId === badge.id;

          return (
            <div
              key={badge.id}
              onClick={() => handleBadgeClick(badge.id, isUnlocked)}
              className={`rounded-3xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-gradient-to-b from-white to-amber-50/40 border-amber-300 shadow-sm hover:shadow-md hover:border-amber-400'
                  : 'bg-slate-50/80 border-dashed border-slate-300 opacity-75 hover:opacity-100'
              } ${isSelected ? 'ring-4 ring-amber-300/60' : ''}`}
            >
              <div>
                {/* Header: Status Tag & XP */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${
                      isUnlocked
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {language === 'hi' ? 'अनलॉक हुआ! 🎉' : 'Unlocked! 🎉'}
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                        {language === 'hi' ? 'अभी बाकी है' : 'Locked'}
                      </>
                    )}
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    +{detail.xp} XP
                  </span>
                </div>

                {/* Illustrated Badge Center */}
                <div className="flex flex-col items-center text-center my-3">
                  <BadgeIllustration id={badge.id} isUnlocked={isUnlocked} />

                  <h3 className="font-black text-base text-slate-900 mt-3 leading-snug">
                    {language === 'hi' ? detail.title.hi : detail.title.en}
                  </h3>
                </div>

                {/* How to Earn / Description - Max 2 lines */}
                <div className="p-3 rounded-2xl bg-white/80 border border-slate-200 text-xs text-slate-700 leading-relaxed mb-3">
                  <div className="font-bold text-slate-900 mb-0.5 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                    {language === 'hi' ? 'इसे कैसे पाएं:' : 'How to earn:'}
                  </div>
                  <p className="line-clamp-2">
                    {language === 'hi' ? detail.howToEarn.hi : detail.howToEarn.en}
                  </p>
                </div>
              </div>

              {/* Action row: Audio & Tap tip */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReadBadge(badge.id);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
                  title="Read aloud"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                      {language === 'hi' ? 'रोकें' : 'Stop'}
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                      {language === 'hi' ? 'सुनें' : 'Listen'}
                    </>
                  )}
                </button>

                <span className="text-[11px] text-slate-400 font-medium">
                  {isUnlocked
                    ? (language === 'hi' ? 'बधाई हो!' : 'Great job!')
                    : (language === 'hi' ? 'प्रयास जारी रखें' : 'Keep trying')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
