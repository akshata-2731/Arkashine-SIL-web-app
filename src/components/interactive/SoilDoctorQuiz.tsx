import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  RefreshCw, 
  ArrowRight, 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizQuestion {
  id: number;
  moduleTag: string;
  question: string;
  options: {
    id: string;
    label: string; // 'A' | 'B' | 'C' | 'D'
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    moduleTag: 'Module 1: Living Soil Science',
    question: 'Why do healthy plants need living earthworms and mycorrhizae in the topsoil (A-Horizon)?',
    options: [
      { 
        id: 'a', 
        label: 'A',
        text: 'They consume live root tips for energy and dry the soil', 
        isCorrect: false, 
        explanation: 'Incorrect: Earthworms only decompose dead plant litter, never live crop roots.' 
      },
      { 
        id: 'b', 
        label: 'B',
        text: 'They aerate soil, burrow moisture channels, and trade minerals for plant sugars', 
        isCorrect: true, 
        explanation: 'Correct! Earthworm tunnels increase rainwater infiltration 10x, and mycorrhizal fungi feed phosphorus to root hairs.' 
      },
      { 
        id: 'c', 
        label: 'C',
        text: 'They compress soil particles into hard stone layers', 
        isCorrect: false, 
        explanation: 'Incorrect: Living biology loosens compacted soil and creates porous crumb structure.' 
      },
      { 
        id: 'd', 
        label: 'D',
        text: 'They lock away all nitrogen so weeds cannot grow', 
        isCorrect: false, 
        explanation: 'Incorrect: Microbes convert organic nitrogen into bio-available ammonium and nitrate for crops.' 
      }
    ]
  },
  {
    id: 2,
    moduleTag: 'Module 2: Field Sampling Protocol',
    question: 'What is the scientifically correct depth and pattern for collecting representative farm soil samples?',
    options: [
      { 
        id: 'a', 
        label: 'A',
        text: 'Top 1 cm surface dust collected only from a single spot', 
        isCorrect: false, 
        explanation: 'Incorrect: Surface dust skews readings and misses the active root feeding zone.' 
      },
      { 
        id: 'b', 
        label: 'B',
        text: '0 to 15 cm V-shaped core slices collected in a zig-zag field grid', 
        isCorrect: true, 
        explanation: 'Correct! A 15 cm V-cut in a zig-zag path captures 90% of active feeder roots across the entire plot.' 
      },
      { 
        id: 'c', 
        label: 'C',
        text: 'Digging 2 meters deep down to bedrock under tree shade', 
        isCorrect: false, 
        explanation: 'Incorrect: Tree shade alters moisture/pH, and 2 meters deep hits non-agricultural parent rock.' 
      },
      { 
        id: 'd', 
        label: 'D',
        text: 'Scraping fresh animal manure directly into the bag', 
        isCorrect: false, 
        explanation: 'Incorrect: Sampling near compost or manure heaps contaminates the sample with artificial nitrogen spikes.' 
      }
    ]
  },
  {
    id: 3,
    moduleTag: 'Module 3: SoiLENZ Rapid Device Testing',
    question: 'How does the portable SoiLENZ testing device conduct scientific soil analysis in the field?',
    options: [
      { 
        id: 'a', 
        label: 'A',
        text: 'It sends soil to an overseas laboratory by postal mail taking 3 weeks', 
        isCorrect: false, 
        explanation: 'Incorrect: SoiLENZ is a localized on-spot optical device delivering results in 15 minutes.' 
      },
      { 
        id: 'b', 
        label: 'B',
        text: 'Multi-parameter sensors dip into a prepared soil extract to measure pH, EC, N, P, and K', 
        isCorrect: true, 
        explanation: 'Correct! The sensor probe analyzes optical absorption and conductivity to quantify 14 soil health parameters.' 
      },
      { 
        id: 'c', 
        label: 'C',
        text: 'It guesses soil health based on the smell of dirt', 
        isCorrect: false, 
        explanation: 'Incorrect: SoiLENZ uses calibrated spectroscopic and electrical sensors for laboratory accuracy.' 
      },
      { 
        id: 'd', 
        label: 'D',
        text: 'It only works if you burn the soil sample in a flame', 
        isCorrect: false, 
        explanation: 'Incorrect: Burning destroys soil organic matter. SoiLENZ uses a safe single-reagent liquid extraction.' 
      }
    ]
  },
  {
    id: 4,
    moduleTag: 'Module 4: Soil Chemistry & pH Lockout',
    question: 'If a soil test reveals strongly acidic pH 5.2 with phosphorus lockout, what should the Soil Partner prescribe?',
    options: [
      { 
        id: 'a', 
        label: 'A',
        text: 'Spray 5 extra bags of synthetic Urea immediately', 
        isCorrect: false, 
        explanation: 'Incorrect: Urea breaks down into acidic compounds, acidifying the soil further and burning tender roots.' 
      },
      { 
        id: 'b', 
        label: 'B',
        text: 'Apply Agricultural Lime (CaCO3) to neutralize acidity and liberate locked phosphorus', 
        isCorrect: true, 
        explanation: 'Correct! Agricultural lime buffers the pH back to the optimal 6.5–7.5 zone, allowing roots to absorb phosphorus.' 
      },
      { 
        id: 'c', 
        label: 'C',
        text: 'Flood the field with salty groundwater', 
        isCorrect: false, 
        explanation: 'Incorrect: Saline water raises salinity (EC) and poisons crops.' 
      },
      { 
        id: 'd', 
        label: 'D',
        text: 'Advise the farmer to stop growing crops permanently', 
        isCorrect: false, 
        explanation: 'Incorrect: Acidic soil is easily correctable with scientific liming and organic vermicompost.' 
      }
    ]
  },
  {
    id: 5,
    moduleTag: 'Module 4: Agronomy & Precision Farming',
    question: 'Why is precision soil testing far superior to traditional blind fertilizer application?',
    options: [
      { 
        id: 'a', 
        label: 'A',
        text: 'It costs ₹50,000 per test and takes several months', 
        isCorrect: false, 
        explanation: 'Incorrect: SoiLENZ school lab tests are low-cost, rapid, and completed during a single student visit.' 
      },
      { 
        id: 'b', 
        label: 'B',
        text: 'It eliminates fertilizer waste, protects groundwater, and boosts crop yield by ~20%', 
        isCorrect: true, 
        explanation: 'Correct! Precision dosing prevents chemical runoff, cuts input costs by 15%, and maximizes harvest yield.' 
      },
      { 
        id: 'c', 
        label: 'C',
        text: 'It replaces the need for sunshine and irrigation water', 
        isCorrect: false, 
        explanation: 'Incorrect: Crops still need photosynthesis and water; soil tests optimize nutrient nutrition.' 
      },
      { 
        id: 'd', 
        label: 'D',
        text: 'It guarantees that weeds will never grow again', 
        isCorrect: false, 
        explanation: 'Incorrect: Soil testing balances crop fertility; weed management requires cultivation.' 
      }
    ]
  }
];

interface SoilDoctorQuizProps {
  onQuizPassed?: (scorePercent: number) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const SoilDoctorQuiz: React.FC<SoilDoctorQuizProps> = ({ onQuizPassed, onNavigateToTab }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = scorePercent >= 80;

  const handleSelectOption = (optId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionId(optId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const chosen = currentQ.options.find(o => o.id === selectedOptionId);
    if (chosen?.isCorrect) {
      setCorrectCount(prev => prev + 1);
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz finished
      setCompleted(true);
      const finalPercent = Math.round((correctCount / totalQuestions) * 100);
      try {
        localStorage.setItem('arkashine_quiz_score', String(finalPercent));
        if (finalPercent >= 80) {
          localStorage.setItem('arkashine_quiz_passed', 'true');
          if (onQuizPassed) onQuizPassed(finalPercent);
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.6 }
          });
        }
      } catch {}
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setCorrectCount(0);
    setCompleted(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1 bg-purple-50 text-[#5C26C0] border border-purple-200">
            Certified Soil Partner Qualification Check 🩺
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Soil Doctor Certification Quiz
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Test your scientific diagnosis skills across the 4 training modules. Score <strong className="text-[#5C26C0]">≥80% (4 of 5)</strong> to qualify for your Soil Partner Certificate!
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
            Passing Bar: <strong className="text-emerald-700">80%</strong>
          </span>
        </div>
      </div>

      {!completed ? (
        <div className="space-y-5">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-600">
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <span className="text-purple-700 font-mono">Current Score: {correctCount} of {currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)}</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#5C26C0] h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block mb-1">
              {currentQ.moduleTag}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h3>
          </div>

          {/* Options Grid (Completely Neutral Letters: A, B, C, D — No Leaked Answers!) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              
              // Neutral default styles before submission
              let containerStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 hover:border-purple-300';
              let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';

              if (isSelected && !isAnswerSubmitted) {
                containerStyle = 'border-[#5C26C0] bg-purple-50/50 text-slate-900 ring-2 ring-[#5C26C0]/20 shadow-xs';
                badgeStyle = 'bg-[#5C26C0] text-white border-[#5C26C0] font-black';
              }

              // After submission styles: ONLY NOW reveal correctness!
              if (isAnswerSubmitted) {
                if (opt.isCorrect) {
                  containerStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-400';
                  badgeStyle = 'bg-emerald-600 text-white border-emerald-600 font-black';
                } else if (isSelected && !opt.isCorrect) {
                  containerStyle = 'border-rose-500 bg-rose-50/80 text-rose-950 ring-2 ring-rose-400';
                  badgeStyle = 'bg-rose-600 text-white border-rose-600 font-black';
                } else {
                  containerStyle = 'opacity-40 border-slate-200 bg-slate-50 text-slate-400';
                  badgeStyle = 'bg-slate-200 text-slate-400 border-slate-300';
                }
              }

              return (
                <button
                  key={opt.id}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${containerStyle}`}
                >
                  {/* Neutral Label Badge: A, B, C, D */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold border shrink-0 transition-colors ${badgeStyle}`}>
                    {isAnswerSubmitted ? (
                      opt.isCorrect ? <CheckCircle2 className="w-4 h-4 text-white" /> : (isSelected ? <XCircle className="w-4 h-4 text-white" /> : opt.label)
                    ) : (
                      opt.label
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs sm:text-sm leading-relaxed">{opt.text}</p>
                    
                    {/* Scientific explanation shown ONLY after submitting */}
                    {isAnswerSubmitted && (opt.isCorrect || isSelected) && (
                      <div className={`mt-2 p-2 rounded-xl text-[11px] leading-relaxed border ${
                        opt.isCorrect 
                          ? 'bg-emerald-100/70 text-emerald-900 border-emerald-300 font-medium' 
                          : 'bg-rose-100/70 text-rose-900 border-rose-300 font-medium'
                      }`}>
                        <p>{opt.explanation}</p>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Toolbar */}
          <div className="pt-3 flex items-center justify-between border-t border-slate-100">
            <span className="text-xs text-slate-400">
              {isAnswerSubmitted ? 'Diagnosis recorded. Proceed to next question.' : 'Select an option and click Submit Diagnosis.'}
            </span>

            {!isAnswerSubmitted ? (
              <button
                disabled={!selectedOptionId}
                onClick={handleSubmitAnswer}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedOptionId
                    ? 'btn-theme-primary'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Submit Diagnosis</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-xl btn-theme-primary font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>{currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'View Final Certification Score'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Completed Screen with 80% Threshold Check */
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-5">
          <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center text-3xl shadow-sm ${
            isPassed ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300' : 'bg-amber-100 text-amber-800 border-2 border-amber-300'
          }`}>
            {isPassed ? '🏆' : '📚'}
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <span className={`text-[11px] font-black uppercase px-3 py-1 rounded-full border ${
              isPassed ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              {isPassed ? '✓ Passed (≥80% Threshold Met)' : '⚠ Needs Improvement (<80%)'}
            </span>

            <h3 className="text-2xl font-black text-slate-900">
              Your Diagnostic Score: {scorePercent}%
            </h3>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              {isPassed ? (
                <span>
                  Outstanding work! You correctly answered <strong>{correctCount} of {totalQuestions} questions</strong>. You have demonstrated certified mastery of soil testing science and farmer advisory!
                </span>
              ) : (
                <span>
                  You answered <strong>{correctCount} of {totalQuestions} questions</strong> correctly ({scorePercent}%). The Arkashine National Standard requires <strong>at least 80% (4 of 5)</strong> to unlock your Soil Partner Certificate.
                </span>
              )}
            </p>
          </div>

          {/* Certificate Status Box */}
          <div className={`p-4 rounded-2xl max-w-md mx-auto border text-left text-xs space-y-2 ${
            isPassed ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-center justify-between font-bold">
              <span>Certificate Qualification:</span>
              <span className={isPassed ? 'text-emerald-700 font-extrabold' : 'text-amber-700 font-extrabold'}>
                {isPassed ? 'Eligible (Unlocked)' : 'Locked (Score < 80%)'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              {isPassed
                ? 'Your quiz passing record has been saved. Ensure all learning videos are watched to generate your official signed certificate.'
                : 'Review the video lessons and why soil testing matters, then retake the quiz to qualify.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestartQuiz}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>

            {isPassed && onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('certificate')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl btn-theme-primary font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Go to Soil Partner Certificate</span>
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
