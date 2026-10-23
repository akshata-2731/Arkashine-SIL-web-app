import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Printer, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  ExternalLink,
  Check
} from 'lucide-react';
import { Student } from '../../../types';

interface CelebratoryCertificateViewProps {
  student: Student;
  language: 'en' | 'hi';
  onOpenCertModal: () => void;
}

export const CelebratoryCertificateView: React.FC<CelebratoryCertificateViewProps> = ({
  student,
  language,
  onOpenCertModal
}) => {
  const [copied, setCopied] = useState(false);
  const isCertReady = student.certificateStatus === 'Issued' || student.certificateStatus === 'Eligible';

  const handlePrint = () => {
    // Confetti celebration
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
    window.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `${student.name}'s Young Scientist Certificate`,
      text: language === 'hi'
        ? `मुझे अर्काशीन स्कूल इनोवेशन लैब से यंग साइंटिस्ट (Young Scientist) का प्रमाण पत्र प्राप्त हुआ है! 🌱🌟`
        : `I have earned the official Young Scientist Certificate from the Arkashine School Innovation Lab! 🌱🌟`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed; ignore
      }
    } else {
      // Fallback: copy share message
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-6 sm:p-7 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-100 border border-white/30">
              <Sparkles className="w-4 h-4 text-amber-300" />
              {language === 'hi' ? 'आधिकारिक उपलब्धि' : 'Official Recognition'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {language === 'hi' ? 'यंग साइंटिस्ट सम्मान प्रमाण पत्र' : 'Young Scientist Certificate'} 📜
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 max-w-xl font-medium">
              {language === 'hi'
                ? 'आपने मिट्टी परीक्षण की 72 घंटों की कठिन वैज्ञानिक ट्रेनिंग सफलतापूर्वक पूरी की है!'
                : 'You have mastered 72 hours of hands-on soil science and helped local farming communities!'}
            </p>
          </div>

          {/* Action Buttons Header */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handlePrint}
              disabled={!isCertReady}
              className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-md cursor-pointer ${
                isCertReady
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-900 ring-2 ring-amber-300'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <Printer className="w-4 h-4" />
              {language === 'hi' ? 'प्रमाण पत्र प्रिंट करें' : 'Print Certificate'}
            </button>

            <button
              onClick={handleShare}
              disabled={!isCertReady}
              className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-transform active:scale-95 shadow-md cursor-pointer ${
                isCertReady
                  ? 'bg-white/90 hover:bg-white text-emerald-900'
                  : 'bg-white/20 text-white/50 cursor-not-allowed opacity-60'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  {language === 'hi' ? 'लिंक कॉपी हो गया!' : 'Copied!'}
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  {language === 'hi' ? 'शेयर करें' : 'Share'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Certificate Frame (Printable Card) */}
      <div 
        id="printable-certificate"
        className="bg-gradient-to-br from-amber-50/50 via-white to-emerald-50/50 rounded-3xl p-6 sm:p-10 border-8 border-double border-amber-300 shadow-xl relative overflow-hidden"
      >
        {/* Decorative Corner Leaves SVG */}
        <div className="absolute top-2 left-2 text-emerald-500 opacity-30 select-none pointer-events-none">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor">
            <path d="M0,0 C20,10 40,20 60,60 C40,40 20,40 0,0 Z" />
          </svg>
        </div>
        <div className="absolute top-2 right-2 text-emerald-500 opacity-30 select-none pointer-events-none rotate-90">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor">
            <path d="M0,0 C20,10 40,20 60,60 C40,40 20,40 0,0 Z" />
          </svg>
        </div>
        <div className="absolute bottom-2 left-2 text-emerald-500 opacity-30 select-none pointer-events-none -rotate-90">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor">
            <path d="M0,0 C20,10 40,20 60,60 C40,40 20,40 0,0 Z" />
          </svg>
        </div>
        <div className="absolute bottom-2 right-2 text-emerald-500 opacity-30 select-none pointer-events-none rotate-180">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor">
            <path d="M0,0 C20,10 40,20 60,60 C40,40 20,40 0,0 Z" />
          </svg>
        </div>

        {/* Certificate Content Header */}
        <div className="text-center space-y-3 relative z-10 max-w-2xl mx-auto">
          {/* Golden Medallion */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-lg flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-amber-600">
              <Award className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs sm:text-sm font-black uppercase tracking-widest text-emerald-800">
              {language === 'hi' ? 'अर्काशीन स्कूल इनोवेशन लैब' : 'ARKASHINE SCHOOL INNOVATION LAB'}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {language === 'hi' ? 'यंग साइंटिस्ट प्रमाण पत्र' : 'CERTIFICATE OF ACHIEVEMENT'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold tracking-wide">
              {language === 'hi' ? 'राष्ट्रीय बाल मृदा विज्ञान संवर्धन कार्यक्रम' : 'National Soil Science Summer Programme (72 Hours)'}
            </p>
          </div>

          <div className="my-6">
            <span className="text-xs sm:text-sm text-slate-500 italic block mb-1">
              {language === 'hi' ? 'यह प्रमाणित किया जाता है कि' : 'This is proudly presented to'}
            </span>
            <div className="text-3xl sm:text-5xl font-black text-emerald-800 underline decoration-amber-400 decoration-wavy py-2">
              {student.name}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-600 mt-2 flex items-center justify-center gap-3">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                {student.schoolId ? `School ID: ${student.schoolId}` : 'Partner School'}
              </span>
              <span>•</span>
              <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md font-extrabold text-xs">
                Group {student.groupNumber} Lead
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-base text-slate-700 leading-relaxed font-medium max-w-xl mx-auto">
            {language === 'hi'
              ? 'इन्होंने 28-दिवसीय समर स्कूल में SoiLENZ डिजिटल मिट्टी सेंसर तकनीक, N-P-K पोषण चक्र और किसानों के साथ मिलकर मृदा स्वास्थ्य सुधार में उत्कृष्ट योगदान दिया है।'
              : 'For outstanding dedication, scientific excellence in testing soil samples using the SoiLENZ sensor, and guiding local farmers toward sustainable agriculture.'}
          </p>

          {/* Achievement Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 text-left">
            <div className="p-3 bg-white/90 rounded-2xl border border-emerald-200 shadow-2xs">
              <div className="text-[11px] font-bold text-slate-500">
                {language === 'hi' ? 'उपस्थिति' : 'Attendance'}
              </div>
              <div className="text-base sm:text-lg font-black text-emerald-700">
                {student.attendanceRate}%
              </div>
              <div className="text-[10px] text-emerald-600 font-bold">✓ {language === 'hi' ? 'सफल' : 'Passed'}</div>
            </div>

            <div className="p-3 bg-white/90 rounded-2xl border border-emerald-200 shadow-2xs">
              <div className="text-[11px] font-bold text-slate-500">
                {language === 'hi' ? 'पाठ्यक्रम' : 'Curriculum'}
              </div>
              <div className="text-base sm:text-lg font-black text-slate-800">
                {student.modulesCompleted} / 4
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">{language === 'hi' ? 'मॉड्यूल पूर्ण' : 'Modules Done'}</div>
            </div>

            <div className="p-3 bg-white/90 rounded-2xl border border-emerald-200 shadow-2xs">
              <div className="text-[11px] font-bold text-slate-500">
                {language === 'hi' ? 'मिट्टी परीक्षण' : 'Soil Tests'}
              </div>
              <div className="text-base sm:text-lg font-black text-slate-800">
                {student.soilSamplesTestedCount}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">{language === 'hi' ? 'नमूने जांचे' : 'Samples Scanned'}</div>
            </div>

            <div className="p-3 bg-white/90 rounded-2xl border border-emerald-200 shadow-2xs">
              <div className="text-[11px] font-bold text-slate-500">
                {language === 'hi' ? 'किसान मार्गदर्शन' : 'Farmers Advised'}
              </div>
              <div className="text-base sm:text-lg font-black text-slate-800">
                {student.outreachFarmersCount}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold">{language === 'hi' ? 'परिवार लाभान्वित' : 'Families Helped'}</div>
            </div>
          </div>

          {/* Signatures & Security Stamp */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <div className="h-9 flex items-end">
                <span className="font-serif italic text-lg sm:text-xl font-bold text-slate-700">Dr. A. Sharma</span>
              </div>
              <div className="text-xs font-black text-slate-800 mt-1">Programme Director</div>
              <div className="text-[10px] text-slate-500">Arkashine Innovations</div>
            </div>

            {/* Verification Seal Badge */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-600 bg-emerald-50 flex flex-col items-center justify-center p-1">
                <ShieldCheck className="w-6 h-6 text-emerald-700" />
                <span className="text-[8px] font-black uppercase text-emerald-800 tracking-tighter">VERIFIED</span>
              </div>
              <div className="text-[9px] font-mono text-slate-400 mt-1">
                {student.verifiedQrHash ? student.verifiedQrHash.slice(0, 12) : (student.certificateId || 'ARK-VERIFIED')}
              </div>
            </div>

            <div>
              <div className="h-9 flex items-end">
                <span className="font-serif italic text-lg sm:text-xl font-bold text-slate-700">Prof. K. Verma</span>
              </div>
              <div className="text-xs font-black text-slate-800 mt-1">Faculty Mentor</div>
              <div className="text-[10px] text-slate-500">Lead Soil Scientist</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Link & Detailed Modal Trigger */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {language === 'hi' ? 'आधिकारिक डिजिटल प्रमाणपत्र एवं QR सत्यापन' : 'Official Digital Certificate & QR Verification'}
            </h4>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'मुख्यालय द्वारा सत्यापित डिजिटल हस्ताक्षर और QR कोड देखने के लिए खोलें'
                : 'Inspect cryptographic verification hash and download high-resolution PDF certificate'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCertModal}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 font-bold text-xs text-slate-800 flex items-center gap-2 shadow-2xs transition-colors cursor-pointer shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
          {language === 'hi' ? 'पूरा प्रमाणपत्र देखें' : 'View Full Modal'}
        </button>
      </div>
    </div>
  );
};
