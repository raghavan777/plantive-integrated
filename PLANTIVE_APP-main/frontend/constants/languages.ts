// /home/ashith/Plantive/constants/languages.ts

// Language interface
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  voiceSample?: string;
}

// Supported languages
export const LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    voiceSample: 'assets/audio/en_sample.mp3'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    voiceSample: 'assets/audio/hi_sample.mp3'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    direction: 'ltr',
    voiceSample: 'assets/audio/ta_sample.mp3'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    direction: 'ltr',
    voiceSample: 'assets/audio/te_sample.mp3'
  }
];

// Default language
export const DEFAULT_LANGUAGE = 'en';

// App strings - English
export const ENGLISH_STRINGS = {
  // Auth Screens
  splash: {
    welcome: 'Welcome to PMFBY-CROPIC',
    tagline: 'Crop Insurance Made Simple'
  },
  
  roleSelection: {
    title: 'Select Your Role',
    farmer: 'Farmer',
    official: 'Field Official',
    farmerDesc: 'Upload crop images and track claims',
    officialDesc: 'Verify crops and submit reports'
  },
  
  // Farmer Auth
  farmerLogin: {
    title: 'Farmer Login',
    mobileNumber: 'Mobile Number',
    password: 'Password',
    captcha: 'Captcha',
    enterCaptcha: 'Enter Captcha Code',
    forgotPassword: 'Forgot Password?',
    deactivateAccount: 'Deactivate Account',
    login: 'Login',
    register: 'Register New Account',
    refresh: 'Refresh'
  },
  
  farmerRegister: {
    title: 'Farmer Registration',
    personalDetails: 'Personal Details',
    fullName: 'Full Name',
    relationship: 'Relationship',
    s_o: 'S/O',
    d_o: 'D/O',
    w_o: 'W/O',
    c_o: 'C/O',
    relativeName: 'Relative Name',
    mobileNumber: 'Mobile Number',
    sendOTP: 'Send OTP',
    enterOTP: 'Enter OTP',
    verify: 'Verify',
    age: 'Age',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    farmerType: 'Farmer Type',
    marginal: 'Marginal Farmer',
    small: 'Small Farmer',
    others: 'Others',
    farmerCategory: 'Farmer Category',
    owner: 'Owner',
    tenant: 'Tenant',
    shareCropper: 'Share Cropper',
    
    residentialDetails: 'Residential Details',
    state: 'State',
    district: 'District',
    subDistrict: 'Sub-district/Block',
    address: 'Address',
    villageTown: 'Village/Town',
    pincode: 'Pincode',
    
    farmerId: 'Farmer Identification',
    idType: 'ID Type',
    uid: 'UID (Aadhaar)',
    uidNumber: 'UID Number',
    pmfbyId: 'PMFBY Farmer ID',
    pmfbyRedirect: 'Register at pmfby.gov.in',
    
    bankDetails: 'Bank Details',
    hasIFSC: 'Do you have IFSC Code?',
    yes: 'Yes',
    no: 'No',
    ifscCode: 'IFSC Code',
    bankState: 'Bank State',
    bankDistrict: 'Bank District',
    bankName: 'Bank Name',
    branchName: 'Branch Name',
    accountNumber: 'Savings Account Number',
    confirmAccountNumber: 'Confirm Account Number',
    
    securityVerification: 'Security Verification',
    enterCaptcha: 'Enter Captcha',
    refreshCaptcha: 'Refresh Captcha',
    agreeTerms: 'I agree to the Terms & Conditions and Privacy Policy',
    register: 'Register',
    alreadyAccount: 'Already have an account? Login',
    
    // Validation messages
    required: 'This field is required',
    invalidMobile: 'Please enter valid 10-digit mobile number',
    invalidOTP: 'Invalid OTP',
    invalidPincode: 'Invalid pincode',
    accountMismatch: 'Account numbers do not match',
    termsRequired: 'You must agree to terms and conditions'
  },
  
  // Official Auth
  officialLogin: {
    title: 'Official Login',
    officialId: 'Official ID',
    phoneNumber: 'Phone Number',
    username: 'Username',
    password: 'Password',
    email: 'Email ID',
    captcha: 'Captcha',
    login: 'Login',
    register: 'Register'
  },
  
  // Farmer App
  farmerHome: {
    welcome: 'Welcome',
    weather: 'Weather',
    insuranceCoverage: 'Insurance Coverage',
    scheme: 'Scheme',
    sumInsured: 'Sum Insured',
    premium: 'Premium Paid',
    validity: 'Validity',
    eligible: 'Eligible for Claims',
    alerts: 'Alerts',
    rainAlert: 'Possible rain in 24 hours',
    pestAlert: 'Pest outbreak warning',
    captureDamage: 'Capture Damage / Crop Image',
    callSupport: 'Call Support Officer',
    viewClaims: 'View My Claims'
  },
  
  capture: {
    selectStage: 'Select Crop Stage',
    sowing: 'Sowing',
    vegetative: 'Vegetative',
    flowering: 'Flowering',
    maturity: 'Maturity',
    harvest: 'Harvest',
    next: 'Next',
    
    guidance: 'Capture Guidance',
    lightingTip: 'Ensure good lighting',
    shadowTip: 'Avoid shadows',
    steadyTip: 'Hold phone steady',
    distanceTip: 'Maintain proper distance',
    startCamera: 'Start Camera',
    
    camera: 'Smart Camera',
    distanceGuide: 'Distance Guide',
    tooClose: 'Too Close',
    goodDistance: 'Good Distance',
    lighting: 'Lighting',
    tooDark: 'Too Dark',
    goodLight: 'Good Light',
    cropDetected: 'Crop Detected',
    autoCapture: 'Auto-capture when ready',
    captureAnyway: 'Capture Anyway',
    
    preview: 'AI Preview',
    stageDetected: 'Stage Detected',
    possibleStress: 'Possible Stress',
    none: 'None',
    low: 'Low',
    high: 'High',
    qualityCheck: 'Quality Check',
    insufficient: 'Quality insufficient, retake',
    retake: 'Retake',
    continue: 'Continue',
    
    submission: 'Submission Preview',
    image: 'Image',
    cropStage: 'Crop Stage',
    location: 'Location',
    timestamp: 'Timestamp',
    submit: 'Submit',
    
    success: 'Submission Successful',
    submissionId: 'Submission ID',
    message: 'You will receive updates shortly',
    viewStatus: 'View Status'
  },
  
  status: {
    title: 'Claim Status',
    timeline: 'Status Timeline',
    submitted: 'Image Submitted',
    aiProcessing: 'AI Processing',
    officialReview: 'Official Review',
    completed: 'Assessment Completed',
    claimTriggered: 'Claim Triggered',
    pending: 'Pending',
    inProgress: 'In Progress',
    completedStatus: 'Completed'
  },
  
  history: {
    title: 'Submission History',
    noSubmissions: 'No submissions yet',
    dateTime: 'Date & Time',
    cropStage: 'Crop Stage',
    aiResult: 'AI Result',
    officerComments: 'Officer Comments',
    viewDetails: 'View Details'
  },
  
  profile: {
    title: 'Profile',
    personalInfo: 'Personal Information',
    farmDetails: 'Farm Details',
    documents: 'Documents',
    support: 'Support',
    faqs: 'FAQs',
    callSupport: 'Call Support',
    changeLanguage: 'Change Language',
    logout: 'Logout'
  },
  
  // Official App
  officialHome: {
    title: 'Field Official Dashboard',
    assignedFarms: 'Assigned Farms',
    pendingVerifications: 'Pending Verifications',
    completedReports: 'Completed Reports',
    notifications: 'Notifications',
    profile: 'Profile'
  },
  
  assignments: {
    title: 'Assigned Farms',
    farmerName: 'Farmer Name',
    crop: 'Crop',
    location: 'Location',
    deadline: 'Deadline',
    new: 'New',
    urgent: 'Urgent',
    viewDetails: 'View Details'
  },
  
  farmDetails: {
    title: 'Farm Details',
    mapPreview: 'Map Preview',
    farmerInfo: 'Farmer Information',
    cropInfo: 'Crop Information',
    lastImage: 'Last Farmer Image',
    aiResults: 'AI Results',
    startVerification: 'Start Verification Visit'
  },
  
  verification: {
    gpsCheck: 'GPS Check',
    gpsMessage: 'You must be within 50-100 meters of the farm',
    retry: 'Retry GPS',
    continue: 'Continue',
    
    capturePhotos: 'Capture Required Photos',
    wideField: '1. Wide Field Photo',
    closeCrop: '2. Closer Crop Photo',
    damageSpecific: '3. Damage Specific Photo',
    lightingIndicator: 'Lighting Indicator',
    distanceGuide: 'Distance Guide',
    autoCapture: 'Auto-capture',
    manualOverride: 'Manual Override',
    thumbnailPreview: 'Thumbnail Preview',
    
    assessment: 'Damage Assessment',
    cropStage: 'Crop Stage',
    damagePercent: 'Damage Percentage',
    damageType: 'Type of Damage',
    notes: 'Notes',
    next: 'Next',
    
    review: 'Review & Submit',
    summary: 'Summary',
    photos: 'Photos',
    gpsMatched: 'GPS Matched',
    formEntries: 'Form Entries',
    submitReport: 'Submit Report',
    
    success: 'Report Submitted',
    reportId: 'Report ID',
    synced: 'Auto-synced to server',
    pendingSync: 'Pending sync (offline mode)'
  },
  
  officialHistory: {
    title: 'Visit History',
    completedReports: 'Completed Reports',
    aiMismatch: 'AI Mismatch Alerts',
    revisitRequests: 'Revisit Requests',
    fullReport: 'Full Visit Report'
  },
  
  notifications: {
    title: 'Notifications',
    newAssignment: 'New Assignment',
    recheckRequest: 'Recheck Request',
    aiMismatch: 'AI Mismatch Detected'
  },
  
  // Common
  common: {
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    back: 'Back',
    next: 'Next',
    done: 'Done',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Information',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    refresh: 'Refresh',
    settings: 'Settings',
    help: 'Help',
    about: 'About',
    version: 'Version'
  },
  
  // Crop types
  crops: {
    paddy: 'Paddy',
    wheat: 'Wheat',
    maize: 'Maize',
    sugarcane: 'Sugarcane',
    cotton: 'Cotton',
    groundnut: 'Groundnut',
    soybean: 'Soybean',
    pulses: 'Pulses'
  },
  
  // Damage types
  damages: {
    flood: 'Flood',
    drought: 'Drought',
    pest: 'Pest Attack',
    disease: 'Disease',
    hailstorm: 'Hailstorm',
    cyclone: 'Cyclone',
    fire: 'Fire',
    landslide: 'Landslide'
  },
  
  // Weather
  weather: {
    today: 'Today',
    rainfall: 'Rainfall',
    temperature: 'Temperature',
    humidity: 'Humidity',
    wind: 'Wind Speed',
    forecast: 'Forecast',
    sunny: 'Sunny',
    cloudy: 'Cloudy',
    rainy: 'Rainy',
    stormy: 'Stormy'
  }
};

// Hindi translations
export const HINDI_STRINGS = {
  splash: {
    welcome: 'पीएमएफबीवाई-क्रोपिक में आपका स्वागत है',
    tagline: 'फसल बीमा सरल बनाया'
  },
  
  roleSelection: {
    title: 'अपनी भूमिका चुनें',
    farmer: 'किसान',
    official: 'क्षेत्र अधिकारी',
    farmerDesc: 'फसल चित्र अपलोड करें और दावों को ट्रैक करें',
    officialDesc: 'फसलों की सत्यापन करें और रिपोर्ट जमा करें'
  },
  
  farmerRegister: {
    title: 'किसान पंजीकरण',
    fullName: 'पूरा नाम',
    relationship: 'संबंध',
    relativeName: 'पिता/पति का नाम',
    mobileNumber: 'मोबाइल नंबर',
    age: 'उम्र',
    state: 'राज्य',
    district: 'जिला',
    // Add more Hindi translations as needed
  }
  // Continue with all other sections...
};

// Tamil translations
export const TAMIL_STRINGS = {
  splash: {
    welcome: 'PMFBY-CROPIC இல் வரவேற்கிறோம்',
    tagline: 'பயிர் காப்பீடு எளிதாக்கப்பட்டது'
  },
  // Continue with Tamil translations...
};

// Telugu translations
export const TELUGU_STRINGS = {
  splash: {
    welcome: 'PMFBY-CROPIC కు స్వాగతం',
    tagline: 'పంట బీమా సులభతరం చేయబడింది'
  },
  // Continue with Telugu translations...
};

// Get strings by language code
export const getStrings = (langCode: string) => {
  switch (langCode) {
    case 'hi':
      return HINDI_STRINGS;
    case 'ta':
      return TAMIL_STRINGS;
    case 'te':
      return TELUGU_STRINGS;
    case 'en':
    default:
      return ENGLISH_STRINGS;
  }
};

// Language names for dropdown
export const LANGUAGE_NAMES = {
  en: 'English',
  hi: 'Hindi',
  ta: 'Tamil',
  te: 'Telugu'
};

// Crop stages with translations
export const CROP_STAGES = [
  {
    id: 'sowing',
    en: 'Sowing',
    hi: 'बुआई',
    ta: 'விதைத்தல்',
    te: 'విత్తనం'
  },
  {
    id: 'vegetative',
    en: 'Vegetative',
    hi: 'वानस्पतिक',
    ta: 'தாவர',
    te: 'సస్య'
  },
  {
    id: 'flowering',
    en: 'Flowering',
    hi: 'फूल आना',
    ta: 'மலர்ச்சி',
    te: 'పుష్పించే'
  },
  {
    id: 'maturity',
    en: 'Maturity',
    hi: 'परिपक्वता',
    ta: 'முதிர்ச்சி',
    te: 'పరిపక్వత'
  },
  {
    id: 'harvest',
    en: 'Harvest',
    hi: 'कटाई',
    ta: 'அறுவடை',
    te: 'పంట'
  }
];

// Farmer types
export const FARMER_TYPES = [
  {
    id: 'marginal',
    en: 'Marginal Farmer',
    hi: 'सीमांत किसान',
    ta: 'ஓர விவசாயி',
    te: 'అంచుకు చెందిన రైతు'
  },
  {
    id: 'small',
    en: 'Small Farmer',
    hi: 'छोटा किसान',
    ta: 'சிறு விவசாயி',
    te: 'చిన్న రైతు'
  },
  {
    id: 'other',
    en: 'Other',
    hi: 'अन्य',
    ta: 'மற்றவை',
    te: 'ఇతర'
  }
];

// Farmer categories
export const FARMER_CATEGORIES = [
  {
    id: 'owner',
    en: 'Owner',
    hi: 'मालिक',
    ta: 'உரிமையாளர்',
    te: 'యజమాని'
  },
  {
    id: 'tenant',
    en: 'Tenant',
    hi: 'किरायेदार',
    ta: 'குத்தகையாளர்',
    te: 'యజమాని'
  },
  {
    id: 'share_cropper',
    en: 'Share Cropper',
    hi: 'बटाईदार',
    ta: 'பங்கு பயிர் செய்பவர்',
    te: 'షేర్ క్రాప్పర్'
  }
];

// Helper function to get localized string
export const t = (key: string, langCode: string = DEFAULT_LANGUAGE) => {
  const strings = getStrings(langCode);
  const keys = key.split('.');
  let value: any = strings;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return value || key;
};

// Helper to get crop stage name
export const getCropStageName = (stageId: string, langCode: string = DEFAULT_LANGUAGE) => {
  const stage = CROP_STAGES.find(s => s.id === stageId);
  return stage ? stage[langCode as keyof typeof stage] || stage.en : stageId;
};

// Helper to get farmer type name
export const getFarmerTypeName = (typeId: string, langCode: string = DEFAULT_LANGUAGE) => {
  const type = FARMER_TYPES.find(t => t.id === typeId);
  return type ? type[langCode as keyof typeof type] || type.en : typeId;
};

// Helper to get farmer category name
export const getFarmerCategoryName = (categoryId: string, langCode: string = DEFAULT_LANGUAGE) => {
  const category = FARMER_CATEGORIES.find(c => c.id === categoryId);
  return category ? category[langCode as keyof typeof category] || category.en : categoryId;
};

export default {
  LANGUAGES,
  DEFAULT_LANGUAGE,
  ENGLISH_STRINGS,
  HINDI_STRINGS,
  TAMIL_STRINGS,
  TELUGU_STRINGS,
  getStrings,
  t,
  CROP_STAGES,
  FARMER_TYPES,
  FARMER_CATEGORIES,
  getCropStageName,
  getFarmerTypeName,
  getFarmerCategoryName
};