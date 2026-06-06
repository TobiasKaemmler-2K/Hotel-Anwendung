import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Room, RoomFilter } from '../../../core/models/room.model';
import { RoomService } from '../../../core/services/room.service';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  activeFilters: string[] = [];
  loading = false;
  errorMessage = '';
  mobileFiltersOpen = false;

  readonly filterForm = this.formBuilder.group({
    category: [''],
    minPrice: [''],
    maxPrice: [''],
    guestCount: [''],
    minRoomSize: [''],
    amenity: [''],
    service: [''],
    minRating: [''],
    outlook: [''],
    bedType: [''],
    availabilityStatus: [''],
    sortBy: ['price-asc'],
    wifi: [false],
    tv: [false],
    airConditioning: [false],
    availableFrom: [''],
    availableTo: ['']
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  applyFilters(): void {
    const filterValues = this.filterForm.getRawValue();

    const filters: RoomFilter = {
      category: filterValues.category || undefined,
      minPrice: filterValues.minPrice ? Number(filterValues.minPrice) : undefined,
      maxPrice: filterValues.maxPrice ? Number(filterValues.maxPrice) : undefined,
      guestCount: filterValues.guestCount ? Number(filterValues.guestCount) : undefined,
      minRoomSize: filterValues.minRoomSize ? Number(filterValues.minRoomSize) : undefined,
      amenity: filterValues.amenity || undefined,
      service: filterValues.service || undefined,
      minRating: filterValues.minRating ? Number(filterValues.minRating) : undefined,
      outlook: filterValues.outlook || undefined,
      bedType: filterValues.bedType || undefined,
      availabilityStatus: (filterValues.availabilityStatus as 'available' | 'limited' | 'booked') || undefined,
      sortBy: (filterValues.sortBy as 'price-asc' | 'price-desc' | 'rating-desc' | 'size-desc') || 'price-asc',
      wifi: filterValues.wifi ? true : undefined,
      tv: filterValues.tv ? true : undefined,
      airConditioning: filterValues.airConditioning ? true : undefined,
      availableFrom: filterValues.availableFrom || undefined,
      availableTo: filterValues.availableTo || undefined
    };

    this.activeFilters = this.buildActiveFilters(filters);
    this.loadRooms(filters);
  }

  resetFilters(): void {
    this.filterForm.reset({
      category: '',
      minPrice: '',
      maxPrice: '',
      guestCount: '',
      minRoomSize: '',
      amenity: '',
      service: '',
      minRating: '',
      outlook: '',
      bedType: '',
      availabilityStatus: '',
      sortBy: 'price-asc',
      wifi: false,
      tv: false,
      airConditioning: false,
      availableFrom: '',
      availableTo: ''
    });

    this.activeFilters = [];
    this.loadRooms();
  }

  toggleMobileFilters(): void {
    this.mobileFiltersOpen = !this.mobileFiltersOpen;
  }

  private loadRooms(filters?: RoomFilter): void {
    this.loading = true;
    this.errorMessage = '';

    this.roomService.getRooms(filters).subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Zimmer konnten nicht geladen werden.';
        this.loading = false;
      }
    });
  }

  hasFeature(value: number | boolean): boolean {
    return value === true || value === 1;
  }

  trackByRoomId(_: number, room: Room): number {
    return room.id;
  }

  private buildActiveFilters(filters: RoomFilter): string[] {
    const chips: string[] = [];

    if (filters.category) chips.push(`Kategorie: ${filters.category}`);
    if (filters.minPrice) chips.push(`Preis ab ${filters.minPrice} EUR`);
    if (filters.maxPrice) chips.push(`Preis bis ${filters.maxPrice} EUR`);
    if (filters.guestCount) chips.push(`Gaeste: min. ${filters.guestCount}`);
    if (filters.minRoomSize) chips.push(`Groesse: min. ${filters.minRoomSize} m2`);
    if (filters.amenity) chips.push(`Ausstattung: ${filters.amenity}`);
    if (filters.service) chips.push(`Service: ${filters.service}`);
    if (filters.minRating) chips.push(`Bewertung ab ${filters.minRating}`);
    if (filters.outlook) chips.push(`Ausblick: ${filters.outlook}`);
    if (filters.bedType) chips.push(`Bettenart: ${filters.bedType}`);
    if (filters.availabilityStatus) chips.push(`Status: ${filters.availabilityStatus}`);
    if (filters.wifi) chips.push('WLAN');
    if (filters.tv) chips.push('TV');
    if (filters.airConditioning) chips.push('Klimaanlage');
    if (filters.availableFrom && filters.availableTo) {
      chips.push(`Verfuegbarkeit: ${filters.availableFrom} bis ${filters.availableTo}`);
    }

    return chips;
  }
}
