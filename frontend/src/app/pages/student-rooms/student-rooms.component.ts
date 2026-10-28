import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MotelRoom, MotelRoomService } from 'src/app/services/motel-room.service';
import { getApiErrorMessage } from 'src/app/utils/http-error.util';

@Component({
  selector: 'app-student-rooms',
  templateUrl: './student-rooms.component.html',
  styleUrls: ['./student-rooms.component.scss']
})
export class StudentRoomsComponent implements OnInit {
  rooms: MotelRoom[] = [];
  error = '';
  loading = false;
  district = '';
  minPrice?: number;
  maxPrice?: number;

  constructor(
    private roomService: MotelRoomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.loading = true;
    this.error = '';

    this.roomService.getAll().subscribe({
      next: (data) => {
        this.rooms = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = getApiErrorMessage(error, 'Khong tai duoc danh sach phong.');
        this.loading = false;
      }
    });
  }

  search(): void {
    this.loading = true;
    this.error = '';

    this.roomService.search(this.district, this.minPrice, this.maxPrice).subscribe({
      next: (data) => {
        this.rooms = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = getApiErrorMessage(error, 'Khong tim thay phong phu hop.');
        this.loading = false;
      }
    });
  }

  resetFilters(): void {
    this.district = '';
    this.minPrice = undefined;
    this.maxPrice = undefined;
    this.loadRooms();
  }

  viewDetail(id: number): void {
    this.router.navigate(['/student/rooms', id]);
  }

  trackByRoomId(_: number, room: MotelRoom): number {
    return room.id;
  }
}
