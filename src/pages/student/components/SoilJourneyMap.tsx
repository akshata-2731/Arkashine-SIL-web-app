import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  Filter, 
  Cpu, 
  Database, 
  BarChart3, 
  Activity, 
  FileCheck, 
  Leaf, 
  Volume2, 
  VolumeX,
  Star
} from 'lucide-react';
import { SOIL_JOURNEY_STEPS } from '../../../data/modulesData';
import { studentSpeech } from '../../../utils/studentSpeech';

interface SoilJourneyMapProps {
  language: 'en' | 'hi';
  onExploreDiagrams: () => void;
  onWatchVideos?: () => void;
}

export const SoilJourneyMap: React.FC<SoilJourneyMapProps> = ({
  language,
  onExploreDiagrams,
  onWatchVideos
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [speakingStep, setSpeakingStep] = useState<number | null>(null);

  const stepIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    Compass, Filter, Cpu, Database, BarChart3, Activity, FileCheck, Leaf
  };

  // Gamification Level calculations
  const totalCompleted = completedSteps.length;
  const xpPoints = totalCompleted * 25; // 25 XP per milestone

  const getLevelInfo = (count: number) => {
    if (count <= 2) {
      return {
        level: 1,
        name: language === 'hi' ? 'बीज खोजी 🌰' : 'Seedling Scout 🌰',
        next: language === 'hi' ? 'अगला: हरा अंकुर 🌱' : 'Next: Green Sprout 🌱',
        plantIcon: '🌰',
        color: 'from-amber-400 to-amber-600'
      };
    }
    if (count <= 4) {
      return {
        level: 2,
        name: language === 'hi' ? 'हरा अंकुर 🌱' : 'Green Sprout 🌱',
        next: language === 'hi' ? 'अगला: मृदा रक्षक 🪴' : 'Next: Soil Guardian 🪴',
        plantIcon: '🌱',
        color: 'from-emerald-400 to-emerald-600'
      };
    }
    if (count <= 6) {
      return {
        level: 3,
        name: language === 'hi' ? 'मृदा रक्षक 🪴' : 'Soil Guardian 🪴',
        next: language === 'hi' ? 'अगला: महान वृक्ष मित्र 🌳' : 'Next: Mighty Tree Partner 🌳',
        plantIcon: '🪴',
        color: 'from-teal-500 to-emerald-700'
      };
    }
    return {
      level: 4,
      name: language === 'hi' ? 'महान वृक्ष मित्र 🌳' : 'Mighty Tree Partner 🌳',
      next: language === 'hi' ? 'महान उपलब्धि पूर्ण! 🎉' : 'Grand Mastery Unlocked! 🎉',
      plantIcon: '🌳',
      color: 'from-purple-500 to-emerald-600'
    };
  };

  const levelInfo = getLevelInfo(totalCompleted);

  const handleStepClick = (stepNum: number) => {
    // If not completed yet, complete it with confetti!
    if (!completedSteps.includes(stepNum)) {
      setCompletedSteps(prev => [...prev, stepNum].sort((a, b) => a - b));

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }
  };

  const toggleExpand = (stepNum: number) => {
    setExpandedStep(prev => (prev === stepNum ? null : stepNum));
  };

  const handleReadStep = (stepNum: number, text: string) => {
    if (speakingStep === stepNum && studentSpeech.isSpeaking()) {
      studentSpeech.stop();
      setSpeakingStep(null);
    } else {
      setSpeakingStep(stepNum);
      studentSpeech.speak(text, language);
      const interval = setInterval(() => {
        if (!studentSpeech.isSpeaking()) {
          setSpeakingStep(null);
          clearInterval(interval);
        }
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Gamified Level & XP Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-100 via-sky-50 to-amber-100 rounded-3xl sm:rounded-4xl p-5 sm:p-7 border-2 border-emerald-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Animated Growing Plant Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white shadow-md border-3 border-emerald-400 flex items-center justify-center text-5xl shrink-0 animate-bounce">
            {levelInfo.plantIcon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="bg-emerald-700 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Level {levelInfo.level}
              </span>
              <span className="text-xs font-black text-amber-900 bg-amber-200/90 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                {xpPoints} XP
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
              {levelInfo.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              {totalCompleted} of 8 milestones completed • {levelInfo.next}
            </p>
          </div>
        </div>

        {/* Action Buttons to Open Videos and Science Wonders */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          {onWatchVideos && (
            <button
              type="button"
              onClick={onWatchVideos}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              <span>{language === 'hi' ? 'वीडियो पाठ देखें 🎬' : 'Watch Videos 🎬'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onExploreDiagrams}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
          >
            <span>{language === 'hi' ? 'जमीन के अंदर झांकें 🔬' : 'Explore Soil Wonders 🔬'}</span>
          </button>
        </div>
      </div>

      {/* Visual Winding Trail Stepping Stones */}
      <div className="bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-7 border-2 border-emerald-200 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              {language === 'hi' ? '8-चरणीय मृदा यात्रा पथ 🗺️' : 'The 8-Step Soil Adventure Trail 🗺️'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              {language === 'hi' 
                ? 'खेत में नमूना लेने से लेकर किसान चाचा को सलाह देने तक का रोमांचक सफर!' 
                : 'From auger sampling in fields to helping village farmers with SoiLENZ!'}
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-center">
            {language === 'hi' ? 'टैप करके माइलस्टोन अनलॉक करें' : 'Tap steps to celebrate progress 🎉'}
          </span>
        </div>

        {/* Stepping Stones Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SOIL_JOURNEY_STEPS.map((st) => {
            const IconComponent = stepIcons[st.iconName] || Leaf;
            const isDone = completedSteps.includes(st.step);
            const isExpanded = expandedStep === st.step;
            const isSpeaking = speakingStep === st.step;

            return (
              <div
                key={st.id}
                className={`p-4 sm:p-5 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                  isDone
                    ? 'bg-gradient-to-b from-emerald-50/70 to-sky-50/40 border-emerald-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-70'
                }`}
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => handleStepClick(st.step)}
                      className={`w-10 h-10 rounded-2xl font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-xs min-w-[40px] ${
                        isDone
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                          : 'bg-slate-200 text-slate-600 hover:bg-emerald-200'
                      }`}
                      title={isDone ? 'Completed' : 'Tap to mark completed'}
                      aria-label={`Step ${st.step}: ${st.title}`}
                    >
                      {isDone ? '✓' : st.step}
                    </button>

                    <div className="flex items-center gap-1">
                      {/* Audio Button */}
                      <button
                        type="button"
                        onClick={() => handleReadStep(st.step, `${st.title}. ${st.tagline}. ${st.description}`)}
                        className={`p-1.5 rounded-xl font-bold text-xs flex items-center cursor-pointer ${
                          isSpeaking ? 'bg-rose-500 text-white' : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                        title="Read step aloud"
                        aria-label={`Listen to step ${st.step}`}
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-700" />}
                      </button>

                      {isDone ? (
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Done
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Icon + Title */}
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs shrink-0">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-base text-slate-900 leading-tight">
                        {st.step}. {st.title}
                      </h4>
                      <p className="text-xs font-bold text-emerald-800">
                        {st.tagline}
                      </p>
                    </div>
                  </div>

                  {/* 2-line Short Description */}
                  <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2">
                    {st.description}
                  </p>

                  {/* Tell me more expander */}
                  {isExpanded && (
                    <div className="mt-3 p-3 bg-white rounded-2xl border border-emerald-200 text-xs text-slate-700 space-y-1.5 animate-fadeIn">
                      <p className="font-bold text-emerald-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        {language === 'hi' ? 'फील्ड गाइड:' : 'Field Secret:'}
                      </p>
                      <p className="leading-relaxed">
                        {language === 'hi' 
                          ? 'खेत में हमेशा वी-आकार का गड्ढा बनाएं और 15 सेमी की गहराई से साफ मिट्टी ही प्लास्टिक थैली में रखें।' 
                          : 'Always clear surface dry grass, make a neat V-shape slice, and seal core soil in labelled bags!'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Expander Button */}
                <button
                  type="button"
                  onClick={() => toggleExpand(st.step)}
                  className="mt-3 text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center justify-between py-1 px-2 rounded-xl hover:bg-emerald-100/60 transition-colors cursor-pointer"
                >
                  <span>{isExpanded ? (language === 'hi' ? 'कम दिखाएं' : 'Less') : (language === 'hi' ? 'और जानें 🔍' : 'Tell me more 🔍')}</span>
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
