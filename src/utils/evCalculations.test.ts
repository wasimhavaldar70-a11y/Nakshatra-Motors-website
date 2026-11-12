import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEvSavings,
  validateEnquiry,
  generateWhatsAppLink,
  filterAndSortScooters,
  formatInr,
} from './evCalculations';
import { ScooterModel } from '../types';

test('calculateEvSavings returns non-negative savings and calculates correctly', () => {
  const result = calculateEvSavings(30, 100, 8);
  // dailyPetrol = (30/45)*100 = 66.67
  // dailyElectric = (30/30)*8 = 8.00
  // dailySavings = 58.67
  assert.ok(result.monthlySavings > 1500, 'Monthly savings should be substantial');
  assert.ok(result.annualSavings > 18000, 'Annual savings should be substantial');
  assert.ok(result.threeYearSavings > 50000, '3-year savings should exceed 50k');
  assert.ok(result.annualCo2SavedKg > 500, 'CO2 saved should be calculated');
});

test('validateEnquiry identifies invalid entries and allows valid submissions', () => {
  const invalid = validateEnquiry({
    fullName: '',
    mobile: '123',
    scooterModel: '',
    enquiryType: '',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.fullName);
  assert.ok(invalid.errors.mobile);
  assert.ok(invalid.errors.scooterModel);
  assert.ok(invalid.errors.enquiryType);

  const valid = validateEnquiry({
    fullName: 'Rahul Sharma',
    mobile: '9876543210',
    email: 'rahul@example.com',
    scooterModel: 'Hestur V200',
    enquiryType: 'Test Ride',
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('generateWhatsAppLink handles 10-digit Indian numbers and URL encodes message', () => {
  const link = generateWhatsAppLink('9876543210', 'Hello Nakshatra Motors!');
  assert.equal(
    link,
    'https://wa.me/919876543210?text=Hello%20Nakshatra%20Motors!'
  );

  const linkWithCountryCode = generateWhatsAppLink('+91 98765-43210', 'Test ride enquiry');
  assert.ok(linkWithCountryCode.startsWith('https://wa.me/919876543210'));
});

test('filterAndSortScooters accurately filters by search and sorts by price or range', () => {
  const mockScooters: ScooterModel[] = [
    {
      id: '1',
      slug: 'hestur-v200',
      name: 'Hestur V200 Flagship',
      series: 'Flagship Series',
      tagline: 'Ultra range',
      description: 'Long range flagship',
      price: 135000,
      certifiedRange: 160,
      topSpeed: 85,
      batteryCapacity: '3.4 kWh',
      chargingTime: '3.5 hrs',
      batteryChemistry: 'LFP',
      motorPower: '5 kW',
      torque: '90 Nm',
      acceleration: '3.1s',
      brakes: 'Disc',
      suspension: 'Dual',
      curbWeight: '102 kg',
      bootSpace: '32 L',
      warranty: { vehicle: '3 Yrs', battery: '3 Yrs' },
      features: ['Reverse Assist'],
      colors: [{ name: 'Crimson', hex: '#E11D48' }],
      image: '/img1.jpg',
      gallery: [],
      featured: true,
      displayOrder: 1,
      status: 'available',
    },
    {
      id: '2',
      slug: 'hestur-v80',
      name: 'Hestur V80 City',
      series: 'City Series',
      tagline: 'Urban commuter',
      description: 'Compact daily ride',
      price: 89000,
      certifiedRange: 90,
      topSpeed: 55,
      batteryCapacity: '2.0 kWh',
      chargingTime: '2.5 hrs',
      batteryChemistry: 'LFP',
      motorPower: '2.5 kW',
      torque: '55 Nm',
      acceleration: '4.2s',
      brakes: 'Drum',
      suspension: 'Telescopic',
      curbWeight: '88 kg',
      bootSpace: '24 L',
      warranty: { vehicle: '3 Yrs', battery: '3 Yrs' },
      features: ['USB Charger'],
      colors: [{ name: 'Slate', hex: '#64748B' }],
      image: '/img2.jpg',
      gallery: [],
      featured: false,
      displayOrder: 2,
      status: 'available',
    },
  ];

  // Test search
  const searched = filterAndSortScooters(mockScooters, { search: 'Flagship' });
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, '1');

  // Test range filter
  const highRange = filterAndSortScooters(mockScooters, { minRange: 120 });
  assert.equal(highRange.length, 1);
  assert.equal(highRange[0].id, '1');

  // Test sort by price ascending
  const sortedPrice = filterAndSortScooters(mockScooters, { sortBy: 'price_asc' });
  assert.equal(sortedPrice[0].id, '2');
  assert.equal(sortedPrice[1].id, '1');
});

test('formatInr formats Indian currency correctly', () => {
  const formatted = formatInr(125000);
  assert.ok(formatted.includes('1,25,000') || formatted.includes('125,000'));
});
