import React, { useState } from 'react';
import { Volume2, VolumeX, ChevronDown, ChevronUp, Droplets, Sun, Sprout } from 'lucide-react';
import { studentSpeech } from '../../../utils/studentSpeech';

interface SoilDiagramsProps {
  language: 'en' | 'hi';
  onStartModules?: () => void;
}

export const SoilDiagrams: React.FC<SoilDiagramsProps> = ({ language, onStartModules }) => {
  // Active Interactive Layers
  const [selectedHorizon, setSelectedHorizon] = useState<'O_A' | 'B' | 'C_R'>('O_A');
  const [plantStage, setPlantStage] = useState<number>(3); // 1: Seed, 2: Germinate, 3: Sprout, 4: Tree
  const [phValue, setPhValue] = useState<number>(6.8);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [activeSpeechCard, setActiveSpeechCard] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCard(prev => (prev === id ? null : id));
  };

  const handleReadAloud = (cardId: string, text: string) => {
    if (activeSpeechCard === cardId && studentSpeech.isSpeaking()) {
      studentSpeech.stop();
      setActiveSpeechCard(null);
    } else {
      setActiveSpeechCard(cardId);
      studentSpeech.speak(text, language);
      const interval = setInterval(() => {
        if (!studentSpeech.isSpeaking()) {
          setActiveSpeechCard(null);
          clearInterval(interval);
        }
      }, 500);
    }
  };

  // Plant Stages text
  const plantStageData = [
    {
      stage: 1,
      name: language === 'hi' ? '1. नन्हा बीज 🌰' : '1. Sleeping Seed 🌰',
      desc: language === 'hi' ? 'बीज मिट्टी में सोता है और पानी व गर्माहट का इंतज़ार करता है।' : 'The seed rests cozy in the dark, moist soil, soaking in morning water.',
      sun: 'Mild Sun ⛅',
      water: 'Thirsty 💧'
    },
    {
      stage: 2,
      name: language === 'hi' ? '2. पहली जड़ें 🪱' : '2. Root Sprout 🪱',
      desc: language === 'hi' ? 'नन्ही जड़ें नीचे गहराई में जाती हैं ताकि भोजन और पानी पी सकें।' : 'Tiny roots shoot straight down to anchor firmly and sip soil minerals.',
      sun: 'Warm Sun ☀️',
      water: 'Drinking 💧💧'
    },
    {
      stage: 3,
      name: language === 'hi' ? '3. हरा अंकुर 🌱' : '3. Baby Sprout 🌱',
      desc: language === 'hi' ? 'दो नन्ही पत्तियां धूप की ओर खिलती हैं और भोजन बनाती हैं!' : 'Green leaves burst upward into the sky, making yummy food from sunshine!',
      sun: 'Bright Sun ☀️☀️',
      water: 'Healthy 💧💧'
    },
    {
      stage: 4,
      name: language === 'hi' ? '4. विशाल वृक्ष 🌳' : '4. Mighty Green Tree 🌳',
      desc: language === 'hi' ? 'मजबूत तना, मीठे फल और गहरी जड़ें मिट्टी को कभी बहने नहीं देतीं!' : 'Deep taproots anchor the earth, birds nest, and living soil feeds sweet fruit!',
      sun: 'Full Sun ☀️☀️☀️',
      water: 'Abundant 💧💧💧'
    }
  ];

  // pH Feedback
  const getPhCategory = (val: number) => {
    if (val < 6.0) {
      return {
        label: language === 'hi' ? 'खट्टी (अम्लीय) मिट्टी 🍋' : 'Acidic Soil 🍋',
        color: 'text-amber-700 bg-amber-100 border-amber-300',
        tip: language === 'hi' ? 'चाय और अनानास को पसंद है! अगर ज्यादा खट्टी हो तो कृषि चूना (Lime) मिलाएं।' : 'Tea & Pineapples love it! Add agricultural lime if crops feel too sour.'
      };
    }
    if (val > 7.5) {
      return {
        label: language === 'hi' ? 'क्षारीय (खारी) मिट्टी 🧼' : 'Alkaline Soil 🧼',
        color: 'text-sky-800 bg-sky-100 border-sky-300',
        tip: language === 'hi' ? 'कपास और सरसों उग सकती है! जिप्सम और गोबर की खाद से सुधार करें।' : 'Cotton & Mustard grow well! Add gypsum and cow dung compost to balance.'
      };
    }
    return {
      label: language === 'hi' ? 'सर्वोत्तम संतुलित मिट्टी 🌿' : 'Sweet Spot Healthy Soil 🌿',
      color: 'text-emerald-800 bg-emerald-100 border-emerald-300',
      tip: language === 'hi' ? 'सुपर उपजाऊ! गेहूं, धान, मक्का और सब्जियां भरपूर फलती हैं!' : 'Super fertile sweet spot! Wheat, paddy, sugarcane, and veggies thrive happily!'
    };
  };

  const phCat = getPhCategory(phValue);

  return (
    <div className="space-y-6">
      
      {/* Visual Subtitle Banner */}
      <div className="bg-gradient-to-r from-sky-100 via-emerald-100 to-amber-100 rounded-3xl p-5 sm:p-6 border-2 border-emerald-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-700 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-1.5 shadow-2xs">
            {language === 'hi' ? 'इंटरैक्टिव विज्ञान लैब 🔬' : 'Interactive Science Lab 🔬'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {language === 'hi' ? 'रहस्यमयी मिट्टी और जादुई पौधे! 🌿' : 'Secrets of Living Soil & Mighty Plants! 🌿'}
          </h2>
          <p className="text-sm text-slate-700 font-medium mt-1">
            {language === 'hi' 
              ? 'स्लाइडर हिलाएं, परतों को छुएं और देखें कि मिट्टी कैसे हमारे पूरे ग्रह को जीवन देती है!' 
              : 'Move the sliders, tap the soil layers, and discover how healthy earth feeds our whole world!'}
          </p>
        </div>

        {onStartModules && (
          <button
            type="button"
            onClick={onStartModules}
            className="px-5 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap min-h-[48px]"
          >
            {language === 'hi' ? 'पाठ और क्विज़ खेलें 🎮 →' : 'Play Lessons & Quizzes 🎮 →'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Interactive Soil Layers Horizon Cross-Section */}
        <div className="bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-6 border-2 border-emerald-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                {language === 'hi' ? 'धरती की परतें 🌍' : 'Earth Layers 🌍'}
              </span>
              <button
                type="button"
                onClick={() => handleReadAloud('soil_layers', 
                  language === 'hi'
                    ? 'धरती की परतें। ऊपर की टॉपसॉइल सबसे उपजाऊ होती है जहां केंचुए और खाद पौधों को भोजन देते हैं।'
                    : 'Soil Layers. The topsoil is the richest layer where earthworms and organic compost feed plant roots.'
                )}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                aria-label="Read soil layers aloud"
              >
                {activeSpeechCard === 'soil_layers' ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
                <span className="text-xs">{activeSpeechCard === 'soil_layers' ? 'Stop' : 'Listen'}</span>
              </button>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
              {language === 'hi' ? 'जमीन के अंदर क्या छिपा है? 🕳️' : 'What Lies Beneath Your Feet? 🕳️'}
            </h3>
            <p className="text-sm text-slate-600 font-medium mb-4">
              {language === 'hi' ? 'परत पर टैप करके उसके जादुई रहस्य जानें:' : 'Tap each layer to inspect its underground superpower:'}
            </p>

            {/* Interactive SVG Diagram for Soil Horizons */}
            <div className="rounded-2xl border-2 border-amber-900/20 bg-amber-50/50 p-3 mb-4 space-y-2">
              
              {/* Topsoil Layer O & A */}
              <button
                type="button"
                onClick={() => setSelectedHorizon('O_A')}
                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedHorizon === 'O_A'
                    ? 'bg-amber-950 text-amber-50 border-emerald-500 shadow-md scale-[1.01]'
                    : 'bg-amber-900/80 text-amber-100 border-transparent hover:bg-amber-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🌱🪱</span>
                  <div>
                    <span className="font-black text-sm block">
                      {language === 'hi' ? 'ऊपरी उपजाऊ परत (Topsoil - O & A)' : 'Topsoil Layer (Horizons O & A)'}
                    </span>
                    <span className="text-xs text-amber-200 font-medium">
                      0 - 15 cm • {language === 'hi' ? 'खाद, पत्तियां और केंचुए' : 'Compost, Leaf Litter & Microbes'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-extrabold bg-emerald-500 text-white px-2.5 py-1 rounded-full">
                  {selectedHorizon === 'O_A' ? 'Selected' : 'View'}
                </span>
              </button>

              {/* Subsoil Layer B */}
              <button
                type="button"
                onClick={() => setSelectedHorizon('B')}
                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedHorizon === 'B'
                    ? 'bg-amber-700 text-white border-emerald-500 shadow-md scale-[1.01]'
                    : 'bg-amber-600/70 text-amber-100 border-transparent hover:bg-amber-600'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🪨💧</span>
                  <div>
                    <span className="font-black text-sm block">
                      {language === 'hi' ? 'उप-मृदा परत (Subsoil - B Horizon)' : 'Subsoil Layer (Horizon B)'}
                    </span>
                    <span className="text-xs text-amber-100 font-medium">
                      15 - 60 cm • {language === 'hi' ? 'चिकनी मिट्टी और खनिज भंडार' : 'Dense Clay, Iron & Deep Water'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-extrabold bg-emerald-500 text-white px-2.5 py-1 rounded-full">
                  {selectedHorizon === 'B' ? 'Selected' : 'View'}
                </span>
              </button>

              {/* Bedrock Layer C & R */}
              <button
                type="button"
                onClick={() => setSelectedHorizon('C_R')}
                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedHorizon === 'C_R'
                    ? 'bg-slate-700 text-white border-emerald-500 shadow-md scale-[1.01]'
                    : 'bg-slate-500/70 text-slate-100 border-transparent hover:bg-slate-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">⛰️⛏️</span>
                  <div>
                    <span className="font-black text-sm block">
                      {language === 'hi' ? 'कठोर चट्टानी नींव (Bedrock - C & R)' : 'Bedrock Foundation (Horizons C & R)'}
                    </span>
                    <span className="text-xs text-slate-200 font-medium">
                      60+ cm • {language === 'hi' ? 'मौसम से टूटी विशाल चट्टानें' : 'Weathered Parent Rock Foundation'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-extrabold bg-emerald-500 text-white px-2.5 py-1 rounded-full">
                  {selectedHorizon === 'C_R' ? 'Selected' : 'View'}
                </span>
              </button>
            </div>

            {/* Selected Horizon Detail Card */}
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-sm">
              {selectedHorizon === 'O_A' && (
                <div className="space-y-1">
                  <span className="font-black text-emerald-950 flex items-center gap-1.5">
                    🌟 {language === 'hi' ? 'टॉपसॉइल का महा-चमत्कार:' : 'Topsoil Superpower:'}
                  </span>
                  <p className="text-slate-700 font-medium">
                    {language === 'hi'
                      ? 'यहीं से पौधे अपनी 90% भूख मिटाते हैं! केंचुए इसमें सुरंगें बनाकर हवा पहुंचाते हैं। यह काली और भुरभुरी होती है।'
                      : 'This is where 90% of plant nutrition lives! Microbes decompose fallen leaves into dark humus, making it soft and fertile.'}
                  </p>
                </div>
              )}
              {selectedHorizon === 'B' && (
                <div className="space-y-1">
                  <span className="font-black text-amber-950 flex items-center gap-1.5">
                    💧 {language === 'hi' ? 'सबसॉइल का महा-चमत्कार:' : 'Subsoil Superpower:'}
                  </span>
                  <p className="text-slate-700 font-medium">
                    {language === 'hi'
                      ? 'गर्मी के दिनों में जब ऊपर की मिट्टी सूखती है, तब बड़े पेड़ों की गहरी जड़ें सबसॉइल से ठंडा पानी सोखती हैं!'
                      : 'When the summer sun bakes the topsoil, deep tree taproots reach into this clay layer to drink stored reservoir water!'}
                  </p>
                </div>
              )}
              {selectedHorizon === 'C_R' && (
                <div className="space-y-1">
                  <span className="font-black text-slate-900 flex items-center gap-1.5">
                    ⛰️ {language === 'hi' ? 'बेडरॉक का महा-चमत्कार:' : 'Bedrock Superpower:'}
                  </span>
                  <p className="text-slate-700 font-medium">
                    {language === 'hi'
                      ? 'लाखों सालों में यह मजबूत चट्टान धीरे-धीरे टूटकर नई मिट्टी बनाती है। यह धरती का अटूट आधार है!'
                      : 'Over thousands of years, rain and frost crack this solid rock into tiny sand and silt grains to birth brand-new soil!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Interactive Seed Growth Cycle */}
        <div className="bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-6 border-2 border-emerald-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                {language === 'hi' ? 'जीवन का चक्र 🌿' : 'Life Cycle 🌿'}
              </span>
              <button
                type="button"
                onClick={() => handleReadAloud('growth_cycle', 
                  language === 'hi'
                    ? 'बीज से विशाल वृक्ष तक। धूप, पानी और स्वस्थ मिट्टी मिलकर एक छोटे से बीज को फलदार पेड़ बना देते हैं।'
                    : 'From seed to giant tree. Sunshine, water, and living soil turn a humble seed into a fruiting canopy.'
                )}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                aria-label="Read seed growth cycle aloud"
              >
                {activeSpeechCard === 'growth_cycle' ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
                <span className="text-xs">{activeSpeechCard === 'growth_cycle' ? 'Stop' : 'Listen'}</span>
              </button>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
              {language === 'hi' ? 'बीज कैसे बनता है पेड़? 🌱' : 'How a Seed Becomes a Mighty Tree? 🌱'}
            </h3>
            <p className="text-sm text-slate-600 font-medium mb-4">
              {language === 'hi' ? 'चरण 1 से 4 पर क्लिक करके पौधे की वृद्धि देखें:' : 'Click each step to watch the seed sprout into life:'}
            </p>

            {/* Stepper Buttons 1, 2, 3, 4 */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {plantStageData.map((st) => (
                <button
                  key={st.stage}
                  type="button"
                  onClick={() => setPlantStage(st.stage)}
                  className={`py-3 px-2 rounded-2xl font-black text-xs transition-all cursor-pointer flex flex-col items-center gap-1 min-h-[54px] ${
                    plantStage === st.stage
                      ? 'bg-emerald-700 text-white shadow-md scale-105'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <span className="text-base">
                    {st.stage === 1 ? '🌰' : (st.stage === 2 ? '🪱' : (st.stage === 3 ? '🌱' : '🌳'))}
                  </span>
                  <span>Stage {st.stage}</span>
                </button>
              ))}
            </div>

            {/* Plant Growth Visual Display */}
            <div className="p-5 rounded-3xl bg-gradient-to-b from-sky-50 via-emerald-50 to-amber-100 border-2 border-emerald-200 text-center relative overflow-hidden">
              <div className="flex items-center justify-center gap-6 mb-3">
                <span className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                  <Sun className="w-4 h-4 text-amber-500" /> {plantStageData[plantStage - 1].sun}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-300">
                  <Droplets className="w-4 h-4 text-sky-500" /> {plantStageData[plantStage - 1].water}
                </span>
              </div>

              {/* Big Plant Stage Illustration */}
              <div className="w-28 h-28 mx-auto my-2 flex items-center justify-center rounded-full bg-white shadow-inner border-4 border-emerald-300 text-6xl animate-bounce">
                {plantStage === 1 && '🌰'}
                {plantStage === 2 && '🌱'}
                {plantStage === 3 && '🪴'}
                {plantStage === 4 && '🌳'}
              </div>

              <h4 className="font-black text-lg text-slate-900 mt-2">
                {plantStageData[plantStage - 1].name}
              </h4>
              <p className="text-sm text-slate-700 font-medium mt-1 leading-relaxed max-w-sm mx-auto">
                {plantStageData[plantStage - 1].desc}
              </p>
            </div>
          </div>
        </div>

        {/* 3. N-P-K Nutrients Superhero Trio */}
        <div className="bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-6 border-2 border-emerald-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-300">
                {language === 'hi' ? 'सुपर न्यूट्रिएंट्स 🧪' : 'Super Nutrients 🧪'}
              </span>
              <button
                type="button"
                onClick={() => handleReadAloud('npk_tri', 
                  language === 'hi'
                    ? 'नाइट्रोजन, फॉस्फोरस और पोटाश। ये पौधों के 3 सुपरहीरो हैं जो पत्तियां, जड़ें और रोग-प्रतिरोधक क्षमता बढ़ाते हैं।'
                    : 'Nitrogen, Phosphorus, and Potassium. The three superhero nutrients that power green leaves, strong roots, and plant immunity.'
                )}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                aria-label="Read NPK nutrients aloud"
              >
                {activeSpeechCard === 'npk_tri' ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
                <span className="text-xs">{activeSpeechCard === 'npk_tri' ? 'Stop' : 'Listen'}</span>
              </button>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
              {language === 'hi' ? 'N-P-K: पौधों के 3 सुपरहीरो 🦸‍♂️' : 'N-P-K: The 3 Superhero Nutrients 🦸‍♂️'}
            </h3>
            <p className="text-sm text-slate-600 font-medium mb-4">
              {language === 'hi' ? 'हर पोषक तत्व पौधे को एक अनोखी जादुई ताकत देता है:' : 'Every nutrient gives the crop a special biological power:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* N - Nitrogen */}
              <div className="p-4 rounded-3xl bg-emerald-50 border-2 border-emerald-300 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center shadow-xs mb-2">
                  N
                </div>
                <h5 className="font-black text-sm text-emerald-950">
                  {language === 'hi' ? 'नाइट्रोजन (N)' : 'Nitrogen (N)'}
                </h5>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide mt-0.5">
                  {language === 'hi' ? 'हरी पत्तियां 🍃' : 'Lush Leaves 🍃'}
                </span>
                <p className="text-xs text-slate-600 font-medium mt-1.5">
                  {language === 'hi' ? 'पौधे को गहरा हरा और लंबा बनाता है।' : 'Helps plants build dark green chlorophyll.'}
                </p>
              </div>

              {/* P - Phosphorus */}
              <div className="p-4 rounded-3xl bg-purple-50 border-2 border-purple-300 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white font-black text-xl flex items-center justify-center shadow-xs mb-2">
                  P
                </div>
                <h5 className="font-black text-sm text-purple-950">
                  {language === 'hi' ? 'फॉस्फोरस (P)' : 'Phosphorus (P)'}
                </h5>
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wide mt-0.5">
                  {language === 'hi' ? 'गहरी जड़ें 🌸' : 'Deep Roots 🌸'}
                </span>
                <p className="text-xs text-slate-600 font-medium mt-1.5">
                  {language === 'hi' ? 'मजबूत जड़ें और सुंदर फूल खिलाता है।' : 'Pushes roots deep and opens vibrant blooms.'}
                </p>
              </div>

              {/* K - Potassium */}
              <div className="p-4 rounded-3xl bg-amber-50 border-2 border-amber-300 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-black text-xl flex items-center justify-center shadow-xs mb-2">
                  K
                </div>
                <h5 className="font-black text-sm text-amber-950">
                  {language === 'hi' ? 'पोटाश (K)' : 'Potassium (K)'}
                </h5>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide mt-0.5">
                  {language === 'hi' ? 'सुरक्षा ढाल 🛡️' : 'Shield & Sweet 🛡️'}
                </span>
                <p className="text-xs text-slate-600 font-medium mt-1.5">
                  {language === 'hi' ? 'बीमारियों से रक्षा और तनों को मजबूती!' : 'Protects against bugs and sweetens grain!'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Rainbow pH Scale Explorer */}
        <div className="bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-6 border-2 border-emerald-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full border border-rose-300">
                {language === 'hi' ? 'इंद्रधनुषी pH पैमाना 🌈' : 'Rainbow pH Scale 🌈'}
              </span>
              <button
                type="button"
                onClick={() => handleReadAloud('ph_scale', 
                  language === 'hi'
                    ? `पीएच मान ${phValue.toFixed(1)}। ${phCat.label}। ${phCat.tip}`
                    : `pH value ${phValue.toFixed(1)}. ${phCat.label}. ${phCat.tip}`
                )}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
                aria-label="Read pH scale aloud"
              >
                {activeSpeechCard === 'ph_scale' ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
                <span className="text-xs">{activeSpeechCard === 'ph_scale' ? 'Stop' : 'Listen'}</span>
              </button>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-1">
              {language === 'hi' ? 'मिट्टी का स्वाद: खट्टी या मीठी? 🍋' : 'Soil Taste: Sour, Sweet or Bitter? 🍋'}
            </h3>
            <p className="text-sm text-slate-600 font-medium mb-3">
              {language === 'hi' ? 'स्लाइडर को खींचकर मिट्टी का pH बदलें और देखें क्या होता है:' : 'Drag the slider to test acidic, neutral and alkaline soils:'}
            </p>

            {/* pH Rainbow Slider */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-rose-600">1.0 (Acidic 🍋)</span>
                <span className="text-emerald-700 text-base font-black px-3 py-0.5 rounded-full bg-white shadow-xs border">
                  pH {phValue.toFixed(1)}
                </span>
                <span className="text-purple-600">14.0 (Alkaline 🧼)</span>
              </div>

              {/* Slider Input */}
              <input
                type="range"
                min="4.0"
                max="9.5"
                step="0.1"
                value={phValue}
                onChange={(e) => setPhValue(parseFloat(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-400 via-teal-400 to-indigo-600"
                aria-label="Adjust pH slider"
              />

              {/* Dynamic Feedback pill */}
              <div className={`p-3 rounded-xl border text-xs font-bold ${phCat.color} flex items-center justify-between`}>
                <span>{phCat.label}</span>
                <span className="font-extrabold">{phValue >= 6.5 && phValue <= 7.5 ? '⭐ Perfect ⭐' : 'Needs Care'}</span>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                💡 <span className="font-bold">{language === 'hi' ? 'किसान मित्र सलाह:' : 'Doctor Advice:'}</span> {phCat.tip}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Tell Me More Expander Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-200 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-6 h-6 text-emerald-700" />
            <h4 className="font-black text-base sm:text-lg text-slate-900">
              {language === 'hi' ? 'क्या आप जानते हैं? मिट्टी भी सांस लेती है! 🫁' : 'Did You Know? Healthy Soil Actually Breathes! 🫁'}
            </h4>
          </div>

          <button
            type="button"
            onClick={() => toggleExpand('breathing_soil')}
            className="px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <span>{expandedCard === 'breathing_soil' ? (language === 'hi' ? 'कम दिखाएं' : 'Show less') : (language === 'hi' ? 'और जानें 🔍' : 'Tell me more 🔍')}</span>
            {expandedCard === 'breathing_soil' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {expandedCard === 'breathing_soil' && (
          <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-700 space-y-2 leading-relaxed animate-fadeIn">
            <p>
              {language === 'hi'
                ? 'हाँ सच में! जब मिट्टी के सूक्ष्मजीव और केंचुए काम करते हैं, तो वे ऑक्सीजन लेते हैं और कार्बन डाइऑक्साइड छोड़ते हैं। जब बारिश की बूंदें गिरती हैं, तो मिट्टी में फंसी ताजा हवा बाहर निकलती है - इसी से वह प्यारी सौंधी खुशबू (Petrichor) आती है!'
                : 'Yes, really! Billions of beneficial fungi and earthworms breathe in fresh air through pore spaces. When the first monsoon raindrops kiss dry soil, trapped air bursts out with that delicious earthy scent called Petrichor!'}
            </p>
            <p className="font-bold text-emerald-800">
              {language === 'hi'
                ? 'SoiLENZ यंत्र से हम इसी जैविक शक्ति (Organic Carbon) को मापते हैं ताकि किसान भाई खुशहाल रहें!'
                : 'With the SoiLENZ scanner, young soil scientists like you measure this very Organic Carbon power to guide farmers toward sustainable prosperity!'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
