import { Property, TenantAccount, BookingRequest, TenantReport } from '../types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-house-1',
    title: 'Modern Family House',
    category: 'House',
    rentAmount: 1800,
    depositAmount: 3600,
    currency: '$',
    location: 'Westlake Hills, Austin',
    city: 'Austin',
    address: '742 Evergreen Terrace, Austin, TX 78701',
    bedrooms: 3,
    bathrooms: 2,
    areaSqFt: 1850,
    furnished: true,
    parking: true,
    security: true,
    wifi: true,
    description: 'Luxurious duplex family house located in Westlake Hills. Features private lawn, rooftop garden, solar heating, and 2-car garage.',
    features: [
      'Private landscaped front lawn',
      'Modern open European kitchen',
      '24/7 security with CCTV',
      '2-car covered parking garage',
      'Generator backup & deep tubewell water'
    ],
    colorDetails: {
      walls: 'Warm Alabaster & Light Almond',
      livingRoom: 'Natural Earth Tone with Wood Accents',
      accentColor: 'Golden Oak Trims',
      flooring: 'Glossy Hardwood Timber'
    },
    photos: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'available',
    isFeatured: true,
    unitNo: 'House 14',
    floor: 2
  },
  {
    id: 'prop-apt-1',
    title: 'Luxury Apartment',
    category: 'Apartment',
    rentAmount: 1500,
    depositAmount: 3000,
    currency: '$',
    location: 'Downtown Corridor, Austin',
    city: 'Austin',
    address: '108 Congress Avenue, Austin, TX 78701',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1250,
    furnished: true,
    parking: true,
    security: true,
    wifi: true,
    description: 'Designer high-rise apartment in prime downtown. Large balconies with panoramic city view, modern amenities, gym, and rooftop lounge.',
    features: [
      'Two sunlit private balconies',
      'Modern modular kitchen cabinets',
      'Gym & community hall access',
      '24/7 guard security & CCTV',
      'Intercom linked with front desk'
    ],
    colorDetails: {
      walls: 'Soft Cloud White & Slate Grey',
      livingRoom: 'Contemporary Greige & Charcoal',
      accentColor: 'Brushed Brass Light Fixtures',
      flooring: 'Italian Marble Porcelain Tiles'
    },
    photos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'available',
    isFeatured: true,
    unitNo: 'Apt 6B',
    floor: 6
  },
  {
    id: 'prop-villa-1',
    title: 'Villa with Garden',
    category: 'House',
    rentAmount: 2500,
    depositAmount: 5000,
    currency: '$',
    location: 'Barton Creek, Austin',
    city: 'Austin',
    address: '52 Barton Creek Blvd, Austin, TX 78735',
    bedrooms: 4,
    bathrooms: 3,
    areaSqFt: 2800,
    furnished: true,
    parking: true,
    security: true,
    wifi: true,
    description: 'Spectacular standalone villa overlooking lush serene surroundings in Barton Creek. Features central reflection pool, garden patio, and expansive rooms.',
    features: [
      'Private landscaped garden with reflection pool',
      'Expansive living room with sliding glass doors',
      'Automated 3-car garage',
      'Dedicated domestic helper quarters',
      'CCTV and intercom system'
    ],
    colorDetails: {
      walls: 'Charcoal Minimalist & Warm Alabaster',
      livingRoom: 'Modern Scandinavian Grey',
      accentColor: 'Dark Slate & Champagne Trims',
      flooring: 'Polished Quartz Concrete & Wood Planks'
    },
    photos: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'available',
    isFeatured: true,
    unitNo: 'Villa #9',
    floor: 2
  },
  {
    id: 'prop-apt-1',
    title: 'Modern Apartment',
    category: 'Apartment',
    rentAmount: 1500,
    depositAmount: 3000,
    currency: '$',
    location: 'Northimom, Tax City',
    city: 'Northimom',
    address: '77 Skyview Heights, Northimom, Tax City',
    bedrooms: 2,
    bathrooms: 1,
    areaSqFt: 1100,
    furnished: true,
    parking: true,
    security: true,
    wifi: true,
    description: 'Architecturally designed modern luxury apartment in a premier residential high-rise. Features wide private balconies, elegant mood lighting, and modern fixtures.',
    features: [
      'Private balcony with skyline sunset views',
      'Designer kitchen with fitted cabinets',
      'Intercom linked with lobby reception',
      'Elevator and backup standby generator',
      '24/7 security & CCTV surveillance'
    ],
    colorDetails: {
      walls: 'Soft Cloud White & Slate Grey',
      livingRoom: 'Contemporary Greige & Charcoal',
      accentColor: 'Brushed Brass Light Fixtures',
      flooring: 'Italian Marble Porcelain Tiles'
    },
    photos: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'available',
    isFeatured: true,
    unitNo: 'Apt 4B',
    floor: 4
  },
  {
    id: 'prop-apt-2',
    title: 'Spacious 2BHK Apartment',
    category: 'Apartment',
    rentAmount: 2000,
    depositAmount: 4000,
    currency: '$',
    location: 'Northimom, Tax City',
    city: 'Northimom',
    address: '104 Maple Boulevard, Northimom, Tax City',
    bedrooms: 2,
    bathrooms: 1,
    areaSqFt: 1250,
    furnished: true,
    parking: true,
    security: true,
    wifi: true,
    description: 'Generously proportioned 2BHK apartment with sun-drenched living area, custom modular entertainment console, high-grade acoustic glass windows, and designer bathrooms.',
    features: [
      'Sun-filled open layout living room',
      'Custom entertainment console',
      'Central AC with climate heating',
      'In-unit laundry space',
      'High-speed Wi-Fi and cable pre-installed'
    ],
    colorDetails: {
      walls: 'Warm Ivory & Sandy Beige Matte',
      livingRoom: 'Linen Neutral with Teak Accents',
      accentColor: 'Soft Bronze Accents',
      flooring: 'Engineered Warm Teakwood'
    },
    photos: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'available',
    isFeatured: true,
    unitNo: 'Apt 202',
    floor: 2
  },
  {
    id: 'prop-house-2',
    title: 'Modern House with Garden',
    category: 'House',
    rentAmount: 2200,
    depositAmount: 4400,
    currency: '$',
    location: 'Northimom, Tax City',
    city: 'Northimom',
    address: '88 Whispering Pines, Northimom, Tax City',
    bedrooms: 2,
    bathrooms: 1,
    areaSqFt: 1600,
    furnished: true,
    parking: true,
    security: true,
    wifi: true,
    description: 'Contemporary architectural residence featuring swimming pool reflection view, floor-to-ceiling glass sliding doors, landscaped garden, and private outdoor patio.',
    features: [
      'Scenic garden with heated outdoor plunge pool',
      'Floor-to-ceiling sliding glass facade',
      'Dedicated private parking garage',
      'Gated community with 24/7 security',
      'Smart security access locks'
    ],
    colorDetails: {
      walls: 'Charcoal Minimalist & Warm Alabaster',
      livingRoom: 'Modern Scandinavian Grey',
      accentColor: 'Dark Slate & Champagne Trims',
      flooring: 'Polished Quartz Concrete & Wood Planks'
    },
    photos: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'available',
    isFeatured: true,
    unitNo: 'Villa #5',
    floor: 2
  },
  {
    id: 'prop-1',
    title: 'Skyline Residence Apartment',
    category: 'Apartment',
    rentAmount: 1800,
    depositAmount: 3600,
    currency: '$',
    location: 'Downtown, TX',
    city: 'Downtown',
    address: 'Apt 402, Oak Street, Downtown, TX',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1100,
    furnished: true,
    parking: true,
    security: true,
    wifi: true,
    description: 'Modern and spacious 2-bedroom apartment in the heart of downtown, perfect for families or professionals. Enjoy a comfortable living space with modern amenities, easy access to shopping, restaurants and public transport.',
    features: [
      'Spacious living room with floor-to-ceiling windows',
      'Modern kitchen with stainless steel appliances',
      'Balcony with panoramic skyline city view',
      '24/7 security & HD CCTV surveillance',
      'In-unit smart washer & dryer',
      'High-speed fiber optic internet included',
      'Central AC & digital climate heating',
      'Dedicated underground reserved parking space'
    ],
    colorDetails: {
      walls: 'Warm Ivory & Soft Alabaster Matte',
      livingRoom: 'Contemporary Greige with Charcoal Feature Wall',
      accentColor: 'Subtle Champagne Gold Trims',
      flooring: 'Polished Oak Engineered Hardwood'
    },
    photos: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'rented',
    isFeatured: false,
    unitNo: 'Apt 402',
    floor: 4,
    assignedTenantId: 'TNT-2026-01'
  },
  {
    id: 'prop-2',
    title: 'Beautiful Family House with Garden',
    category: 'House',
    rentAmount: 2600,
    depositAmount: 5200,
    currency: '$',
    location: 'Northimom, Tax City',
    city: 'Northimom',
    address: '742 Evergreen Terrace, Northimom',
    bedrooms: 4,
    bathrooms: 3,
    areaSqFt: 2400,
    furnished: true,
    parking: true,
    security: true,
    wifi: true,
    description: 'Serene standalone suburban family residence with private landscaped backyard garden, heated patio, modern open chef kitchen, and private 2-car garage.',
    features: [
      'Private manicured lawn and garden patio',
      'Chef kitchen with granite countertops',
      'Master bedroom with walk-in closet & ensuite tub',
      'Automated 2-car garage',
      'Child-safe gated neighborhood',
      'High-efficiency solar water heating'
    ],
    colorDetails: {
      walls: 'Warm Alabaster & Light Birch',
      livingRoom: 'Natural Earth Tone Linen finish',
      accentColor: 'Sage Green Accent Wall in Dining',
      flooring: 'Smoked Walnut Wood Plank'
    },
    photos: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'available',
    isFeatured: true,
    unitNo: 'Villa #12',
    floor: 2
  },
  {
    id: 'prop-3',
    title: 'Spacious 2BHK Luxury Apartment',
    category: 'Apartment',
    rentAmount: 1600,
    depositAmount: 3200,
    currency: '$',
    location: 'Northimom, Tax City',
    city: 'Northimom',
    address: 'Apt 101, Maple Avenue, Northimom',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1050,
    furnished: true,
    parking: true,
    security: true,
    wifi: true,
    description: 'Bright and airy luxury corner apartment with dual private balconies, modern recessed mood lighting, and built-in walk-in storage cabinets.',
    features: [
      'Two sunlit balconies',
      'Modular kitchen cabinets',
      'Intercom linked to lobby front desk',
      'Gym & community swimming pool access',
      'Backup generator & fast elevator'
    ],
    colorDetails: {
      walls: 'Crisp Cloud White & Slate Grey trim',
      livingRoom: 'Nordic Minimalist Light Gray',
      accentColor: 'Navy Blue Accent Wall',
      flooring: 'Glossy Italian Marble Finish Porcelain'
    },
    photos: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'rented',
    isFeatured: true,
    unitNo: 'Apt 101',
    floor: 1,
    assignedTenantId: 'TNT-2026-04'
  },
  {
    id: 'prop-4',
    title: 'Executive Corporate Commercial Office',
    category: 'Office',
    rentAmount: 3400,
    depositAmount: 6800,
    currency: '$',
    location: 'Business Bay, Financial District',
    city: 'Business Bay',
    address: 'Suite 804, Pinnacle Corporate Tower, Business Bay',
    bedrooms: 0,
    bathrooms: 2,
    areaSqFt: 1950,
    furnished: true,
    parking: true,
    security: true,
    wifi: true,
    description: 'Turnkey executive commercial office space configured with glass conference room, 18 ergonomic workstations, executive director cabin, and reception lounge.',
    features: [
      'Acoustic soundproof conference room',
      'Server rack room with dedicated HVAC cooling',
      'Biometric access control system',
      'Pantry & espresso bar ready',
      '3 reserved basement parking passes'
    ],
    colorDetails: {
      walls: 'Pure White & Frosted Glass Panels',
      livingRoom: 'Corporate Steel Grey with Oak Acoustic Slats',
      accentColor: 'Cobalt Blue Brand Accent',
      flooring: 'Anti-static Commercial Carpet Tiles'
    },
    photos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'available',
    isFeatured: false,
    unitNo: 'Suite 804',
    floor: 8
  },
  {
    id: 'prop-5',
    title: 'Prime Covered Parking & EV Charging Bay',
    category: 'Parking/Garage',
    rentAmount: 220,
    depositAmount: 300,
    currency: '$',
    location: 'Downtown Central, TX',
    city: 'Downtown',
    address: 'Bay #G-14, Metro Luxury Tower Underground, Downtown',
    bedrooms: 0,
    bathrooms: 0,
    areaSqFt: 220,
    furnished: false,
    parking: true,
    security: true,
    wifi: true,
    description: 'Secure, clean underground garage parking stall with automatic RFID gate entrance, 24/7 CCTV, and dedicated 22kW Level 2 EV fast charger.',
    features: [
      'RFID sensor automated gate access',
      'Dedicated 22kW Level 2 EV charging outlet',
      '24/7 security guard presence & HD cameras',
      'Well-lit, clean epoxy coated floor',
      'Close to elevator entrance'
    ],
    colorDetails: {
      walls: 'Safety Yellow Striping & Bright White Columns',
      livingRoom: 'N/A',
      accentColor: 'Reflective Safety Green Markings',
      flooring: 'Heavy-Duty Industrial Epoxy Coating'
    },
    photos: [
      'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: '',
    status: 'available',
    isFeatured: false,
    unitNo: 'Bay G-14',
    floor: -1
  },
  {
    id: 'prop-6',
    title: 'Modern House with Courtyard & Pool',
    category: 'House',
    rentAmount: 3100,
    depositAmount: 6200,
    currency: '$',
    location: 'Pine Ridge Estates',
    city: 'Pine Ridge',
    address: 'Apt 205, Pine Rd, Pine Ridge',
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 2150,
    furnished: true,
    parking: true,
    security: true,
    wifi: true,
    description: 'Architectural masterpiece boasting a central open-air atrium courtyard, dipping plunge pool, high wooden beamed ceilings, and floor-to-ceiling glass sliding doors.',
    features: [
      'Private plunge pool and wooden deck',
      'Central glass-walled atrium',
      'Smart home automated climate and lighting',
      'Custom designer kitchen with wine cooler',
      'Gated community with club access'
    ],
    colorDetails: {
      walls: 'Warm Sandstone & Textured Concrete',
      livingRoom: 'Muted Teak with Charcoal Accents',
      accentColor: 'Brushed Brass Light Fixtures',
      flooring: 'Seamless Microcement & Oak Planks'
    },
    photos: [
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'
    ],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    status: 'rented',
    isFeatured: true,
    unitNo: 'Apt 205',
    floor: 2,
    assignedTenantId: 'TNT-2026-05'
  }
];

export const INITIAL_TENANTS: TenantAccount[] = [
  {
    id: 'tenant-1',
    uniqueLoginId: 'TNT-2026-01',
    fullName: 'John Doe',
    email: 'johndoe@example.com',
    phoneNumber: '+1 (555) 234-5678',
    propertyId: 'prop-1',
    monthlyRent: 1800,
    leaseStartDate: '2026-05-01',
    nextDueDate: '2026-11-05',
    dueAmount: 0,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    payments: [
      {
        id: 'pay-1',
        tenantId: 'TNT-2026-01',
        propertyId: 'prop-1',
        month: 'September 2026',
        amount: 1800,
        paidDate: '2026-09-01',
        method: 'Bank Transfer',
        status: 'Paid',
        transactionId: 'TXN-982410',
        receiptNumber: 'REC-2026-0901'
      },
      {
        id: 'pay-2',
        tenantId: 'TNT-2026-01',
        propertyId: 'prop-1',
        month: 'August 2026',
        amount: 1800,
        paidDate: '2026-08-01',
        method: 'Credit Card',
        status: 'Paid',
        transactionId: 'TXN-871534',
        receiptNumber: 'REC-2026-0801'
      },
      {
        id: 'pay-3',
        tenantId: 'TNT-2026-01',
        propertyId: 'prop-1',
        month: 'July 2026',
        amount: 1800,
        paidDate: '2026-07-01',
        method: 'Stripe',
        status: 'Paid',
        transactionId: 'STRIPE-764920',
        receiptNumber: 'REC-2026-0701'
      },
      {
        id: 'pay-4',
        tenantId: 'TNT-2026-01',
        propertyId: 'prop-1',
        month: 'June 2026',
        amount: 1800,
        paidDate: '2026-06-01',
        method: 'Credit Card',
        status: 'Paid',
        transactionId: 'TXN-653812',
        receiptNumber: 'REC-2026-0601'
      }
    ]
  },
  {
    id: 'tenant-2',
    uniqueLoginId: 'TNT-2026-02',
    fullName: 'Jane Smith',
    email: 'janesmith@example.com',
    phoneNumber: '+1 (555) 345-6789',
    propertyId: 'prop-1',
    monthlyRent: 1800,
    leaseStartDate: '2026-06-15',
    nextDueDate: '2026-10-25',
    dueAmount: 1800,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    payments: [
      {
        id: 'pay-5',
        tenantId: 'TNT-2026-02',
        propertyId: 'prop-1',
        month: 'September 2026',
        amount: 1800,
        paidDate: '2026-09-08',
        method: 'Stripe',
        status: 'Paid',
        transactionId: 'STRIPE-549102',
        receiptNumber: 'REC-2026-0908'
      }
    ]
  },
  {
    id: 'tenant-3',
    uniqueLoginId: 'TNT-2026-03',
    fullName: 'Mike Brown',
    email: 'mikebrown@example.com',
    phoneNumber: '+1 (555) 789-0123',
    propertyId: 'prop-1',
    monthlyRent: 1800,
    leaseStartDate: '2026-04-01',
    nextDueDate: '2026-10-10',
    dueAmount: 1800,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    payments: []
  },
  {
    id: 'tenant-4',
    uniqueLoginId: 'TNT-2026-04',
    fullName: 'Lisa White',
    email: 'lisawhite@example.com',
    phoneNumber: '+1 (555) 456-7890',
    propertyId: 'prop-3',
    monthlyRent: 1600,
    leaseStartDate: '2026-03-01',
    nextDueDate: '2026-11-05',
    dueAmount: 0,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    payments: [
      {
        id: 'pay-6',
        tenantId: 'TNT-2026-04',
        propertyId: 'prop-3',
        month: 'October 2026',
        amount: 1600,
        paidDate: '2026-10-05',
        method: 'Bank Transfer',
        status: 'Paid',
        transactionId: 'TXN-492817',
        receiptNumber: 'REC-2026-1005'
      }
    ]
  },
  {
    id: 'tenant-5',
    uniqueLoginId: 'TNT-2026-05',
    fullName: 'David Wilson',
    email: 'davidwilson@example.com',
    phoneNumber: '+1 (555) 890-1234',
    propertyId: 'prop-6',
    monthlyRent: 2000,
    leaseStartDate: '2026-02-01',
    nextDueDate: '2026-11-10',
    dueAmount: 0,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    payments: [
      {
        id: 'pay-7',
        tenantId: 'TNT-2026-05',
        propertyId: 'prop-6',
        month: 'October 2026',
        amount: 2000,
        paidDate: '2026-10-10',
        method: 'Credit Card',
        status: 'Paid',
        transactionId: 'TXN-719384',
        receiptNumber: 'REC-2026-1010'
      }
    ]
  }
];

export const INITIAL_BOOKING_REQUESTS: BookingRequest[] = [
  {
    id: 'req-1',
    propertyId: 'prop-2',
    propertyTitle: 'Beautiful Family House with Garden',
    fullName: 'Robert Sterling',
    phoneNumber: '+1 (555) 998-8776',
    email: 'robert@example.com',
    message: 'I would like to rent this house starting from next month for my family of four. Please schedule an inspection.',
    createdAt: '2026-10-20T10:15:00Z',
    status: 'new'
  },
  {
    id: 'req-2',
    propertyId: 'prop-4',
    propertyTitle: 'Executive Corporate Commercial Office',
    fullName: 'Tariq Vance (CEO, FinTech Global)',
    phoneNumber: '+1 (555) 654-3210',
    email: 'tariq@fintechglobal.io',
    message: 'Looking for a 2-year lease for our executive engineering team. Need immediate move-in.',
    createdAt: '2026-10-19T14:30:00Z',
    status: 'meeting_set',
    meetingDetails: {
      type: 'in_person',
      date: '2026-10-24',
      time: '11:00 AM',
      locationOrNotes: 'Head Office Boardroom, Floor 3'
    }
  },
  {
    id: 'req-3',
    propertyId: 'prop-5',
    propertyTitle: 'Prime Covered Parking & EV Charging Bay',
    fullName: 'Samantha Miller',
    phoneNumber: '+1 (555) 332-2110',
    email: 'samantha.m@domain.com',
    message: 'Need the parking bay with EV charger for my electric vehicle.',
    createdAt: '2026-10-18T09:00:00Z',
    status: 'approved'
  }
];

export const INITIAL_TENANT_REPORTS: TenantReport[] = [
  {
    id: 'REP-2026-01',
    propertyId: 'prop-1',
    propertyName: 'Skyline Residence Apartment',
    unitNo: 'Apt 402',
    tenantId: 'TNT-2026-01',
    tenantName: 'John Doe',
    tenantPhone: '+1 (555) 234-5678',
    tenantEmail: 'johndoe@example.com',
    category: 'Plumbing',
    priority: 'high',
    title: 'Water pipe leaking under kitchen sink',
    description: 'There is a persistent drip coming from the PVC drain pipe joint beneath the kitchen sink. Water is accumulating in the bottom cabinet. Needs urgent gasket replacement.',
    photoUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
    status: 'pending',
    createdAt: '2026-10-23T14:20:00Z'
  },
  {
    id: 'REP-2026-02',
    propertyId: 'prop-3',
    propertyName: 'Spacious 2BHK Luxury Apartment',
    unitNo: 'Apt 101',
    tenantId: 'TNT-2026-04',
    tenantName: 'Lisa White',
    tenantPhone: '+1 (555) 456-7890',
    tenantEmail: 'lisawhite@example.com',
    category: 'Electrical',
    priority: 'medium',
    title: 'Master bedroom AC blower vibration noise',
    description: 'The split AC unit in the master bedroom makes a loud humming/buzzing sound whenever set above fan speed 2. Cooling is fine but sound is disruptive.',
    photoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    status: 'in_review',
    adminNote: 'HVAC technician scheduled for Friday 10:00 AM.',
    createdAt: '2026-10-22T09:15:00Z'
  },
  {
    id: 'REP-2026-03',
    propertyId: 'prop-6',
    propertyName: 'Modern House with Courtyard & Pool',
    unitNo: 'Apt 205',
    tenantId: 'TNT-2026-05',
    tenantName: 'David Wilson',
    tenantPhone: '+1 (555) 890-1234',
    tenantEmail: 'davidwilson@example.com',
    category: 'Structural & Locks',
    priority: 'urgent',
    title: 'Balcony glass sliding door handle lock jammed',
    description: 'The outer sliding door latch on the patio is stuck and cannot lock completely from inside. Need a locksmith or maintenance check for security.',
    status: 'pending',
    createdAt: '2026-10-24T08:00:00Z'
  }
];
