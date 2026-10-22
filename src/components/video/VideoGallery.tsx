import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  X, 
  ChevronRight, 
  Clock, 
  CheckCircle2
} from 'lucide-react';

export interface VideoExplainer {
  id: number;
  title: string;
  durationSeconds: number;
  durationLabel: string;
  poster: string;
  category: string;
  badge: string;
  summary: string;
  subtitlesEn: string[];
  subtitlesHi: string[];
  checkQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const VIDEO_EXPLAINERS: VideoExplainer[] = [
  {
    id: 1,
    title: 'Soil is Alive!',
    durationSeconds: 35,
    durationLabel: '35s',
    poster: '/assets/images/poster-soil-alive.png',
    category: 'Soil Microbiology',
    badge: 'Video 1',
    summary: 'Living ecosystem of earthworms, beneficial bacteria, and mycorrhizae.',
    subtitlesEn: [
      "Look closely beneath this green agricultural field.",
      "Soil is not just dead dirt—it is a thriving, living underground city!",
      "A single teaspoon contains billions of beneficial microbes and fungi.",
      "Earthworms burrow deep channels that bring rainwater directly to roots.",
      "Mycorrhizal fungi trade vital minerals with plant roots in exchange for carbon sugar."
    ],
    subtitlesHi: [
      "इस हरे-भरे खेत की सतह के नीचे ध्यान से देखें।",
      "मिट्टी केवल धूल नहीं है—यह एक जीवंत भूमिगत पारिस्थितिकी तंत्र है!",
      "एक चम्मच मिट्टी में अरबों सूक्ष्मजीव और कवक होते हैं।",
      "केंचुए ऐसी सुरंगें बनाते हैं जो वर्षा जल को सीधे जड़ों तक पहुंचाती हैं।"
    ],
    checkQuestion: {
      question: 'How do mycorrhizal fungi assist plant root systems?',
      options: ['They eat live root tips', 'They trade phosphorus & water for carbon sugars', 'They turn roots into hard stones', 'They dry out the soil'],
      correctIndex: 1,
      explanation: 'Mycorrhizae act as vital microscopic root extensions, exchanging essential minerals for photosynthetic sugars.'
    }
  },
  {
    id: 2,
    title: 'Why Do We Test Soil?',
    durationSeconds: 30,
    durationLabel: '30s',
    poster: '/assets/images/poster-why-test-soil.png',
    category: 'Agronomy & Yield',
    badge: 'Video 2',
    summary: 'Clinical health checkup for land: saving costs and stopping runoff.',
    subtitlesEn: [
      "What happens when a farmer applies fertilizers without testing?",
      "Excess chemical nitrogen burns tender roots and pollutes drinking water.",
      "Testing soil works just like a clinical doctor's checkup for the farm.",
      "By knowing exact N-P-K levels, farmers avoid wasteful spending and double yields!"
    ],
    subtitlesHi: [
      "जब किसान बिना जांचे रासायनिक खाद डालते हैं तो क्या होता है?",
      "अत्यधिक नाइट्रोजन नाजुक जड़ों को जला देती है और भूजल को दूषित करती है।",
      "मिट्टी परीक्षण बिल्कुल एक डॉक्टर की स्वास्थ्य जांच की तरह काम करता है।"
    ],
    checkQuestion: {
      question: 'What is the primary danger of applying chemical fertilizer blindly?',
      options: ['Crop roots burn and excess chemicals pollute water streams', 'Soil turns into gold', 'Seeds grow 100x faster', 'Earthworms multiply too quickly'],
      correctIndex: 0,
      explanation: 'Excess synthetic urea acidifies topsoil, damages feeder roots, and leaches nitrates into ground aquifers.'
    }
  },
  {
    id: 3,
    title: 'How to Collect a Sample',
    durationSeconds: 40,
    durationLabel: '40s',
    poster: '/assets/images/poster-how-to-collect.png',
    category: 'Field Technique',
    badge: 'Video 3',
    summary: 'Zig-zag field grid, 15cm V-shaped cut, and shade drying.',
    subtitlesEn: [
      "Step one: Walk across the field in a uniform zig-zag pattern.",
      "Stay away from fence borders, compost piles, and shaded tree canopies.",
      "Dig a clean V-shaped slice exactly 15 centimeters deep.",
      "Mix composite cores in a clean bucket and air-dry strictly under shade."
    ],
    subtitlesHi: [
      "पहला कदम: खेत में व्यवस्थित ज़िग-ज़ैग पैटर्न में आगे बढ़ें।",
      "ठीक 15 सेमी गहरा V-आकार का गड्ढा बनाएं।",
      "नमूनों को साफ बाल्टी में मिलाएं और हमेशा छाया में सुखाएं।"
    ],
    checkQuestion: {
      question: 'Why must collected soil samples be dried in the shade instead of direct sun?',
      options: ['To keep it cool for tasting', 'Direct sunlight bakes and volatilizes organic carbon & nitrogen', 'To let birds eat the soil', 'Sun turns soil into liquid'],
      correctIndex: 1,
      explanation: 'Direct sun heat oxidizes organic matter and volatilizes volatile nitrogen compounds, skewing lab accuracy.'
    }
  },
  {
    id: 4,
    title: 'How SoiLENZ Tests Soil',
    durationSeconds: 35,
    durationLabel: '35s',
    poster: '/assets/images/poster-soilenz-testing.png',
    category: 'Optical Telemetry',
    badge: 'Video 4',
    summary: 'Rapid extractant chemistry, optical sensor dip, and cloud sync.',
    subtitlesEn: [
      "Meet SoiLENZ: the handheld digital soil diagnostic scanner.",
      "Prepare a 90-second rapid extraction reagent vial with soil powder.",
      "Dip the multispectral optical sensor probe into the solution.",
      "Instantly, live telemetry displays pH, EC, Nitrogen, Phosphorus, and Potassium on screen!"
    ],
    subtitlesHi: [
      "यह है SoiLENZ: पोर्टेबल डिजिटल मृदा परीक्षण उपकरण।",
      "तैयार रासायनिक अर्क में मल्टीस्पेक्ट्रल ऑप्टिकल सेंसर डुबोएं।",
      "तत्काल स्क्रीन पर pH, EC, और N-P-K के आंकड़े प्रदर्शित होते हैं!"
    ],
    checkQuestion: {
      question: 'How fast does the SoiLENZ digital scanner analyze key soil nutrients?',
      options: ['90 seconds', '3 weeks', '48 hours', '10 days'],
      correctIndex: 0,
      explanation: 'SoiLENZ provides optical spectrometry telemetry in approximately 90 seconds compared to weeks for traditional wet chemistry.'
    }
  },
  {
    id: 5,
    title: 'Reading Your Soil Report',
    durationSeconds: 35,
    durationLabel: '35s',
    poster: '/assets/images/poster-reading-report.png',
    category: 'Diagnostic Advisory',
    badge: 'Video 5',
    summary: 'pH rainbow scale, N-P-K energy bars, and traffic-light health score.',
    subtitlesEn: [
      "Every Arkashine Soil Health Card is visual and easy to understand.",
      "The pH scale tells you whether soil is acidic, neutral, or alkaline.",
      "Three glowing energy bars show plant nutrients: Nitrogen, Phosphorus, and Potassium.",
      "A traffic-light score gives the farmer one clear, actionable organic recommendation!"
    ],
    subtitlesHi: [
      "प्रत्येक मृदा स्वास्थ्य कार्ड पढ़ने में बेहद आसान और चित्रात्मक है।",
      "pH पैमाना बताता है कि मिट्टी अम्लीय, संतुलित या क्षारीय है।",
      "तीन ऊर्जा बार मुख्य पोषक तत्व N-P-K प्रदर्शित करते हैं।"
    ],
    checkQuestion: {
      question: 'What is the optimal pH range for most agricultural crops?',
      options: ['6.5 to 7.5 (Neutral balanced)', '1.0 to 2.0 (Battery acid)', '11.0 to 14.0 (Extreme alkaline)', '0.0 only'],
      correctIndex: 0,
      explanation: 'A neutral pH between 6.5 and 7.5 maximizes nutrient availability for plant root uptake.'
    }
  },
  {
    id: 6,
    title: 'Be a Soil Partner',
    durationSeconds: 30,
    durationLabel: '30s',
    poster: '/assets/images/poster-soil-partner.png',
    category: 'Certification & Field',
    badge: 'Video 6',
    summary: 'Students test soil, guide farmers, and receive certified convocation.',
    subtitlesEn: [
      "As a certified Soil Partner, you are a champion for sustainable farming.",
      "Conduct village community drives and hand over diagnostic cards to local farmers.",
      "Complete all 72 hours of training to receive your official QR-verified Arkashine certificate!",
      "You are the future of regenerative Indian agriculture!"
    ],
    subtitlesHi: [
      "प्रमाणित सॉइल पार्टनर के रूप में आप टिकाऊ कृषि के भविष्य हैं।",
      "ग्रामीण जागरूकता शिविर आयोजित करें और किसानों को मृदा कार्ड सौंपें।",
      "72 घंटे का प्रशिक्षण पूरा करके अपना आधिकारिक प्रमाणपत्र प्राप्त करें!"
    ],
    checkQuestion: {
      question: 'How many instructional training hours are required to become a certified Soil Partner?',
      options: ['72 training hours', '2 hours', '10 minutes', '500 hours'],
      correctIndex: 0,
      explanation: 'The 4-week Arkashine School Innovation Lab entails 72 rigorous hours of theory, lab practicals, and village farmer outreach.'
    }
  }
];

export const VideoGallery: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoExplainer | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);

  const [watchedIds, setWatchedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('arkashine_watched_videos');
      return saved ? JSON.parse(saved) : [1, 2, 3];
    } catch {
      return [1, 2, 3];
    }
  });

  const markVideoWatched = (id: number) => {
    setWatchedIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem('arkashine_watched_videos', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const markAllVideosWatched = () => {
    const allIds = VIDEO_EXPLAINERS.map(v => v.id);
    setWatchedIds(allIds);
    try {
      localStorage.setItem('arkashine_watched_videos', JSON.stringify(allIds));
    } catch {}
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Open modal & start video
  const openVideo = (vid: VideoExplainer) => {
    setSelectedVideo(vid);
    setIsPlaying(true);
    setCurrentTime(0);
    setSelectedOption(null);
    setShowQuizResult(false);
    markVideoWatched(vid.id);
  };

  const closeVideo = () => {
    setIsPlaying(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSelectedVideo(null);
  };

  // Video timer tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (selectedVideo && isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= selectedVideo.durationSeconds) {
            setIsPlaying(false);
            return selectedVideo.durationSeconds;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [selectedVideo, isPlaying, playbackSpeed]);

  // Web Speech API Voiceover
  useEffect(() => {
    if (!selectedVideo || !isPlaying || isMuted) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const currentSubtitleIdx = Math.min(
        selectedVideo.subtitlesEn.length - 1,
        Math.floor((currentTime / selectedVideo.durationSeconds) * selectedVideo.subtitlesEn.length)
      );
      const textToSpeak = language === 'en' 
        ? selectedVideo.subtitlesEn[currentSubtitleIdx] 
        : selectedVideo.subtitlesHi[currentSubtitleIdx % selectedVideo.subtitlesHi.length];

      if (textToSpeak) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 1.0 * playbackSpeed;
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [currentTime, selectedVideo, isPlaying, isMuted, language, playbackSpeed]);

  // Real-time 60 FPS HTML5 Canvas Animation for each explainer
  useEffect(() => {
    if (!selectedVideo || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // Background clear
      ctx.clearRect(0, 0, w, h);

      const vidId = selectedVideo.id;

      if (vidId === 1) {
        // Scene 1: Living Soil Layers & Microbes
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, w, h);

        // Sky & Field Surface
        const groundY = h * 0.35;
        ctx.fillStyle = '#0f766e';
        ctx.fillRect(0, groundY - 20, w, 20);

        // Soil Horizon 1: Topsoil
        ctx.fillStyle = '#3f2012';
        ctx.fillRect(0, groundY, w, h * 0.35);

        // Soil Horizon 2: Subsoil
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, groundY + h * 0.35, w, h * 0.3);

        // Sprouting Plant
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(w * 0.5, groundY);
        ctx.lineTo(w * 0.5, groundY - 45);
        ctx.stroke();

        // Animated Roots drinking
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(w * 0.5, groundY);
        ctx.quadraticCurveTo(w * 0.45, groundY + 40, w * 0.35 + Math.sin(frame * 0.05) * 5, groundY + 90);
        ctx.moveTo(w * 0.5, groundY);
        ctx.quadraticCurveTo(w * 0.55, groundY + 50, w * 0.65 + Math.cos(frame * 0.05) * 5, groundY + 100);
        ctx.stroke();

        // Animated Earthworm
        const wormX = (w * 0.2 + (frame * 1.5) % (w * 0.6));
        const wormY = groundY + 60 + Math.sin(frame * 0.1) * 8;
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(wormX, wormY, 12, 0, Math.PI);
        ctx.stroke();

        // Glowing Bacteria dots
        for (let i = 0; i < 15; i++) {
          const bx = (w * 0.15 + (i * 35) + Math.sin(frame * 0.03 + i) * 10);
          const by = groundY + 30 + ((i * 17) % 80);
          ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#a855f7';
          ctx.beginPath();
          ctx.arc(bx, by, 3 + Math.sin(frame * 0.1 + i) * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (vidId === 2) {
        // Scene 2: Why Test Soil? Split comparison
        // Left: Blind Chemical vs Right: Tested Precision
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);

        // Left side: Yellow stunted
        ctx.fillStyle = '#451a03';
        ctx.fillRect(0, h * 0.4, w * 0.5, h * 0.6);
        ctx.fillStyle = '#eab308';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('❌ Blind Fertilizer (Root Burn)', 20, 30);

        // Burning Stalk
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(w * 0.25, h * 0.4);
        ctx.lineTo(w * 0.23, h * 0.2);
        ctx.stroke();

        // Right side: Tested Healthy
        ctx.fillStyle = '#064e3b';
        ctx.fillRect(w * 0.5, h * 0.4, w * 0.5, h * 0.6);
        ctx.fillStyle = '#34d399';
        ctx.fillText('✅ SoiLENZ Tested (Optimal Yield)', w * 0.5 + 20, 30);

        // Thriving stalk with leaves
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(w * 0.75, h * 0.4);
        ctx.lineTo(w * 0.75, h * 0.15);
        ctx.stroke();

        // Divider
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w * 0.5, 0);
        ctx.lineTo(w * 0.5, h);
        ctx.stroke();

      } else if (vidId === 4) {
        // Scene 4: SoiLENZ Optical Testing
        ctx.fillStyle = '#0b1329';
        ctx.fillRect(0, 0, w, h);

        // Vial Tube
        const vialX = w * 0.35;
        const vialY = h * 0.25;
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.strokeRect(vialX, vialY, 60, 110);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(vialX + 2, vialY + 40, 56, 68);

        // Sensor Dip Probe
        ctx.fillStyle = '#64748b';
        ctx.fillRect(vialX + 20, vialY - 30 + Math.sin(frame * 0.05) * 10, 20, 80);

        // Telemetry readout box
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.fillRect(w * 0.58, h * 0.2, 170, 120);
        ctx.strokeRect(w * 0.58, h * 0.2, 170, 120);

        ctx.fillStyle = '#a855f7';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('SoiLENZ TELEMETRY', w * 0.6, h * 0.28);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(`pH: ${(6.8 + Math.sin(frame * 0.05) * 0.1).toFixed(2)}`, w * 0.6, h * 0.38);
        ctx.fillStyle = '#34d399';
        ctx.fillText(`N: 284 kg/ha`, w * 0.6, h * 0.48);
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`P: 24 kg/ha`, w * 0.6, h * 0.58);
        ctx.fillStyle = '#f472b6';
        ctx.fillText(`K: 238 kg/ha`, w * 0.6, h * 0.68);

      } else {
        // Generic High-Tech Science Canvas
        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, w, h);

        // Circular wave radar
        const cx = w * 0.5;
        const cy = h * 0.5;
        for (let r = 20; r < 140; r += 25) {
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.4 - r / 350})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(cx, cy, (r + (frame * 1.5) % 25), 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(selectedVideo.title, cx, cy - 10);
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`Interactive Science Explainer • Playing at ${playbackSpeed}x`, cx, cy + 18);
        ctx.textAlign = 'start';
      }

      if (isPlaying) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [selectedVideo, isPlaying, currentTime, playbackSpeed]);

  const currentSubtitleIdx = selectedVideo 
    ? Math.min(selectedVideo.subtitlesEn.length - 1, Math.floor((currentTime / selectedVideo.durationSeconds) * selectedVideo.subtitlesEn.length))
    : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-block mb-1 bg-purple-50 text-[#5C26C0] dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            Real-Time Animated Science Explainer Player 🎬
          </span>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Learning Videos
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Click any tile to launch the 60 FPS animated explainer with voiceover narration, bilingual subtitles, and instant science checkups.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <div className="bg-purple-50 dark:bg-purple-950 px-3 py-1.5 rounded-xl border border-purple-200 dark:border-purple-800 flex items-center gap-2">
            <span className="text-xs font-bold text-[#5C26C0] dark:text-purple-300">
              Watched: {watchedIds.length} of {VIDEO_EXPLAINERS.length}
            </span>
            <div className="w-14 h-2 bg-purple-200 dark:bg-purple-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#5C26C0] rounded-full transition-all"
                style={{ width: `${(watchedIds.length / VIDEO_EXPLAINERS.length) * 100}%` }}
              />
            </div>
          </div>

          {watchedIds.length < VIDEO_EXPLAINERS.length ? (
            <button
              onClick={markAllVideosWatched}
              className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              ✓ Mark All Watched
            </button>
          ) : (
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1.5 rounded-xl flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All Watched
            </span>
          )}
        </div>
      </div>

      {/* Video Poster Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {VIDEO_EXPLAINERS.map((v) => (
          <div
            key={v.id}
            onClick={() => openVideo(v)}
            className="group rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-slate-900 shadow-xs hover:shadow-md hover:border-purple-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            {/* Poster Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
              <img
                src={v.poster}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/module-soil-testing.png';
                }}
                alt={v.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Play Badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#5C26C0] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 ml-0.5 fill-white" />
                </div>
              </div>

              {/* Meta Chips */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white border border-white/20">
                  {v.badge}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-600/80 text-white">
                  {v.category}
                </span>
                {watchedIds.includes(v.id) ? (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-600 text-white flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-3 h-3" /> Watched
                  </span>
                ) : (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 flex items-center gap-1 shadow-xs">
                    <Clock className="w-3 h-3" /> Required
                  </span>
                )}
              </div>

              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[11px] font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded-md">
                <Clock className="w-3 h-3" />
                {v.durationLabel}
              </div>
            </div>

            {/* Bottom Content */}
            <div className="p-4 bg-white dark:bg-slate-900 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-[#5C26C0] dark:group-hover:text-purple-400 transition-colors">
                  {v.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                  {v.summary}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-[#5C26C0] dark:text-purple-400 font-bold">
                <span>Play Live Explainer</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Video Player & Checkup Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[94vh]">
            
            {/* Modal Header */}
            <div className="p-4 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#5C26C0] bg-purple-100 dark:bg-purple-950 px-2.5 py-0.5 rounded-full">
                  {selectedVideo.badge} • {selectedVideo.durationLabel}
                </span>
                <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white truncate">
                  {selectedVideo.title}
                </h3>
              </div>
              <button
                onClick={closeVideo}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Canvas (Interactive 60 FPS Animation + Live Voiceover) */}
            <div className="relative aspect-video w-full bg-slate-950 flex flex-col justify-between overflow-hidden">
              
              {/* Canvas Renderer */}
              <canvas
                ref={canvasRef}
                width={640}
                height={360}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Player Top Controls */}
              <div className="relative z-10 p-3 flex items-center justify-between text-xs text-white/90 bg-gradient-to-b from-black/80 to-transparent">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 border border-white/20">
                  LIVE ANIMATED SCENE • 60 FPS
                </span>
                
                {/* Language Switch */}
                <div className="flex items-center gap-1 bg-black/60 p-0.5 rounded-xl border border-white/20">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      language === 'en' ? 'bg-[#5C26C0] text-white' : 'text-slate-300'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      language === 'hi' ? 'bg-[#5C26C0] text-white' : 'text-slate-300'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              {/* Player Bottom Controls & Subtitle Overlay */}
              <div className="relative z-10 p-4 space-y-2.5 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                
                {/* Live Subtitle Callout */}
                <div className="bg-black/80 backdrop-blur-md p-2.5 px-4 rounded-xl border border-white/20 text-center">
                  <p className="text-xs sm:text-sm font-bold text-amber-300 drop-shadow-sm leading-snug">
                    "{language === 'en' 
                      ? selectedVideo.subtitlesEn[currentSubtitleIdx] 
                      : selectedVideo.subtitlesHi[currentSubtitleIdx % selectedVideo.subtitlesHi.length]}"
                  </p>
                </div>

                {/* Progress Scrub Bar */}
                <div className="space-y-1">
                  <div 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const pct = Math.max(0, Math.min(1, clickX / rect.width));
                      setCurrentTime(Math.round(pct * selectedVideo.durationSeconds));
                    }}
                    className="w-full h-1.5 rounded-full bg-white/30 cursor-pointer overflow-hidden relative"
                  >
                    <div 
                      style={{ width: `${(currentTime / selectedVideo.durationSeconds) * 100}%` }}
                      className="h-full bg-purple-500 rounded-full"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-white/80">
                    <span>0:{String(currentTime).padStart(2, '0')}</span>
                    <span>0:{String(selectedVideo.durationSeconds).padStart(2, '0')}</span>
                  </div>
                </div>

                {/* Playback Button Toolbar */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    {/* Play/Pause */}
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                    </button>

                    {/* Restart */}
                    <button
                      onClick={() => {
                        setCurrentTime(0);
                        setIsPlaying(true);
                      }}
                      className="p-1.5 rounded-lg text-white/80 hover:bg-white/10"
                      title="Replay from start"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    {/* Audio Mute/Unmute */}
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 rounded-lg text-white/80 hover:bg-white/10"
                      title={isMuted ? 'Unmute voiceover' : 'Mute voiceover'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>

                  {/* Speed Toggle */}
                  <div className="flex items-center gap-1 text-[10px] font-bold bg-white/10 p-1 rounded-xl">
                    {[0.75, 1, 1.25, 1.5].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-1.5 py-0.5 rounded ${playbackSpeed === spd ? 'bg-purple-600 text-white' : 'text-slate-300'}`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Post-Video Mini Quiz Checkup */}
            <div className="p-5 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-800/50 flex-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#5C26C0] dark:text-purple-400" />
                <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-800 dark:text-white">
                  Instant Science Checkup Question:
                </h4>
              </div>

              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {selectedVideo.checkQuestion.question}
              </p>

              <div className="space-y-2 pt-1">
                {selectedVideo.checkQuestion.options.map((opt, idx) => {
                  const isChosen = selectedOption === idx;
                  const isCorrect = idx === selectedVideo.checkQuestion.correctIndex;
                  let optStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200';

                  if (showQuizResult) {
                    if (isCorrect) {
                      optStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-950 dark:text-emerald-200 font-bold';
                    } else if (isChosen) {
                      optStyle = 'border-rose-400 bg-rose-50 dark:bg-rose-950 text-rose-950 dark:text-rose-200';
                    } else {
                      optStyle = 'opacity-40 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800';
                    }
                  } else if (isChosen) {
                    optStyle = 'border-[#5C26C0] bg-purple-50 dark:bg-purple-950 text-purple-950 dark:text-purple-200 font-bold ring-1 ring-[#5C26C0]';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={showQuizResult}
                      onClick={() => setSelectedOption(idx)}
                      className={`w-full p-2.5 px-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                    >
                      <span>{opt}</span>
                      {showQuizResult && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {showQuizResult && (
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs text-purple-950 dark:text-purple-200 font-medium animate-in fade-in">
                  <strong>Scientific Fact:</strong> {selectedVideo.checkQuestion.explanation}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-2">
                {!showQuizResult ? (
                  <button
                    disabled={selectedOption === null}
                    onClick={() => setShowQuizResult(true)}
                    className="px-4 py-2 rounded-xl bg-[#5C26C0] hover:bg-purple-700 text-white text-xs font-bold disabled:opacity-40 shadow-xs cursor-pointer"
                  >
                    Check My Answer
                  </button>
                ) : (
                  <button
                    onClick={closeVideo}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Done & Continue Lesson →
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
