export type UserRole = 'central' | 'state' | 'seller' | 'buyer';

export interface UserSession {
  id: string;
  role: UserRole;
  name: string;
  phoneMasked: string;
  state?: string | null;
  city?: string | null;
  identityRef: string;
}

export interface Property {
  id: string;
  title: string;
  surveyNumber: string;
  propertyType: 'Residential' | 'Commercial' | 'Agricultural' | 'Industrial';
  area: number;
  areaUnit: string;
  address: string;
  state: string;
  city: string;
  pin: string;
  lat: number;
  lng: number;
  currentOwner: string;
  currentOwnerId: string;
  listedPrice: number;
  status: 'DRAFT' | 'LISTED' | 'NEGOTIATING' | 'DEAL_AGREED' | 'PENDING_GOVERNMENT_APPROVAL' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'TRANSFERRED';
  verificationStatus: 'VERIFIED' | 'PENDING' | 'DOCUMENT_MISMATCH' | 'TAMPER_DETECTED';
  registeredAt: string;
  qrCode?: string;
}

export interface PropertyDocument {
  id: string;
  propertyId: string;
  name: string;
  type: string;
  hash: string;
  verificationStatus: 'VERIFIED' | 'TAMPER_DETECTED';
  uploadedAt: string;
}

export interface OwnershipHistory {
  id: string;
  propertyId: string;
  year: number;
  ownerName: string;
  transferPrice: number;
  txHash: string;
  blockNumber: number;
  timestamp: string;
}

export interface Offer {
  id: string;
  propertyId: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  amount: number;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COUNTERED';
  parentOfferId?: string | null;
  createdAt: string;
  respondedAt?: string;
}

export interface ApprovalRequest {
  id: string;
  propertyId: string;
  transferId: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  state: string;
  city: string;
  agreedPrice: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  anomalyFlags: string; // JSON string
  createdAt: string;
}

export interface BlockchainTransaction {
  id: string;
  txHash: string;
  blockNumber: number;
  contractAddress: string;
  eventName: string;
  propertyId: string;
  fromAddress: string;
  toAddress: string;
  timestamp: string;
  status: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}
