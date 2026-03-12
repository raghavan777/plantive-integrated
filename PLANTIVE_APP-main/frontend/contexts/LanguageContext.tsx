import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'english' | 'hindi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Export the context so it can be imported in useLanguage hook
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

const translations = {
  english: {
    // Common
    welcome: 'Welcome',
    login: 'Login',
    register: 'Register',
    home: 'Home',
    capture: 'Capture',
    status: 'Status',
    history: 'History',
    profile: 'Profile',
    farmer: 'Farmer',
    official: 'Official',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    settings: 'Settings',
    help: 'Help',
    logout: 'Logout',
    continue: 'Continue',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Language Screen
    choose_language: 'Choose Language',
    english: 'English',
    hindi: 'Hindi',
    
    // Role Screen
    select_your_role: 'Select Your Role',
    farmer_description: 'Upload crop photos, track insurance claims, and get AI analysis',
    official_description: 'Verify crop damage, submit inspection reports, and manage claims',
    
    // Auth
    mobile_number: 'Mobile Number',
    password: 'Password',
    confirm_password: 'Confirm Password',
    forgot_password: 'Forgot Password?',
    dont_have_account: "Don't have an account?",
    already_have_account: 'Already have an account?',
    sign_up: 'Sign Up',
    sign_in: 'Sign In',
    
    // Farmer Registration
    full_name: 'Full Name',
    relationship: 'Relationship',
    relative_name: 'Relative Name',
    age: 'Age',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    farmer_type: 'Farmer Type',
    marginal: 'Marginal',
    small: 'Small',
    others: 'Others',
    farmer_category: 'Farmer Category',
    owner: 'Owner',
    tenant: 'Tenant',
    share_cropper: 'Share Cropper',
    residential_details: 'Residential Details',
    state: 'State',
    district: 'District',
    sub_district: 'Sub District',
    address: 'Address',
    village_town: 'Village/Town',
    pincode: 'Pincode',
    farmer_id: 'Farmer ID',
    uid: 'UID',
    pmfby_id: 'PMFBY ID',
    bank_details: 'Bank Details',
    ifsc: 'IFSC',
    ifsc_code: 'IFSC Code',
    bank_name: 'Bank Name',
    branch_name: 'Branch Name',
    account_number: 'Account Number',
    confirm_account_number: 'Confirm Account Number',
    captcha: 'Captcha',
    refresh_captcha: 'Refresh Captcha',
    
    // Official
    official_id: 'Official ID',
    username: 'Username',
    email: 'Email',
    
    // Crop Stages
    sowing: 'Sowing',
    vegetative: 'Vegetative',
    flowering: 'Flowering',
    maturity: 'Maturity',
    harvest: 'Harvest',
    
    // Damage Types
    flood: 'Flood',
    pest: 'Pest',
    disease: 'Disease',
    drought: 'Drought',
    hailstorm: 'Hailstorm',
    lodging: 'Lodging',
    fire: 'Fire',
    other: 'Other',
  },
  hindi: {
    // Common
    welcome: 'स्वागत है',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    home: 'होम',
    capture: 'कैप्चर',
    status: 'स्थिति',
    history: 'इतिहास',
    profile: 'प्रोफ़ाइल',
    farmer: 'किसान',
    official: 'अधिकारी',
    submit: 'जमा करें',
    cancel: 'रद्द करें',
    save: 'सेव करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    view: 'देखें',
    settings: 'सेटिंग्स',
    help: 'मदद',
    logout: 'लॉगआउट',
    continue: 'जारी रखें',
    back: 'वापस',
    next: 'अगला',
    previous: 'पिछला',
    confirm: 'पुष्टि करें',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    
    // Language Screen
    choose_language: 'भाषा चुनें',
    english: 'अंग्रेज़ी',
    hindi: 'हिंदी',
    
    // Role Screen
    select_your_role: 'अपनी भूमिका चुनें',
    farmer_description: 'फसल की तस्वीरें अपलोड करें, बीमा दावों को ट्रैक करें और AI विश्लेषण प्राप्त करें',
    official_description: 'फसल क्षति को सत्यापित करें, निरीक्षण रिपोर्ट सबमिट करें और दावों का प्रबंधन करें',
    
    // Auth
    mobile_number: 'मोबाइल नंबर',
    password: 'पासवर्ड',
    confirm_password: 'पासवर्ड की पुष्टि करें',
    forgot_password: 'पासवर्ड भूल गए?',
    dont_have_account: 'खाता नहीं है?',
    already_have_account: 'पहले से ही एक खाता है?',
    sign_up: 'साइन अप करें',
    sign_in: 'साइन इन करें',
    
    // Farmer Registration
    full_name: 'पूरा नाम',
    relationship: 'रिश्ता',
    relative_name: 'रिश्तेदार का नाम',
    age: 'उम्र',
    gender: 'लिंग',
    male: 'पुरुष',
    female: 'महिला',
    farmer_type: 'किसान प्रकार',
    marginal: 'सीमांत',
    small: 'छोटा',
    others: 'अन्य',
    farmer_category: 'किसान श्रेणी',
    owner: 'मालिक',
    tenant: 'किराएदार',
    share_cropper: 'शेयर क्रॉपर',
    residential_details: 'निवास विवरण',
    state: 'राज्य',
    district: 'जिला',
    sub_district: 'उप जिला',
    address: 'पता',
    village_town: 'गांव/शहर',
    pincode: 'पिनकोड',
    farmer_id: 'किसान आईडी',
    uid: 'यूआईडी',
    pmfby_id: 'पीएमएफबीवाई आईडी',
    bank_details: 'बैंक विवरण',
    ifsc: 'आईएफएससी',
    ifsc_code: 'आईएफएससी कोड',
    bank_name: 'बैंक का नाम',
    branch_name: 'शाखा का नाम',
    account_number: 'खाता नंबर',
    confirm_account_number: 'खाता नंबर की पुष्टि करें',
    captcha: 'कैप्चा',
    refresh_captcha: 'कैप्चा रिफ्रेश करें',
    
    // Official
    official_id: 'अधिकारी आईडी',
    username: 'उपयोगकर्ता नाम',
    email: 'ईमेल',
    
    // Crop Stages
    sowing: 'बुवाई',
    vegetative: 'वानस्पतिक',
    flowering: 'फूलना',
    maturity: 'पकना',
    harvest: 'कटाई',
    
    // Damage Types
    flood: 'बाढ़',
    pest: 'कीट',
    disease: 'रोग',
    drought: 'सूखा',
    hailstorm: 'ओलावृष्टि',
    lodging: 'गिरना',
    fire: 'आग',
    other: 'अन्य',
  },
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('english');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.english] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Export useLanguage hook from here as well for convenience
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}