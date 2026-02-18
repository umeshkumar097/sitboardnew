export interface StampDutyRate {
    male: number;
    female: number;
    joint: number; // Male + Female
}

export interface StateData {
    name: string;
    slug: string;
    stampDuty: StampDutyRate;
    registrationFee: number; // Percentage
    registrationMax?: number; // Some states have a max cap (e.g. 30k)
    cess?: number; // Additional cess percentage if any
    remarks?: string;
}

export const STAMP_DUTY_DATA: Record<string, StateData> = {
    'maharashtra': {
        name: 'Maharashtra',
        slug: 'maharashtra',
        stampDuty: { male: 5, female: 4, joint: 5 },
        registrationFee: 1,
        registrationMax: 30000,
        cess: 1, // Local Body Tax / Metro Cess often applies
        remarks: '1% Metro Cess applies in Mumbai, Pune, Nagpur, Bengaluru etc.'
    },
    'delhi': {
        name: 'Delhi',
        slug: 'delhi',
        stampDuty: { male: 6, female: 4, joint: 5 },
        registrationFee: 1,
        remarks: 'New Delhi Municipal Council (NDMC) areas may have different rates.'
    },
    'uttar-pradesh': {
        name: 'Uttar Pradesh',
        slug: 'uttar-pradesh',
        stampDuty: { male: 7, female: 6, joint: 6.5 }, // Often 10k discount for women or 1% less
        registrationFee: 1,
        remarks: 'Additional discount of ₹10,000 for female owners often applicable.'
    },
    'karnataka': {
        name: 'Karnataka',
        slug: 'karnataka',
        stampDuty: { male: 5, female: 5, joint: 5 }, // Flat rate usually
        registrationFee: 1,
        cess: 10, // 10% of Stamp Duty (not property value) usually as cess/surcharge
        remarks: 'Cess is calculated on Stamp Duty amount, not property value.'
    },
    'haryana': {
        name: 'Haryana',
        slug: 'haryana',
        stampDuty: { male: 7, female: 5, joint: 6 },
        registrationFee: 15000, // Fixed fee slabs usually, simplfying to typical max for high value
        remarks: 'Registration fee is slab-based. ₹15k is typical for properties > ₹25L.'
    },
    'telangana': {
        name: 'Telangana',
        slug: 'telangana',
        stampDuty: { male: 4, female: 4, joint: 4 },
        registrationFee: 0.5,
        cess: 1.5, // Transfer duty
        remarks: 'Includes Transfer Duty of 1.5%.'
    },
    'tamil-nadu': {
        name: 'Tamil Nadu',
        slug: 'tamil-nadu',
        stampDuty: { male: 7, female: 7, joint: 7 },
        registrationFee: 4, // High reg fee
        remarks: 'Registration fee is significantly higher at 4%.'
    },
    'west-bengal': {
        name: 'West Bengal',
        slug: 'west-bengal',
        stampDuty: { male: 6, female: 5, joint: 6 }, // < 40L, varies
        registrationFee: 1,
        remarks: 'Rates shown for properties > ₹40 Lakhs in Corporation areas.'
    },
    'gujarat': {
        name: 'Gujarat',
        slug: 'gujarat',
        stampDuty: { male: 4.9, female: 4.9, joint: 4.9 },
        registrationFee: 1, // 1% or skipped in some cases
        remarks: '4.9% basic Stamp Duty.'
    },
    'rajasthan': {
        name: 'Rajasthan',
        slug: 'rajasthan',
        stampDuty: { male: 6, female: 5, joint: 6 },
        registrationFee: 1,
        cess: 20, // 20% of stamp duty as surcharge
        remarks: 'Surcharge of 20% on Stamp Duty applies.'
    }
};

export const GENDERS = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Joint (Male + Female)', value: 'joint' }
];
