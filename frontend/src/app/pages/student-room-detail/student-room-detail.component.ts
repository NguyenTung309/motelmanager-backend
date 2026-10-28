import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MotelRoomService, MotelRoom } from 'src/app/services/motel-room.service';

@Component({
  selector: 'app-student-room-detail',
  templateUrl: './student-room-detail.component.html',
  styleUrls: ['./student-room-detail.component.scss']
})
export class StudentRoomDetailComponent implements OnInit {
  room?: MotelRoom;
  error = '';
  constructor(private route: ActivatedRoute, public roomService: MotelRoomService, public router: Router) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.roomService.getById(id).subscribe({
      next: (data) => this.room = data,
      error: () => this.error = 'Không tìm thấy phòng.'
    });
  }

  goBack() {
    this.router.navigate(["/student/rooms"]);
  }
}
