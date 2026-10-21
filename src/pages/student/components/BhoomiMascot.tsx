import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';
import { studentSpeech } from '../../../utils/studentSpeech';

interface BhoomiMascotProps {
  studentName: string;
  language: 'en' | 'hi';
}

const TIPS_EN = [
  "Hi! I'm Bhoomi, your soil buddy! Did you know a single teaspoon of healthy soil has more tiny creatures than all people on Earth? 🪱",
  "Earthworms are our underground superheroes! They eat dead leaves and tunnel through the earth to let plant roots breathe! 🌱",
  "Nitrogen (N) makes leaves lush and dark green, like superpowers in leafy spinach! 🍃",
  "SoiLENZ device uses special light waves to test soil nutrients in just 90 seconds! ⚡",
  "When you advise a village farmer on bio-compost, you help save earthworms and clean drinking water! 🌾"
];

const TIPS_HI = [
  "नमस्ते! मैं भूमि हूँ, आपका मिट्टी मित्र! क्या आप जानते हैं? एक चम्मच स्वस्थ मिट्टी में दुनिया के सभी इंसानों से ज्यादा नन्हे जीव रहते हैं! 🪱",
  "केंचुए हमारे जमीन के सुपरहीरो हैं! वे मिट्टी में सुरंगे बनाकर पौधों की जड़ों को सांस लेने में मदद करते हैं! 🌱",
  "नाइट्रोजन (N) पत्तियों को पालक की तरह हरा-भरा और मजबूत बनाता है! 🍃",
  "SoiLENZ यंत्र केवल 90 सेकंड में मिट्टी के पोषक तत्वों की सही जांच कर लेता है! ⚡",
  "जब आप किसान चाचा को जैविक खाद की सलाह देते हैं, तो आप पानी और धरती दोनों की रक्षा करते हैं! 🌾"
];

export const BhoomiMascot: React.FC<BhoomiMascotProps> = ({ studentName, language }) => {
  const tips = language === 'hi' ? TIPS_HI : TIPS_EN;
  const [tipIndex, setTipIndex] = useState(0);
  const [isHappy, setIsHappy] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentTip = tips[tipIndex];

  const handleNextTip = () => {
    setTipIndex((prev) => (prev + 1) % tips.length);
    setIsHappy(true);
    setTimeout(() => setIsHappy(false), 800);
  };

  const handleToggleSpeech = () => {
    if (studentSpeech.isSpeaking()) {
      studentSpeech.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      studentSpeech.speak(currentTip, language);
      // Fallback reset if speech finishes
      const checkInterval = setInterval(() => {
        if (!studentSpeech.isSpeaking()) {
          setIsSpeaking(false);
          clearInterval(checkInterval);
        }
      }, 500);
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-100/90 via-sky-50 to-amber-50 rounded-3xl sm:rounded-4xl p-5 sm:p-6 border-2 border-emerald-300 shadow-sm relative overflow-hidden transition-all">
      {/* Decorative background sun & clouds */}
      <div className="absolute top-2 right-3 text-2xl select-none opacity-60 pointer-events-none animate-pulse">
        ☀️
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative z-10">
        
        {/* Animated Bhoomi Mascot SVG Avatar */}
        <button
          type="button"
          onClick={() => {
            setIsHappy(true);
            setTimeout(() => setIsHappy(false), 800);
            handleToggleSpeech();
          }}
          className="relative group cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-400 rounded-3xl"
          aria-label={`Bhoomi the Seedling Mascot. Tap to hear tip.`}
        >
          <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-b from-emerald-200 to-amber-100 border-2 border-emerald-400 flex items-center justify-center shadow-md transition-transform duration-300 ${isHappy ? 'scale-110 -rotate-3' : 'hover:scale-105'}`}>
            <svg
              viewBox="0 0 120 120"
              className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Plant Pot */}
              <path
                d="M32 78L40 106C40.5 108 43 110 45 110H75C77 110 79.5 108 80 106L88 78H32Z"
                fill="#EA580C"
              />
              <rect x="28" y="72" width="64" height="8" rx="4" fill="#C2410C" />

              {/* Rich Dark Soil Mound */}
              <ellipse cx="60" cy="74" rx="28" ry="6" fill="#78350F" />

              {/* Sprout Stem */}
              <path
                d="M60 74C60 55 60 45 60 38"
                stroke="#15803D"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Left Leaf */}
              <path
                d="M60 46C48 44 38 32 44 22C54 22 58 36 60 46Z"
                fill="#22C55E"
                stroke="#15803D"
                strokeWidth="2"
              />

              {/* Right Leaf */}
              <path
                d="M60 40C72 38 82 26 76 16C66 16 62 30 60 40Z"
                fill="#4ADE80"
                stroke="#15803D"
                strokeWidth="2"
              />

              {/* Cute Face on Pot */}
              {/* Cheerful Eyes */}
              <ellipse cx="50" cy="90" rx="3.5" ry="4.5" fill="#1F2937" />
              <circle cx="51.5" cy="88.5" r="1.5" fill="white" />

              <ellipse cx="70" cy="90" rx="3.5" ry="4.5" fill="#1F2937" />
              <circle cx="71.5" cy="88.5" r="1.5" fill="white" />

              {/* Pink Rosy Cheeks */}
              <ellipse cx="44" cy="94" rx="3.5" ry="2" fill="#F472B6" opacity="0.8" />
              <ellipse cx="76" cy="94" rx="3.5" ry="2" fill="#F472B6" opacity="0.8" />

              {/* Smiling Mouth */}
              <path
                d="M56 95C58 98 62 98 64 95"
                stroke="#1F2937"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Little Water Dew Drop */}
              <circle cx="76" cy="22" r="2" fill="#38BDF8" />
            </svg>
          </div>

          <span className="absolute -bottom-2 -right-1 bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs border border-amber-500 uppercase tracking-wider">
            Bhoomi 🌱
          </span>
        </button>

        {/* Speech Bubble with Mascot message */}
        <div className="flex-1 w-full bg-white/95 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-emerald-200/90 shadow-xs relative">
          {/* Triangular Speech Pointer */}
          <div className="hidden sm:block absolute -left-2.5 top-8 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-10 border-r-white" />

          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base text-emerald-900">
                {language === 'hi' ? `नमस्ते, ${studentName.split(' ')[0]}! 👋` : `Hello, ${studentName.split(' ')[0]}! 👋`}
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {language === 'hi' ? 'दैनिक ज्ञान' : 'Soil Tip'}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* Read Aloud Button */}
              <button
                type="button"
                onClick={handleToggleSpeech}
                className={`p-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                  isSpeaking
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Read tip aloud'}
                aria-label={isSpeaking ? 'Stop reading tip' : 'Read tip aloud'}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="text-[11px] hidden xs:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
              </button>

              {/* Cycle Tip Button */}
              <button
                type="button"
                onClick={handleNextTip}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                title="Next Soil Tip"
                aria-label="Next tip"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-700 font-medium leading-relaxed">
            "{currentTip}"
          </p>

          <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-slate-100 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1 text-emerald-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {language === 'hi' ? 'टैप करें और सीखें' : 'Tap Bhoomi to hear him!'}
            </span>
            <span>•</span>
            <span className="text-slate-400">
              Tip {tipIndex + 1} of {tips.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
