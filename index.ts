export interface Listing {
  id: number;
  title: string;
  description: string;
  category: string;
  itemType: string;
  availability: 'swap' | 'free';
  quantity?: string;
  photo?: string;
  street: string;
  houseNumber: string;
  streetNumber: string;
  ownerName: string;
  ownerId: string;
  ownerPhoto?: string;
  lookingFor?: string;
  expiryDate: string;
  date: string;
  status: 'pending' | 'approved';
  requests: Request[];
}

export interface Request {
  id: number;
  requester: string;
  message?: string;
  offer?: string;
}

export interface UserProfile {
  name: string;
  photo?: string;
  street: string;
  houseNumber: string;
  producesAvailable?: string;
  lookingFor?: string;
}

export interface StorageResult {
  key: string;
  value: string;
  shared: boolean;
}
