export type PropertyCategory = 'Apartment' | 'House' | 'Office' | 'Parking/Garage';

export type PropertyStatus = 'available' | 'rented';

export interface ColorDetails {
  walls: string;
  livingRoom: string;
  accentColor: string;
  flooring: string;
}

export interface Property {
  id: string;
  title: string;
  category: PropertyCategory;
  rentAmount: number;
  depositAmount: number;
  currency: string;
  location: string;
  city: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  kitchens?: number;
  areaSqFt: number;
  furnished: boolean;
  parking: boolean;
  security: boolean;
  wifi: boolean;
  amenities?: string[];
  description: string;
  features: string[];
  colorDetails: ColorDetails;
  photos: string[];
  videoUrl: string;
  status: PropertyStatus;
  isFeatured: boolean;
  unitNo: string;
  floor: number;
  assignedTenantId?: string;
  titleBn?: string;
  categoryBn?: string;
  descriptionBn?: string;
}

export type BookingStatus = 'new' | 'approved' | 'meeting_set' | 'tenant_created' | 'rejected';

export interface MeetingDetails {
  type: 'in_person' | 'email' | 'video_call';
  date: string;
  time: string;
  locationOrNotes: string;
}

export interface BookingRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  message?: string;
  createdAt: string;
  status: BookingStatus;
  meetingDetails?: MeetingDetails;
  generatedTenantId?: string;
}

export type PaymentMethod = 'Credit Card' | 'Stripe' | 'Bank Transfer';
export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue';

export interface RentPayment {
  id: string;
  tenantId: string;
  propertyId: string;
  month: string;
  amount: number;
  paidDate: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId: string;
  receiptNumber: string;
  notes?: string;
}

export interface TenantAccount {
  id: string;
  uniqueLoginId: string; // e.g. "TNT-2026-01"
  fullName: string;
  email: string;
  phoneNumber: string;
  propertyId: string;
  monthlyRent: number;
  leaseStartDate: string;
  nextDueDate: string; // e.g. "2026-10-31"
  dueDayOfMonth?: number;
  dueAmount: number;
  payments: RentPayment[];
  avatar?: string;
  notes?: string;
  depositAmount?: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export type Language = 'en';
export type AppView = 'public' | 'all_properties' | 'tenant_portal' | 'admin_dashboard';

export interface SiteSettings {
  // 1. Logo & Branding
  logoUrl?: string;
  companyName: string;
  companyTagline: string;

  // 2. Banner Customization
  homeBannerImage: string;
  homeBannerHeadline: string;
  homeBannerSubtitle: string;
  homeBannerBadge: string;
  allPropertiesBannerImage: string;
  allPropertiesBannerHeadline: string;
  allPropertiesBannerSubtitle: string;

  // 3. Company Description & Trust Badges
  companyDescription: string;
  badge1: string;
  badge2: string;
  badge3: string;
  badge4: string;

  // 4. Contact Box & Office Details
  officeName: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  workingHours: string;
  contactTitle: string;
  contactSubtitle: string;

  // Optional legacy fields for backward compatibility
  homeBannerHeadlineBn?: string;
  homeBannerSubtitleBn?: string;
  companyDescriptionBn?: string;
  contactTitleBn?: string;
  contactSubtitleBn?: string;

  // 5. Stripe Online Payment Integration
  stripeEnabled: boolean;
  stripePaymentUrl: string;
  stripeAccountName?: string;

  // 6. No-Code Cloud Database & Storage Sync (Firebase / Local)
  databaseMode?: 'local' | 'firebase';
  firebaseConfigText?: string;
  firebaseApiKey?: string;
  firebaseAuthDomain?: string;
  firebaseProjectId?: string;
  firebaseStorageBucket?: string;
  firebaseConnected?: boolean;
  lastCloudSync?: string;
  lastBackupDate?: string;
}

export type ReportCategory =
  | 'Plumbing'
  | 'Electrical'
  | 'Appliance'
  | 'Structural & Locks'
  | 'Noise & Disturbance'
  | 'Pest Control'
  | 'Water & Heating'
  | 'Security'
  | 'Other';

export type ReportPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ReportStatus = 'pending' | 'in_review' | 'resolved' | 'dismissed';

export interface TenantReport {
  id: string; // e.g. "REP-2026-01"
  propertyId?: string;
  propertyName: string;
  unitNo: string;
  tenantId?: string; // e.g. "TNT-2026-01"
  tenantName: string;
  tenantPhone: string;
  tenantEmail?: string;
  category: ReportCategory;
  priority: ReportPriority;
  title: string;
  description: string;
  photoUrl?: string;
  status: ReportStatus;
  adminNote?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt?: string;
}
