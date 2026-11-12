import { Enquiry, ScooterModel } from '../types';

export interface SavingsResult {
  dailyKm: number;
  monthlyPetrolCost: number;
  monthlyElectricCost: number;
  monthlySavings: number;
  annualSavings: number;
  threeYearSavings: number;
  annualCo2SavedKg: number;
}

export function calculateEvSavings(
  dailyKm: number,
  petrolPricePerLitre: number = 104,
  electricityPerUnit: number = 7.5
): SavingsResult {
  const safeDailyKm = Math.max(1, Math.min(200, dailyKm));
  // Average petrol scooter mileage: 45 km/litre
  const dailyPetrolCost = (safeDailyKm / 45) * petrolPricePerLitre;
  // Average electric scooter efficiency: ~30 km per kWh (unit)
  const dailyElectricCost = (safeDailyKm / 30) * electricityPerUnit;

  const dailySavings = Math.max(0, dailyPetrolCost - dailyElectricCost);
  const monthlyPetrolCost = Math.round(dailyPetrolCost * 30);
  const monthlyElectricCost = Math.round(dailyElectricCost * 30);
  const monthlySavings = Math.round(dailySavings * 30);
  const annualSavings = Math.round(dailySavings * 365);
  const threeYearSavings = annualSavings * 3;
  // Roughly 0.052 kg CO2 per km saved compared to ICE 2-wheeler
  const annualCo2SavedKg = Math.round(safeDailyKm * 365 * 0.052);

  return {
    dailyKm: safeDailyKm,
    monthlyPetrolCost,
    monthlyElectricCost,
    monthlySavings,
    annualSavings,
    threeYearSavings,
    annualCo2SavedKg,
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateEnquiry(data: {
  fullName?: string;
  mobile?: string;
  email?: string;
  scooterModel?: string;
  enquiryType?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (minimum 2 characters)';
  }

  const cleanPhone = (data.mobile || '').replace(/\D/g, '');
  if (!cleanPhone || cleanPhone.length < 10) {
    errors.mobile = 'Please enter a valid 10-digit mobile number';
  }

  if (data.email && data.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
  }

  if (!data.scooterModel || data.scooterModel.trim().length === 0) {
    errors.scooterModel = 'Please select a scooter model';
  }

  if (!data.enquiryType || data.enquiryType.trim().length === 0) {
    errors.enquiryType = 'Please select an enquiry type';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function generateWhatsAppLink(phone: string, text: string): string {
  let cleaned = phone.replace(/\D/g, '');
  // Default to Indian country code 91 if 10 digits
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  const encodedText = encodeURIComponent(text.trim());
  return `https://wa.me/${cleaned}?text=${encodedText}`;
}

export interface FilterOptions {
  minRange?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'recommended' | 'price_asc' | 'price_desc' | 'range_desc' | 'speed_desc';
}

export function filterAndSortScooters(
  scooters: ScooterModel[],
  options: FilterOptions = {}
): ScooterModel[] {
  let result = [...scooters];

  if (options.search && options.search.trim() !== '') {
    const q = options.search.toLowerCase().trim();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }

  if (options.minRange !== undefined && options.minRange > 0) {
    result = result.filter((s) => s.certifiedRange >= (options.minRange || 0));
  }

  if (options.maxPrice !== undefined && options.maxPrice > 0) {
    result = result.filter((s) => s.price > 0 && s.price <= (options.maxPrice || Infinity));
  }

  if (options.sortBy) {
    switch (options.sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'range_desc':
        result.sort((a, b) => b.certifiedRange - a.certifiedRange);
        break;
      case 'speed_desc':
        result.sort((a, b) => b.topSpeed - a.topSpeed);
        break;
      case 'recommended':
      default:
        result.sort((a, b) => a.displayOrder - b.displayOrder);
        break;
    }
  }

  return result;
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatScooterPrice(price: number): string {
  return price > 0 ? formatInr(price) : 'Ask for Price';
}
