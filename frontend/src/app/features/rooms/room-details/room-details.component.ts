import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Room } from '../../../core/models/room.model';
import { RoomService } from '../../../core/services/room.service';

@Component({
  selector: 'app-room-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './room-details.component.html',
  styleUrl: './room-details.component.css'
})
export class RoomDetailsComponent implements OnInit {
  room: Room | null = null;
  selectedImage = '';
  loading = false;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly roomService: RoomService
  ) {}

  ngOnInit(): void {
    const roomId = Number(this.route.snapshot.paramMap.get('id'));

    if (!roomId) {
      this.errorMessage = 'Ungültige Zimmer-ID.';
      return;
    }

    this.loading = true;
    this.roomService.getRoomById(roomId).subscribe({
      next: (room) => {
        this.room = room;
        this.selectedImage = room.images?.[0] || '';
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Zimmerdetails konnten nicht geladen werden.';
        this.loading = false;
      }
    });
  }

  hasFeature(value: number | boolean): boolean {
    return value === true || value === 1;
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }
}
