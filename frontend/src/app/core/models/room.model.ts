export interface RoomFeedback {
  guestName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Room {
  id: number;
  roomNumber: string;
  name: string;
  type: string;
  category: string;
  pricePerNight: number;
  capacity: number;
  roomSize: number;
  bedType: string;
  floor: number;
  outlook: string;
  rating: number;
  hasWifi: number | boolean;
  hasTv: number | boolean;
  hasAirConditioning: number | boolean;
  description: string;
  shortDescription: string;
  longDescription: string;
  amenities: string[];
  bathroomAmenities: string[];
  technicalAmenities: string[];
  luxuryFeatures: string[];
  services: string[];
  images: string[];
  availabilityStatus: 'available' | 'limited' | 'booked';
  highlights: string[];
  cancellationPolicy: string;
  checkInNote: string;
  checkOutNote: string;
  guestFeedback: RoomFeedback[];
}

export interface RoomFilter {
  type?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  guestCount?: number;
  minRoomSize?: number;
  wifi?: boolean;
  tv?: boolean;
  airConditioning?: boolean;
  amenity?: string;
  service?: string;
  minRating?: number;
  outlook?: string;
  bedType?: string;
  availabilityStatus?: 'available' | 'limited' | 'booked';
  sortBy?: 'price-asc' | 'price-desc' | 'rating-desc' | 'size-desc';
  availableFrom?: string;
  availableTo?: string;
}
