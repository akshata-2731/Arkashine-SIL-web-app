export type Language = 'en' | 'hi';

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: Translations = {
  // App Header & Branding
  'app.title': {
    en: 'Arkashine School Innovation Lab',
    hi: 'अर्काशीन स्कूल इनोवेशन लैब'
  },
  'app.subtitle': {
    en: '72-Hour Soil Science Summer Programme',
    hi: '72-घंटे का मृदा विज्ञान ग्रीष्मकालीन कार्यक्रम'
  },
  'role.scope': {
    en: 'Role Scope',
    hi: 'भूमिका दायरा'
  },
  'role.arkashine': {
    en: 'Arkashine HQ',
    hi: 'अर्काशीन मुख्यालय'
  },
  'role.partner': {
    en: 'Enabling Partner',
    hi: 'सहयोगी पार्टनर'
  },
  'role.principal': {
    en: 'School Principal',
    hi: 'विद्यालय प्रधानाचार्य'
  },
  'role.faculty': {
    en: 'Faculty Coordinator',
    hi: 'शिक्षक समन्वयक'
  },
  'role.student': {
    en: 'Student Portal',
    hi: 'छात्र पोर्टल'
  },

  // Navigation Items
  'nav.overview': {
    en: 'Overview',
    hi: 'सिंहावलोकन'
  },
  'nav.schools': {
    en: 'Schools & Partners',
    hi: 'विद्यालय और सहयोगी'
  },
  'nav.partner_schools': {
    en: 'My Schools & Lab Setup',
    hi: 'मेरे विद्यालय और प्रयोगशाला'
  },
  'nav.selection': {
    en: 'Student Selection',
    hi: 'छात्र चयन'
  },
  'nav.heatmap': {
    en: 'Program Heat Map',
    hi: 'कार्यक्रम प्रगति हीट मैप'
  },
  'nav.partner_heatmap': {
    en: 'Daily Updates & Heat Map',
    hi: 'दैनिक प्रगति और हीट मैप'
  },
  'nav.esg': {
    en: 'Impact & ESG',
    hi: 'प्रभाव और ईएसजी'
  },
  'nav.certificates': {
    en: 'Certificates',
    hi: 'प्रमाण पत्र'
  },
  'nav.settings': {
    en: 'Reports & Settings',
    hi: 'रिपोर्ट और सेटिंग्स'
  },
  'nav.outreach': {
    en: 'Outreach & Support',
    hi: 'आउटरीच और सहयोग'
  },
  'nav.principal_overview': {
    en: 'My School',
    hi: 'मेरा विद्यालय'
  },
  'nav.logs': {
    en: 'Daily Log & Remarks',
    hi: 'दैनिक लॉग और टिप्पणियाँ'
  },
  'nav.principal_students': {
    en: 'Students & Risk',
    hi: 'छात्र और उपस्थिति'
  },
  'nav.today': {
    en: "Today's Update",
    hi: 'आज का अपडेट'
  },
  'nav.faculty_students': {
    en: 'Students & Attendance',
    hi: 'छात्र और उपस्थिति'
  },
  'nav.soillab': {
    en: 'Soil Lab (SoiLENZ)',
    hi: 'मृदा प्रयोगशाला (SoiLENZ)'
  },
  'nav.faculty_outreach': {
    en: 'Outreach & Campaigns',
    hi: 'आउटरीच और अभियान'
  },
  'nav.student_journey': {
    en: 'My Soil Journey',
    hi: 'मेरी मृदा यात्रा'
  },
  'nav.student_modules': {
    en: 'Modules & Quizzes',
    hi: 'मॉड्यूल और क्विज़'
  },
  'nav.student_videos': {
    en: 'Animated Video Lessons',
    hi: 'एनिमेटेड वीडियो पाठ'
  },
  'nav.videos': {
    en: 'Learning Videos',
    hi: 'शिक्षण वीडियो'
  },
  'nav.student_diagrams': {
    en: 'Soil Explorer & Diagrams',
    hi: 'मृदा अन्वेषक व आरेख'
  },
  'nav.student_badges': {
    en: 'Badges & Rewards',
    hi: 'बैज और पुरस्कार'
  },
  'nav.student_cert': {
    en: 'Young Scientist Certificate',
    hi: 'यंग साइंटिस्ट प्रमाण पत्र'
  },

  // Faculty Daily Log Form
  'log.title': {
    en: 'Faculty Daily Submission Log',
    hi: 'दैनिक शिक्षण एवं प्रयोगशाला लॉग'
  },
  'log.subtitle': {
    en: 'Day progress, curriculum delivery, student attendance & lab tracking',
    hi: 'दैनिक प्रगति, पाठ्यक्रम वितरण, छात्र उपस्थिति और मृदा परीक्षण'
  },
  'log.saved_draft': {
    en: 'Draft saved to local storage',
    hi: 'ड्राफ्ट स्थानीय रूप से सहेजा गया'
  },
  'log.day': {
    en: 'Day',
    hi: 'दिन'
  },
  'log.date': {
    en: 'Date',
    hi: 'दिनांक'
  },
  'log.curriculum_module': {
    en: 'Curriculum Module',
    hi: 'पाठ्यक्रम मॉड्यूल'
  },
  'log.session_type': {
    en: 'Session Delivery Format',
    hi: 'सत्र का प्रारूप'
  },
  'log.theory_only': {
    en: 'Classroom Theory Only',
    hi: 'केवल कक्षा सिद्धांत'
  },
  'log.lab_only': {
    en: 'Lab Practical (SoiLENZ)',
    hi: 'प्रयोगशाला प्रैक्टिकल (SoiLENZ)'
  },
  'log.combined': {
    en: 'Theory + Lab Hands-on',
    hi: 'सिद्धांत + लैब अभ्यास'
  },
  'log.outreach_format': {
    en: 'Field Farmer Outreach',
    hi: 'खेत में किसान आउटरीच'
  },
  'log.classroom_hours': {
    en: 'Classroom Hours',
    hi: 'कक्षा के घंटे'
  },
  'log.lab_hours': {
    en: 'Lab Practical Hours',
    hi: 'प्रयोगशाला के घंटे'
  },
  'log.attendance_title': {
    en: 'Student Attendance Tracking',
    hi: 'छात्र उपस्थिति ट्रैकिंग'
  },
  'log.present_count': {
    en: 'Present Students',
    hi: 'उपस्थित छात्र'
  },
  'log.enrolled_count': {
    en: 'Enrolled Students',
    hi: 'कुल नामांकित छात्र'
  },
  'log.mark_all_present': {
    en: 'Mark All Present',
    hi: 'सभी को उपस्थित चिह्नित करें'
  },
  'log.mark_all_absent': {
    en: 'Clear Attendance',
    hi: 'उपस्थिति साफ़ करें'
  },
  'log.samples_tested': {
    en: 'Soil Samples Tested Today',
    hi: 'आज परीक्षित मृदा नमूने'
  },
  'log.farmers_reached': {
    en: 'Farmers Reached / Advised',
    hi: 'परामर्श प्राप्त किसान'
  },
  'log.stock_used': {
    en: 'Reagents / Consumables Used',
    hi: 'प्रयुक्त अभिकर्मक / सामग्री'
  },
  'log.stock_placeholder': {
    en: 'e.g., 12 SoiLENZ test strips, 200ml reagent A...',
    hi: 'उदा. 12 SoiLENZ परीक्षण स्ट्रिप्स, 200ml अभिकर्मक...'
  },
  'log.incident_notes': {
    en: 'Incidents / Operational Notes',
    hi: 'घटनाएँ / विशेष परिचालन टिप्पणियाँ'
  },
  'log.incident_placeholder': {
    en: 'e.g., Power cut between 11:30-12:15, or student query on soil NPK...',
    hi: 'उदा. 11:30 से 12:15 तक बिजली कटौती, या मृदा NPK पर छात्रों के प्रश्न...'
  },
  'log.submit_btn': {
    en: 'Submit Daily Log',
    hi: 'दैनिक लॉग जमा करें'
  },
  'log.save_draft_btn': {
    en: 'Save Draft',
    hi: 'ड्राफ्ट सहेजें'
  },
  'log.submitted_badge': {
    en: 'Log Submitted for Today',
    hi: 'आज का लॉग सफलतापूर्वक जमा हुआ'
  },

  // Common Actions & Buttons
  'action.save': {
    en: 'Save',
    hi: 'सहेजें'
  },
  'action.cancel': {
    en: 'Cancel',
    hi: 'रद्द करें'
  },
  'action.submit': {
    en: 'Submit',
    hi: 'जमा करें'
  },
  'action.delete': {
    en: 'Delete',
    hi: 'हटाएं'
  },
  'action.edit': {
    en: 'Edit',
    hi: 'संपादित करें'
  },
  'action.close': {
    en: 'Close',
    hi: 'बंद करें'
  },
  'action.reset': {
    en: 'Reset Demo Data',
    hi: 'डेमो डेटा रीसेट करें'
  },
  'action.search': {
    en: 'Search',
    hi: 'खोजें'
  },
  'action.filter': {
    en: 'Filter',
    hi: 'फ़िल्टर'
  },
  'action.export': {
    en: 'Export',
    hi: 'निर्यात'
  },
  'action.print': {
    en: 'Print',
    hi: 'प्रिंट करें'
  },
  'action.verify': {
    en: 'Verify',
    hi: 'सत्यापित करें'
  },
  'action.view': {
    en: 'View Details',
    hi: 'विवरण देखें'
  },
  'action.issue_certificate': {
    en: 'Issue Certificate',
    hi: 'प्रमाण पत्र जारी करें'
  },

  // Statuses
  'status.on_time': {
    en: 'On Time',
    hi: 'समय पर'
  },
  'status.late': {
    en: 'Late',
    hi: 'विलंबित'
  },
  'status.partial': {
    en: 'Partial',
    hi: 'आंशिक'
  },
  'status.running': {
    en: 'Running',
    hi: 'प्रगति पर'
  },
  'status.completed': {
    en: 'Completed',
    hi: 'पूर्ण'
  },
  'status.eligible': {
    en: 'Eligible',
    hi: 'योग्य'
  },
  'status.issued': {
    en: 'Issued',
    hi: 'जारी'
  },

  // Student Portal Specific Translations
  'student.welcome': {
    en: 'Welcome, Soil Champion',
    hi: 'स्वागत है, मृदा चैंपियन'
  },
  'student.subtext': {
    en: 'Collect soil, run quick tests with SoiLENZ, and help our village farmers grow bumper crops!',
    hi: 'मिट्टी एकत्र करें, SoiLENZ से तुरंत जांचें और गांव के किसानों को भरपूर फसल उगाने में मदद करें!'
  },
  'student.tab_journey': {
    en: '🌱 Soil Trail',
    hi: '🌱 मिट्टी का सफर'
  },
  'student.tab_diagrams': {
    en: '🔬 Soil Wonders',
    hi: '🔬 मिट्टी के चमत्कार'
  },
  'student.tab_modules': {
    en: '📚 Lessons & Games',
    hi: '📚 पाठ और खेल'
  },
  'student.tab_badges': {
    en: '🏅 Badges & XP',
    hi: '🏅 बैज और अंक'
  },
  'student.tab_certificate': {
    en: '📜 My Certificate',
    hi: '📜 मेरा प्रमाण पत्र'
  },
  'student.level_seed': {
    en: 'Seed Explorer 🌰',
    hi: 'बीज खोजी 🌰'
  },
  'student.level_sprout': {
    en: 'Green Sprout 🌱',
    hi: 'हरा अंकुर 🌱'
  },
  'student.level_sapling': {
    en: 'Soil Guardian 🪴',
    hi: 'मृदा रक्षक 🪴'
  },
  'student.level_tree': {
    en: 'Mighty Tree Partner 🌳',
    hi: 'महान वृक्ष मित्र 🌳'
  },
  'student.tell_me_more': {
    en: 'Tell me more 🔍',
    hi: 'और जानें 🔍'
  },
  'student.hide_details': {
    en: 'Show less ✕',
    hi: 'कम दिखाएं ✕'
  },
  'student.read_aloud': {
    en: 'Read Aloud 🔊',
    hi: 'सुनें 🔊'
  },
  'student.stop_reading': {
    en: 'Stop ⏹️',
    hi: 'रोकें ⏹️'
  },
  'student.play_game': {
    en: 'Play Mini-Game 🎮',
    hi: 'खेल खेलें 🎮'
  },
  'student.take_quiz': {
    en: 'Quick Picture Quiz ❓',
    hi: 'चित्र प्रश्नोत्तरी ❓'
  },
  'student.did_you_know': {
    en: 'Did You Know? 💡',
    hi: 'क्या आप जानते हैं? 💡'
  },
  'student.step_strip_title': {
    en: '3-Step Action Strip 🎬',
    hi: '3-चरणीय गतिविधि 🎬'
  },
  'student.print_cert': {
    en: 'Print My Certificate 🖨️',
    hi: 'प्रमाण पत्र प्रिंट करें 🖨️'
  },
  'student.share_cert': {
    en: 'Share Achievement 🌟',
    hi: 'उपलब्धि साझा करें 🌟'
  }
};
