export interface StateData {
  state: string;
  code: string;
  cities: { name: string; code: string }[];
}

export const INDIAN_STATES_AND_CITIES: StateData[] = [
  {
    state: 'Maharashtra',
    code: 'MH',
    cities: [
      { name: 'Mumbai', code: 'MUM' },
      { name: 'Pune', code: 'PUN' },
      { name: 'Nagpur', code: 'NGP' },
      { name: 'Nashik', code: 'NSK' },
      { name: 'Chhatrapati Sambhajinagar', code: 'CSN' },
      { name: 'Thane', code: 'THN' },
    ],
  },
  {
    state: 'West Bengal',
    code: 'WB',
    cities: [
      { name: 'Kolkata', code: 'KOL' },
      { name: 'Howrah', code: 'HWH' },
      { name: 'Siliguri', code: 'SLG' },
      { name: 'Durgapur', code: 'DGP' },
      { name: 'Asansol', code: 'ASN' },
    ],
  },
  {
    state: 'Karnataka',
    code: 'KA',
    cities: [
      { name: 'Bangalore', code: 'BLR' },
      { name: 'Mysore', code: 'MYS' },
      { name: 'Hubli-Dharwad', code: 'HBL' },
      { name: 'Mangalore', code: 'IXE' },
      { name: 'Belgaum', code: 'IXG' },
    ],
  },
  {
    state: 'Delhi',
    code: 'DL',
    cities: [
      { name: 'New Delhi', code: 'NDL' },
      { name: 'North Delhi', code: 'NDH' },
      { name: 'South Delhi', code: 'SDH' },
      { name: 'East Delhi', code: 'EDH' },
      { name: 'Dwarka Sub-City', code: 'DWK' },
    ],
  },
  {
    state: 'Tamil Nadu',
    code: 'TN',
    cities: [
      { name: 'Chennai', code: 'MAA' },
      { name: 'Coimbatore', code: 'CJB' },
      { name: 'Madurai', code: 'IXM' },
      { name: 'Tiruchirappalli', code: 'TRZ' },
      { name: 'Salem', code: 'SXV' },
    ],
  },
  {
    state: 'Telangana',
    code: 'TG',
    cities: [
      { name: 'Hyderabad', code: 'HYD' },
      { name: 'Warangal', code: 'WGL' },
      { name: 'Nizamabad', code: 'NZB' },
      { name: 'Khammam', code: 'KMM' },
    ],
  },
  {
    state: 'Gujarat',
    code: 'GJ',
    cities: [
      { name: 'Ahmedabad', code: 'AMD' },
      { name: 'Surat', code: 'STV' },
      { name: 'Vadodara', code: 'BDQ' },
      { name: 'Rajkot', code: 'RAJ' },
      { name: 'Gandhinagar', code: 'GND' },
    ],
  },
  {
    state: 'Uttar Pradesh',
    code: 'UP',
    cities: [
      { name: 'Lucknow', code: 'LKO' },
      { name: 'Kanpur', code: 'KNP' },
      { name: 'Noida / Greater Noida', code: 'NDA' },
      { name: 'Varanasi', code: 'VNS' },
      { name: 'Agra', code: 'AGR' },
    ],
  },
  {
    state: 'Haryana',
    code: 'HR',
    cities: [
      { name: 'Gurugram', code: 'GGM' },
      { name: 'Faridabad', code: 'FBD' },
      { name: 'Panchkula', code: 'PKL' },
      { name: 'Karnal', code: 'KNL' },
    ],
  },
  {
    state: 'Rajasthan',
    code: 'RJ',
    cities: [
      { name: 'Jaipur', code: 'JAI' },
      { name: 'Jodhpur', code: 'JDH' },
      { name: 'Udaipur', code: 'UDR' },
      { name: 'Kota', code: 'KTA' },
    ],
  },
];
