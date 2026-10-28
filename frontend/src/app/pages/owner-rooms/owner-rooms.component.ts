import { Component, OnInit } from '@angular/core';
import { MotelRoomService, MotelRoom } from 'src/app/services/motel-room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner-rooms',
  templateUrl: './owner-rooms.component.html',
  styleUrls: ['./owner-rooms.component.scss']
})
export class OwnerRoomsComponent implements OnInit {
  rooms: MotelRoom[] = [];
  filteredRooms: any[] = [];

  searchTerm = '';
  entriesPerPage = 10;
  currentPage = 1;
  error = '';
  constructor(public roomService: MotelRoomService, public router: Router) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms() {
    this.roomService.getMyRooms().subscribe({
      next: (data) => {
        this.rooms = data;
        this.filteredRooms = [...this.rooms];
        this.updatePagination();
      },
      error: () => this.error = 'Không tải được danh sách bài đăng.'
    });
  }

  deleteRoom(id: number) {
    if (confirm('Bạn chắc chắn muốn xóa?')) {
      this.roomService.deleteRoom(id).subscribe({
        next: () => this.loadRooms(),
        error: () => this.error = 'Xóa thất bại.'
      });
    }
  }

  
  get total() {
    return this.filteredRooms.length;
  }

  get start() {
    return (this.currentPage - 1) * this.entriesPerPage;
  }

  get end() {
    return Math.min(this.start + this.entriesPerPage, this.total);
  }

  get totalPages() {
    return Math.ceil(this.total / this.entriesPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  updatePagination() {
    const search = this.searchTerm.toLowerCase();
    const all = this.rooms.filter(room =>
      room.title.toLowerCase().includes(search)
    );
    this.filteredRooms = all;

    this.filteredRooms = all.slice(this.start, this.end);
  }

  onSearch() {
    this.currentPage = 1;
    this.updatePagination();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
}
