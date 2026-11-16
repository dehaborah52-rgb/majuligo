/**
 * MajuliGo Multi-Language Dictionary (i18n)
 * Supports English (en), Assamese (as), and Hindi (hi)
 */

export type SupportedLanguage = 'en' | 'as' | 'hi';

export const TRANSLATIONS = {
  en: {
    // Brand & Welcome
    brandName: 'MajuliGo',
    tagline: 'Majuli’s Trusted Bike Taxi Network',
    riderWelcome: 'Where do you want to ride in Majuli?',
    captainWelcome: 'Drive & Earn with MajuliGo',

    // Authentication
    enterMobile: 'Enter 10-digit mobile number',
    sendOtp: 'Get OTP',
    verifyOtp: 'Verify OTP',
    otpSentTo: 'Enter the 6-digit code sent to +91',
    resendOtp: 'Resend Code',
    termsNotice: 'By continuing, you agree to MajuliGo Terms of Service.',

    // Rider Workflows
    pickupLocation: 'Pickup Location',
    dropLocation: 'Destination',
    searchPlaceholder: 'Search Majuli ghats, satras, markets...',
    estimatedFare: 'Estimated Fare',
    confirmBooking: 'Book MajuliGo Bike Taxi',
    findingCaptain: 'Searching for nearby Captains...',
    captainFound: 'Captain is on the way!',
    captainArrived: 'Captain arrived at pickup point',
    startOtpLabel: 'Share OTP with Captain to start ride',
    rideInProgress: 'Heading to destination',
    rideCompleted: 'Trip Completed',
    cancelRide: 'Cancel Ride',
    cancellationReason: 'Select cancellation reason',

    // Captain Workflows
    availability: 'Availability',
    onlineStatus: 'YOU ARE ONLINE',
    offlineStatus: 'YOU ARE OFFLINE',
    onlineDesc: 'Listening for rides across Majuli...',
    offlineDesc: 'Go online to start receiving nearby rides',
    incomingRequest: 'Incoming Ride Request',
    acceptRide: 'Accept Ride',
    rejectRide: 'Decline',
    pickupDistance: 'Pickup Distance',
    estimatedEarnings: 'Your Earnings',
    markArrived: 'I Have Arrived',
    enterRideOtp: 'Enter Rider 4-digit OTP',
    startTrip: 'Start Trip',
    completeTrip: 'Complete Trip',
    todayEarnings: 'Today’s Earnings',
    completedTrips: 'Trips Completed',

    // General & Payments
    cashPayment: 'Cash on Arrival',
    upiPayment: 'Pay via UPI App',
    changePayment: 'Change',
    kmUnit: 'km',
    minUnit: 'mins',
    currency: '₹',
    retry: 'Retry',
    noInternet: 'No internet connection. Retrying...',
  },

  as: {
    // Assamese Localization (অসমীয়া)
    brandName: 'মাজুলী গ’',
    tagline: 'মাজুলীৰ বিশ্বাসযোগ্য বাইক টেক্সি সেৱা',
    riderWelcome: 'মাজুলীৰ ক’লৈ যাব বিচাৰে?',
    captainWelcome: 'মাজুলী গ’ৰ সৈতে বাইক চলাওক আৰু উপাৰ্জন কৰক',

    // Authentication
    enterMobile: '১০-টা নম্বৰৰ মোবাইল নম্বৰ দিয়ক',
    sendOtp: 'অ’টিপি লাভ কৰক',
    verifyOtp: 'অ’টিপি পৰীক্ষা কৰক',
    otpSentTo: 'প্ৰেৰণ কৰা ৬-টা নম্বৰৰ অ’টিপি দিয়ক +91',
    resendOtp: 'পুনৰ ক’ড প্ৰেৰণ কৰক',
    termsNotice: 'আগবঢ়াৰ লগে লগে আপুনি চৰ্তাৱলীত সন্মতি জনায়।',

    // Rider Workflows
    pickupLocation: 'উঠাৰ স্থান (পিকআপ)',
    dropLocation: 'যোৱাৰ স্থান (গন্তব্য)',
    searchPlaceholder: 'মাজুলীৰ ঘাট, সত্ৰ, বজাৰ সন্ধান কৰক...',
    estimatedFare: 'আনুমানিক ভাড়া',
    confirmBooking: 'বাইক টেক্সি বুক কৰক',
    findingCaptain: 'ওচৰৰ কেপ্টেইন বিচৰা হৈছে...',
    captainFound: 'কেপ্টেইন আহি আছে!',
    captainArrived: 'কেপ্টেইন পিকআপ পইণ্টত উপস্থিত হৈছে',
    startOtpLabel: 'যাত্ৰা আৰম্ভ কৰিবলৈ কেপ্টেইনক অ’টিপি জনাওক',
    rideInProgress: 'গন্তব্যলৈ যাত্ৰা অব্যাহত',
    rideCompleted: 'যাত্ৰা সম্পন্ন হ’ল',
    cancelRide: 'যাত্ৰা বাতিল কৰক',
    cancellationReason: 'বাতিলৰ কাৰণ বাছক',

    // Captain Workflows
    availability: 'উপস্থিতি স্থিতি',
    onlineStatus: 'আপুনি অনলাইন আছে',
    offlineStatus: 'আপুনি অফলাইন আছে',
    onlineDesc: 'মাজুলীৰ যাত্ৰা বিচৰা হৈছে...',
    offlineDesc: 'যাত্ৰা লাভ কৰিবলৈ অনলাইন হওক',
    incomingRequest: 'নতুন যাত্ৰাৰ অনুৰোধ',
    acceptRide: 'যাত্ৰা গ্ৰহণ কৰক',
    rejectRide: 'বাতিল কৰক',
    pickupDistance: 'পিকআপ দূৰত্ব',
    estimatedEarnings: 'আপোনাৰ উপাৰ্জন',
    markArrived: 'মই উপস্থিত হৈছোঁ',
    enterRideOtp: 'যাত্ৰীৰ ৪-টা নম্বৰৰ অ’টিপি দিয়ক',
    startTrip: 'যাত্ৰা আৰম্ভ কৰক',
    completeTrip: 'যাত্ৰা সমাপ্ত কৰক',
    todayEarnings: 'আজিৰ উপাৰ্জন',
    completedTrips: 'সম্পূৰ্ণ যাত্ৰা',

    // General & Payments
    cashPayment: 'নগদ ধন (Cash)',
    upiPayment: 'ইউপিআই (UPI) পেমেণ্ট',
    changePayment: 'সলনি কৰক',
    kmUnit: 'কিঃমিঃ',
    minUnit: 'মিনিট',
    currency: '₹',
    retry: 'পুনৰ চেষ্টা কৰক',
    noInternet: 'ইণ্টাৰনেট সংযোগ বিচ্ছিন্ন। পুনৰ চেষ্টা চলিছে...',
  },

  hi: {
    // Hindi Localization (हिंदी)
    brandName: 'माजुली गो',
    tagline: 'माजुली का भरोसेमंद बाइक टैक्सी नेटवर्क',
    riderWelcome: 'माजुली में कहाँ जाना चाहते हैं?',
    captainWelcome: 'माजुली गो के साथ बाइक चलाएं और कमाएं',

    // Authentication
    enterMobile: '10 अंकों का मोबाइल नंबर दर्ज करें',
    sendOtp: 'ओटीपी प्राप्त करें',
    verifyOtp: 'ओटीपी सत्यापित करें',
    otpSentTo: 'भेजा गया 6-अंकीय कोड दर्ज करें +91',
    resendOtp: 'दोबारा कोड भेजें',
    termsNotice: 'आगे बढ़कर आप सेवा की शर्तों से सहमत होते हैं।',

    // Rider Workflows
    pickupLocation: 'पिकअप स्थान',
    dropLocation: 'गंतव्य स्थान',
    searchPlaceholder: 'माजुली के घाट, सत्र, बाज़ार खोजें...',
    estimatedFare: 'अनुमानित किराया',
    confirmBooking: 'बाइक टैक्सी बुक करें',
    findingCaptain: 'आस-पास के कप्तान खोजे जा रहे हैं...',
    captainFound: 'कप्तान आ रहे हैं!',
    captainArrived: 'कप्तान पिकअप स्थान पर पहुँच गए हैं',
    startOtpLabel: 'सवारी शुरू करने के लिए कप्तान को ओटीपी बताएं',
    rideInProgress: 'गंतव्य की ओर अग्रसर',
    rideCompleted: 'सवारी पूरी हुई',
    cancelRide: 'सवारी रद्द करें',
    cancellationReason: 'रद्द करने का कारण चुनें',

    // Captain Workflows
    availability: 'उपलब्धता स्थिति',
    onlineStatus: 'आप ऑनलाइन हैं',
    offlineStatus: 'आप ऑफलाइन हैं',
    onlineDesc: 'माजुली भर में सवारी खोजी जा रही है...',
    offlineDesc: 'सवारी प्राप्त करने के लिए ऑनलाइन जाएं',
    incomingRequest: 'नई सवारी का अनुरोध',
    acceptRide: 'सवारी स्वीकार करें',
    rejectRide: 'अस्वीकार करें',
    pickupDistance: 'पिकअप दूरी',
    estimatedEarnings: 'आपकी कमाई',
    markArrived: 'मैं पहुँच गया हूँ',
    enterRideOtp: 'सवारी का 4-अंकीय ओटीपी दर्ज करें',
    startTrip: 'सवारी शुरू करें',
    completeTrip: 'सवारी पूरी करें',
    todayEarnings: 'आज की कमाई',
    completedTrips: 'पूरी हुई यात्राएं',

    // General & Payments
    cashPayment: 'नकद भुगतान (Cash)',
    upiPayment: 'यूपीआई से भुगतान',
    changePayment: 'बदलें',
    kmUnit: 'किमी',
    minUnit: 'मिनट',
    currency: '₹',
    retry: 'पुनः प्रयास करें',
    noInternet: 'इंटरनेट कनेक्शन नहीं है। पुनः प्रयास जारी...',
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS.en;

/**
 * Type-safe translation string lookup with language fallback to English
 */
export function translate(key: TranslationKey, lang: SupportedLanguage = 'en'): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
  return dict[key] || TRANSLATIONS.en[key] || key;
}
