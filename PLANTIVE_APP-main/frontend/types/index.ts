export type Language = 'english' | 'hindi';
export type Role = 'farmer' | 'official';
export type Gender = 'male' | 'female';
export type FarmerType = 'marginal' | 'small' | 'others';
export type FarmerCategory = 'owner' | 'tenant' | 'share_cropper';

export interface FarmerRegistrationData {
  fullName: string;
  relationship: 's/o' | 'd/o' | 'w/o' | 'c/o';
  relativeName: string;
  mobileNumber: string;
  age: string;
  gender: Gender;
  farmerType: FarmerType;
  farmerCategory: FarmerCategory;
  residential: {
    state: string;
    district: string;
    subDistrict: string;
    address: string;
    village: string;
    pincode: string;
  };
  farmerId: {
    type: 'uid';
    number: string;
  };
  pmfbyId: string;
  bankDetails: {
    hasIFSC: boolean;
    ifscCode: string;
    state: string;
    district: string;
    bankName: string;
    branchName: string;
    accountNumber: string;
    confirmAccountNumber: string;
  };
}

export interface OfficialData {
  officialId: string;
  phoneNumber: string;
  username: string;
  password: string;
  email: string;
}

export interface CropStage {
  id: string;
  name_en: string;
  name_hi: string;
}

export interface StateDistrict {
  state: string;
  districts: string[];
  subDistricts: Record<string, string[]>;
}