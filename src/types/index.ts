export interface ScooterColor {
  name: string;
  hex: string;
}

export interface ScooterModel {
  id: string;
  slug: string;
  name: string;
  series: string;
  tagline: string;
  description: string;
  price: number; // in INR
  certifiedRange: number; // in km
  topSpeed: number; // in km/h
  batteryCapacity: string; // e.g. "3.2 kWh"
  chargingTime: string; // e.g. "3.5 hrs (0-80%)"
  batteryChemistry: string; // e.g. "Automotive Grade LFP / Smart Thermal Matrix"
  motorPower: string; // e.g. "4.8 kW Peak Mid-Drive PMSM"
  torque: string; // e.g. "88 Nm"
  acceleration: string; // e.g. "0-40 km/h in 3.1 sec"
  brakes: string; // e.g. "Front & Rear Disc with CBS"
  suspension: string; // e.g. "Telescopic Front, Dual Hydraulic Rear"
  curbWeight: string; // e.g. "98 kg"
  bootSpace: string; // e.g. "32 Litres"
  warranty: {
    vehicle: string;
    battery: string;
  };
  features: string[];
  colors: ScooterColor[];
  image: string;
  gallery: string[];
  featured: boolean;
  displayOrder: number;
  status: 'available' | 'booking_open' | 'coming_soon';
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  scooterModel: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'battery' | 'charging' | 'range' | 'purchase' | 'service';
  displayOrder: number;
}

export type EnquiryType =
  | 'Test Ride'
  | 'Price Enquiry'
  | 'General Enquiry'
  | 'Battery Information'
  | 'Purchase Enquiry'
  | 'Other';

export type EnquiryStatus =
  | 'New'
  | 'Contacted'
  | 'Test Ride Scheduled'
  | 'Converted'
  | 'Closed';

export interface Enquiry {
  id: string;
  fullName: string;
  mobile: string;
  email?: string;
  scooterModel: string;
  enquiryType: EnquiryType;
  message: string;
  preferredDate?: string;
  status: EnquiryStatus;
  createdAt: string;
  notes?: string;
}

export interface SiteSettings {
  dealerName: string;
  brandAffiliation: string;
  heroHeadline: string;
  heroSupportingText: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  operatingHours: string;
  happyCustomersCount: number;
  showroomLocationUrl: string;
  batteryChemistryHighlight: string;
  batteryWarrantyHighlight: string;
}
