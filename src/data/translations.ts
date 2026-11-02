import { LanguageCode } from '../types/lead';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  conciergeTitle: string;
  slaBeacon: string;
  selectProject: string;
  selectLanguage: string;
  inputPlaceholder: string;
  send: string;
  quickQuestions: {
    price: string;
    amenities: string;
    location: string;
    possession: string;
    bookVisit: string;
    talkHuman: string;
  };
  reraDisclaimer: string;
  dpdpConsentText: string;
  scheduleVisitTitle: string;
  selectDate: string;
  selectTime: string;
  slotHoldNotice: string;
  confirmBookingButton: string;
  bookingSuccessTitle: string;
  bookingSuccessDesc: string;
  passcardTitle: string;
  assignedAdvisor: string;
  getDirections: string;
  addToCalendar: string;
  reminderNotice: string;
  antiNegotiationNotice: string;
  missingFactNotice: string;
  humanHandoffNotice: string;
}

export const TRANSLATIONS: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: 'PropEase Concierge',
    tagline: 'Direct Developer AI Concierge | Company A (Ahmedabad)',
    conciergeTitle: 'AI Property Concierge',
    slaBeacon: 'Average reply time: 18 seconds • 24/7 Live',
    selectProject: 'Select Project',
    selectLanguage: 'Language',
    inputPlaceholder: 'Ask about carpet area, pricing, possession or book a visit...',
    send: 'Send',
    quickQuestions: {
      price: 'Price & Unit Plans',
      amenities: 'Clubhouse & Amenities',
      location: 'Location & Landmarks',
      possession: 'Possession & RERA',
      bookVisit: 'Schedule Site Visit',
      talkHuman: 'Speak with Advisor',
    },
    reraDisclaimer: 'GujRERA Registered Projects. Verified developer information only.',
    dpdpConsentText: 'I consent to receive site visit details under the DPDP Act 2023.',
    scheduleVisitTitle: 'Select an Available Site Visit Slot',
    selectDate: 'Choose Visit Date',
    selectTime: 'Available Free Slots (Zero Double-Booking)',
    slotHoldNotice: 'Slot held exclusively for you for 3 minutes.',
    confirmBookingButton: 'Confirm Site Visit Pass',
    bookingSuccessTitle: 'Site Visit Confirmed!',
    bookingSuccessDesc: 'Your personal site tour has been locked with a dedicated sales advisor.',
    passcardTitle: 'Official Site Visit Pass',
    assignedAdvisor: 'Dedicated Sales Advisor',
    getDirections: 'Open Google Maps Pin',
    addToCalendar: 'Add to Calendar (.ics)',
    reminderNotice: 'Automated reminders will be delivered 24 hours & 2 hours before your visit.',
    antiNegotiationNotice: 'Our official pricing is strictly approved by the developer. Final customized payment plans can only be discussed in person during your visit.',
    missingFactNotice: 'I want to provide 100% verified facts. I have noted this inquiry and our Senior Sales Advisor will confirm directly with you.',
    humanHandoffNotice: 'Connecting you with our Senior Property Advisor. Complete chat history forwarded.',
  },

  hi: {
    appName: 'प्रॉपईज़ कॉन्सिअर्ज',
    tagline: 'डायरेक्ट डेवलपर एआई कॉन्सिअर्ज | कंपनी ए (अहमदाबाद)',
    conciergeTitle: 'एआई प्रॉपर्टी सहायक',
    slaBeacon: 'औसत प्रतिक्रिया समय: 18 सेकंड • 24/7 लाइव',
    selectProject: 'प्रोजेक्ट चुनें',
    selectLanguage: 'भाषा',
    inputPlaceholder: 'कारपेट एरिया, कीमत, पजेशन या साइट विजिट के बारे में पूछें...',
    send: 'भेजें',
    quickQuestions: {
      price: 'कीमत और यूनिट प्लान्स',
      amenities: 'क्लबहाउस और सुविधाएं',
      location: 'लोकेशन और मार्ग',
      possession: 'पजेशन और रेरा (RERA)',
      bookVisit: 'साइट विजिट बुक करें',
      talkHuman: 'सलाहकार से बात करें',
    },
    reraDisclaimer: 'गुजरेरा (GujRERA) पंजीकृत प्रोजेक्ट्स। केवल सत्यापित जानकारी।',
    dpdpConsentText: 'मैं DPDP अधिनियम 2023 के तहत साइट विजिट विवरण प्राप्त करने की सहमति देता हूँ।',
    scheduleVisitTitle: 'उपलब्ध साइट विजिट स्लॉट चुनें',
    selectDate: 'तारीख चुनें',
    selectTime: 'उपलब्ध खाली स्लॉट (नो डबल-बुकिंग)',
    slotHoldNotice: 'यह स्लॉट 3 मिनट के लिए आपके लिए आरक्षित है।',
    confirmBookingButton: 'साइट विजिट पास कन्फर्म करें',
    bookingSuccessTitle: 'साइट विजिट कन्फर्म हो गई!',
    bookingSuccessDesc: 'आपका व्यक्तिगत दौरा हमारे वरिष्ठ सेल्स सलाहकार के साथ तय हो गया है।',
    passcardTitle: 'आधिकारिक साइट विजिट पास',
    assignedAdvisor: 'नियुक्त सेल्स सलाहकार',
    getDirections: 'गूगल मैप्स दिशा-निर्देश खोलें',
    addToCalendar: 'कैलेंडर में जोड़ें (.ics)',
    reminderNotice: 'आपकी विजिट से 24 घंटे और 2 घंटे पहले ऑटोमैटिक रिमाइंडर भेजा जाएगा।',
    antiNegotiationNotice: 'हमारी आधिकारिक कीमतें डेवलपर द्वारा स्वीकृत हैं। अंतिम भुगतान योजना पर व्यक्तिगत रूप से साइट विजिट के दौरान चर्चा की जाएगी।',
    missingFactNotice: 'सटीक जानकारी सुनिश्चित करने के लिए, मैंने यह प्रश्न नोट कर लिया है और हमारे वरिष्ठ सलाहकार आपसे सीधे पुष्टि करेंगे।',
    humanHandoffNotice: 'आपको हमारे वरिष्ठ सलाहकार से कनेक्ट किया जा रहा है। पूरी चैट हिस्ट्री भेज दी गई है।',
  },

  gu: {
    appName: 'પ્રોપઇઝ કોન્સિઅર્જ',
    tagline: 'ડાયરેક્ટ ડેવલપર AI સહાયક | કંપની A (અમદાવાદ)',
    conciergeTitle: 'AI પ્રોપર્ટી સહાયક',
    slaBeacon: 'સરેરાશ જવાબ સમય: ૧૮ સેકન્ડ • ૨૪/૭ લાઇવ',
    selectProject: 'પ્રોજેક્ટ પસંદ કરો',
    selectLanguage: 'ભાષા',
    inputPlaceholder: 'કાર્પેટ એરિયા, કિંમત, પઝેશન અથવા સાઇટ વિઝિટ વિશે પૂછો...',
    send: 'મોકલો',
    quickQuestions: {
      price: 'કિંમત અને ફ્લેટ પ્લાન',
      amenities: 'ક્લબહાઉસ અને સુવિધાઓ',
      location: 'લોકેશન અને સરનામું',
      possession: 'પઝેશન અને રેરા (RERA)',
      bookVisit: 'સાઇટ વિઝિટ બુક કરો',
      talkHuman: 'સેલ્સ એડવાઈઝર સાથે વાત કરો',
    },
    reraDisclaimer: 'ગુજરેરા (GujRERA) રજિસ્ટર્ડ પ્રોજેક્ટ્સ. માત્ર પ્રમાણિત વિગતો.',
    dpdpConsentText: 'હું DPDP એક્ટ ૨૦૨૩ હેઠળ સાઇટ વિઝિટની વિગતો મેળવવા સંમતિ આપું છું.',
    scheduleVisitTitle: 'ઉપલબ્ધ સાઇટ વિઝિટ સ્લોટ પસંદ કરો',
    selectDate: 'તારીખ પસંદ કરો',
    selectTime: 'ઉપલબ્ધ ખાલી સ્લોટ્સ (ઝીરો ડબલ-બુકિંગ)',
    slotHoldNotice: 'આ સ્લોટ તમારા માટે ૩ મિનિટ સુધી અનામત રાખવામાં આવ્યો છે.',
    confirmBookingButton: 'સાઇટ વિઝિટ પાસ કન્ફર્મ કરો',
    bookingSuccessTitle: 'સાઇટ વિઝિટ કન્ફર્મ થઈ ગઈ!',
    bookingSuccessDesc: 'તમારો પર્સનલ સાઇટ પ્રવાસ અમારા ડેડિકેટેડ સેલ્સ એડવાઇઝર સાથે નક્કી થયો છે.',
    passcardTitle: 'સત્તાવાર સાઇટ વિઝિટ પાસ',
    assignedAdvisor: 'ડેડિકેટેડ સેલ્સ એડવાઇઝર',
    getDirections: 'ગૂગલ મેપ્સ લોકેશન ખોલો',
    addToCalendar: 'કેલેન્ડરમાં ઉમેરો (.ics)',
    reminderNotice: 'મુલાકાતના ૨૪ કલાક અને ૨ કલાક પહેલાં આપમેળે રિમાઇન્ડર મોકલવામાં આવશે.',
    antiNegotiationNotice: 'અમારી સત્તાવાર કિંમતો ડેવલપર દ્વારા પ્રમાણિત છે. કોઈ પણ ખાસ ડિસ્કાઉન્ટ કે પેમેન્ટ પ્લાનની ચર્ચા સાઇટ વિઝિટ દરમિયાન રૂબરૂ થશે.',
    missingFactNotice: 'ચોક્કસ માહિતી મળે તે માટે, મેં આ વિગત નોંધી લીધી છે અને અમારા સિનિયર એડવાઇઝર તમારી સાથે રૂબરૂ પુષ્ટિ કરશે.',
    humanHandoffNotice: 'તમને અમારા સિનિયર સેલ્સ એડવાઇઝર સાથે કનેક્ટ કરવામાં આવી રહ્યા છે. સંપૂર્ણ ચેટ હિસ્ટ્રી ફોરવર્ડ કરાઈ છે.',
  },
};
