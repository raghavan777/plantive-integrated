// /home/ashith/Plantive/constants/states-districts.ts

export interface District {
  code: string;
  name: string;
  subdivisions?: SubDivision[];
}

export interface SubDivision {
  code: string;
  name: string;
}

export interface IndianState {
  code: string;
  name: string;
  districts: District[];
}

// All Indian states with sample districts
export const INDIAN_STATES: IndianState[] = [
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    districts: [
      { code: 'AN', name: 'Anantapur' },
      { code: 'CH', name: 'Chittoor' },
      { code: 'EG', name: 'East Godavari' },
      { code: 'GU', name: 'Guntur' },
      { code: 'KU', name: 'Kurnool' },
      { code: 'KR', name: 'Krishna' },
      { code: 'NE', name: 'Nellore' },
      { code: 'PR', name: 'Prakasam' },
      { code: 'SR', name: 'Srikakulam' },
      { code: 'VS', name: 'Visakhapatnam' },
      { code: 'VZ', name: 'Vizianagaram' },
      { code: 'WG', name: 'West Godavari' },
      { code: 'CU', name: 'YSR Kadapa' }
    ]
  },
  {
    code: 'TG',
    name: 'Telangana',
    districts: [
      { code: 'AD', name: 'Adilabad' },
      { code: 'HY', name: 'Hyderabad' },
      { code: 'KH', name: 'Khammam' },
      { code: 'MA', name: 'Mahabubnagar' },
      { code: 'ME', name: 'Medak' },
      { code: 'NA', name: 'Nalgonda' },
      { code: 'NI', name: 'Nizamabad' },
      { code: 'RA', name: 'Ranga Reddy' },
      { code: 'WA', name: 'Warangal' },
      { code: 'KA', name: 'Karimnagar' }
    ]
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    districts: [
      { code: 'CH', name: 'Chennai' },
      { code: 'CO', name: 'Coimbatore' },
      { code: 'CU', name: 'Cuddalore' },
      { code: 'DH', name: 'Dharmapuri' },
      { code: 'DI', name: 'Dindigul' },
      { code: 'ER', name: 'Erode' },
      { code: 'KC', name: 'Kanchipuram' },
      { code: 'KK', name: 'Kanyakumari' },
      { code: 'KR', name: 'Krishnagiri' },
      { code: 'MA', name: 'Madurai' },
      { code: 'NG', name: 'Nagapattinam' },
      { code: 'NI', name: 'Nilgiris' },
      { code: 'NM', name: 'Namakkal' },
      { code: 'PE', name: 'Perambalur' },
      { code: 'PU', name: 'Pudukkottai' },
      { code: 'RA', name: 'Ramanathapuram' },
      { code: 'SA', name: 'Salem' },
      { code: 'SI', name: 'Sivaganga' },
      { code: 'TP', name: 'Tirupur' },
      { code: 'TC', name: 'Tiruchirappalli' },
      { code: 'TH', name: 'Theni' },
      { code: 'TI', name: 'Tirunelveli' },
      { code: 'TJ', name: 'Thanjavur' },
      { code: 'TK', name: 'Thoothukudi' },
      { code: 'TL', name: 'Tiruvallur' },
      { code: 'TR', name: 'Tiruvannamalai' },
      { code: 'TU', name: 'Tiruvarur' },
      { code: 'VE', name: 'Vellore' },
      { code: 'VL', name: 'Viluppuram' },
      { code: 'VR', name: 'Virudhunagar' }
    ]
  },
  {
    code: 'KA',
    name: 'Karnataka',
    districts: [
      { code: 'BG', name: 'Bangalore Urban' },
      { code: 'BR', name: 'Bangalore Rural' },
      { code: 'BL', name: 'Belgaum' },
      { code: 'BA', name: 'Bellary' },
      { code: 'BI', name: 'Bidar' },
      { code: 'CJ', name: 'Chamarajanagar' },
      { code: 'CK', name: 'Chikmagalur' },
      { code: 'CT', name: 'Chitradurga' },
      { code: 'DK', name: 'Dakshina Kannada' },
      { code: 'DA', name: 'Davanagere' },
      { code: 'DH', name: 'Dharwad' },
      { code: 'GA', name: 'Gadag' },
      { code: 'GU', name: 'Gulbarga' },
      { code: 'HS', name: 'Hassan' },
      { code: 'HV', name: 'Haveri' },
      { code: 'KD', name: 'Kodagu' },
      { code: 'KL', name: 'Kolar' },
      { code: 'KP', name: 'Koppal' },
      { code: 'MA', name: 'Mandya' },
      { code: 'MY', name: 'Mysore' },
      { code: 'RA', name: 'Raichur' },
      { code: 'RM', name: 'Ramanagara' },
      { code: 'SH', name: 'Shimoga' },
      { code: 'TU', name: 'Tumkur' },
      { code: 'UD', name: 'Udupi' },
      { code: 'UK', name: 'Uttara Kannada' },
      { code: 'VI', name: 'Vijayanagara' },
      { code: 'VJ', name: 'Vijayapura' },
      { code: 'YG', name: 'Yadgir' }
    ]
  },
  {
    code: 'MH',
    name: 'Maharashtra',
    districts: [
      { code: 'AH', name: 'Ahmednagar' },
      { code: 'AK', name: 'Akola' },
      { code: 'AM', name: 'Amravati' },
      { code: 'AU', name: 'Aurangabad' },
      { code: 'BI', name: 'Beed' },
      { code: 'BH', name: 'Bhandara' },
      { code: 'BU', name: 'Buldhana' },
      { code: 'CH', name: 'Chandrapur' },
      {code: 'DH', name: 'Dhule' },
      { code: 'GA', name: 'Gadchiroli' },
      { code: 'GO', name: 'Gondia' },
      { code: 'HI', name: 'Hingoli' },
      { code: 'JG', name: 'Jalgaon' },
      { code: 'JN', name: 'Jalna' },
      { code: 'KO', name: 'Kolhapur' },
      { code: 'LA', name: 'Latur' },
      { code: 'MC', name: 'Mumbai City' },
      { code: 'MU', name: 'Mumbai Suburban' },
      { code: 'NG', name: 'Nagpur' },
      { code: 'ND', name: 'Nanded' },
      { code: 'NS', name: 'Nandurbar' },
      { code: 'NU', name: 'Nashik' },
      { code: 'OS', name: 'Osmanabad' },
      { code: 'PA', name: 'Parbhani' },
      { code: 'PU', name: 'Pune' },
      { code: 'RA', name: 'Raigad' },
      { code: 'RT', name: 'Ratnagiri' },
      { code: 'SN', name: 'Sangli' },
      { code: 'ST', name: 'Satara' },
      { code: 'SI', name: 'Sindhudurg' },
      { code: 'SO', name: 'Solapur' },
      { code: 'TH', name: 'Thane' },
      { code: 'WA', name: 'Wardha' },
      { code: 'WS', name: 'Washim' },
      { code: 'YA', name: 'Yavatmal' }
    ]
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    districts: [
      { code: 'AG', name: 'Agra' },
      { code: 'AL', name: 'Aligarh' },
      { code: 'AL', name: 'Allahabad' },
      { code: 'AM', name: 'Ambedkar Nagar' },
      { code: 'AU', name: 'Auraiya' },
      { code: 'AZ', name: 'Azamgarh' },
      { code: 'BG', name: 'Baghpat' },
      { code: 'BH', name: 'Bahraich' },
      { code: 'BL', name: 'Ballia' },
      { code: 'BP', name: 'Balrampur' },
      { code: 'BN', name: 'Banda' },
      { code: 'BR', name: 'Barabanki' },
      { code: 'BR', name: 'Bareilly' },
      { code: 'BS', name: 'Basti' },
      { code: 'BI', name: 'Bijnor' },
      { code: 'BD', name: 'Budaun' },
      { code: 'BU', name: 'Bulandshahr' },
      { code: 'CH', name: 'Chandauli' },
      { code: 'CT', name: 'Chitrakoot' },
      { code: 'DE', name: 'Deoria' },
      { code: 'ET', name: 'Etah' },
      { code: 'EW', name: 'Etawah' },
      { code: 'FA', name: 'Faizabad' },
      { code: 'FR', name: 'Farrukhabad' },
      { code: 'FI', name: 'Fatehpur' },
      { code: 'FZ', name: 'Firozabad' },
      { code: 'GB', name: 'Gautam Buddh Nagar' },
      { code: 'GZ', name: 'Ghaziabad' },
      { code: 'GH', name: 'Ghazipur' },
      { code: 'GN', name: 'Gonda' },
      { code: 'GP', name: 'Gorakhpur' },
      { code: 'HM', name: 'Hamirpur' },
      { code: 'HR', name: 'Hardoi' },
      { code: 'HT', name: 'Hathras' },
      { code: 'JL', name: 'Jalaun' },
      { code: 'JP', name: 'Jaunpur' },
      { code: 'JH', name: 'Jhansi' },
      { code: 'KJ', name: 'Kannauj' },
      { code: 'KD', name: 'Kanpur Dehat' },
      { code: 'KN', name: 'Kanpur Nagar' },
      { code: 'KS', name: 'Kaushambi' },
      { code: 'KU', name: 'Kushinagar' },
      { code: 'LA', name: 'Lakhimpur Kheri' },
      { code: 'LU', name: 'Lalitpur' },
      { code: 'LK', name: 'Lucknow' },
      { code: 'MG', name: 'Maharajganj' },
      { code: 'MH', name: 'Mahoba' },
      { code: 'MP', name: 'Mainpuri' },
      { code: 'MT', name: 'Mathura' },
      { code: 'MB', name: 'Mau' },
      { code: 'ME', name: 'Meerut' },
      { code: 'MI', name: 'Mirzapur' },
      { code: 'MO', name: 'Moradabad' },
      { code: 'MU', name: 'Muzaffarnagar' },
      { code: 'PI', name: 'Pilibhit' },
      { code: 'PR', name: 'Pratapgarh' },
      { code: 'RA', name: 'Rae Bareli' },
      { code: 'RB', name: 'Rampur' },
      { code: 'SA', name: 'Saharanpur' },
      { code: 'SM', name: 'Sambhal' },
      { code: 'ST', name: 'Sant Kabir Nagar' },
      { code: 'SR', name: 'Shahjahanpur' },
      { code: 'SH', name: 'Shamli' },
      { code: 'SV', name: 'Shravasti' },
      { code: 'SI', name: 'Siddharthnagar' },
      { code: 'SI', name: 'Sitapur' },
      { code: 'SO', name: 'Sonbhadra' },
      { code: 'SU', name: 'Sultanpur' },
      { code: 'UN', name: 'Unnao' },
      { code: 'VA', name: 'Varanasi' }
    ]
  }
];

// Helper function to get districts by state code
export function getDistrictsByState(stateCode: string): District[] {
  const state = INDIAN_STATES.find(s => s.code === stateCode);
  return state ? state.districts : [];
}

// Helper function to get state name by code
export function getStateName(stateCode: string): string {
  const state = INDIAN_STATES.find(s => s.code === stateCode);
  return state ? state.name : '';
}

// Helper function to get district name
export function getDistrictName(stateCode: string, districtCode: string): string {
  const districts = getDistrictsByState(stateCode);
  const district = districts.find(d => d.code === districtCode);
  return district ? district.name : '';
}

// All state codes for dropdown
export const STATE_CODES = INDIAN_STATES.map(state => ({
  value: state.code,
  label: state.name
}));

// Sample subdivisions for Tamil Nadu - Chennai district
export const SAMPLE_SUBDIVISIONS: SubDivision[] = [
  { code: 'CT1', name: 'Chennai Central' },
  { code: 'CT2', name: 'Chennai North' },
  { code: 'CT3', name: 'Chennai South' },
  { code: 'CT4', name: 'Anna Nagar' },
  { code: 'CT5', name: 'T. Nagar' }
];
export { INDIAN_STATES as statesData };
export default INDIAN_STATES;