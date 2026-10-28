import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MotelRoom, MotelRoomService } from 'src/app/services/motel-room.service';
import { getApiErrorMessage } from 'src/app/utils/http-error.util';

@Component({
  selector: 'app-owner-rooms',
  templateUrl: './owner-rooms.component.html',
  styleUrls: ['./owner-rooms.component.scss']
})
export class OwnerRoomsComponent implements OnInit {
  rooms: MotelRoom[] = [];
  filteredRooms: MotelRoom[] = [];
  pagedRooms: MotelRoom[] = [];
  searchTerm = '';
  entriesPerPage = 10;
  currentPage = 1;
  error = '';

  constructor(public roomService: MotelRoomService, public router: Router) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getMyRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        this.currentPage = 1;
        this.updatePagination();
      },
      error: (error) => {
        this.error = getApiErrorMessage(error, 'Khong tai duoc danh sach bai dang.');
      }
    });
  }

  deleteRoom(id: number): void {
    if (!confirm('Ban chac chan muon xoa phong tro nay?')) {
      return;
    }

    this.roomService.deleteRoom(id).subscribe({
      next: () => this.loadRooms(),
      error: (error) => {
        this.error = getApiErrorMessage(error, 'Xoa that bai.');
      }
    });
  }

  get total(): number {
    return this.filteredRooms.length;
  }

  get start(): number {
    return (this.currentPage - 1) * this.entriesPerPage;
  }

  get end(): number {
    return Math.min(this.start + this.entriesPerPage, this.total);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.entriesPerPage));
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  updatePagination(): void {
    const search = this.searchTerm.trim().toLowerCase();
    this.filteredRooms = this.rooms.filter(room =>
      room.title.toLowerCase().includes(search)
    );
    this.pagedRooms = this.filteredRooms.slice(this.start, this.end);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
}
