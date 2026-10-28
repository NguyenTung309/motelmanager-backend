import { Component, OnInit } from '@angular/core';
import { MotelRoomService, MotelRoom } from 'src/app/services/motel-room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-rooms',
  templateUrl: './student-rooms.component.html',
  styleUrls: ['./student-rooms.component.scss']
})
export class StudentRoomsComponent implements OnInit {
  rooms: MotelRoom[] = [];
  error = '';
  district = '';
  minPrice?: number;
  maxPrice?: number;
  constructor(public roomService: MotelRoomService, public router: Router) {}

  ngOnInit(): void {
    this.loadRooms();
  }
  loadRooms() {
    this.roomService.getAll().subscribe({
      next: (data) => this.rooms = data,
      error: () => this.error = 'Không tải được danh sách phòng.'
    });
  }
  search() {
    this.roomService.search(this.district, this.minPrice, this.maxPrice).subscribe({
      next: (data) => this.rooms = data,
      error: () => this.error = 'Không tìm thấy phòng phù hợp.'
    });
  }
  viewDetail(id: number) {
    this.router.navigate(['/student/room', id]);
  }
}
