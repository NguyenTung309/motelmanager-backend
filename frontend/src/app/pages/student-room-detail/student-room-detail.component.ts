import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MotelRoom, MotelRoomService } from 'src/app/services/motel-room.service';
import { getApiErrorMessage } from 'src/app/utils/http-error.util';

@Component({
  selector: 'app-student-room-detail',
  templateUrl: './student-room-detail.component.html',
  styleUrls: ['./student-room-detail.component.scss']
})
export class StudentRoomDetailComponent implements OnInit {
  room?: MotelRoom;
  error = '';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private roomService: MotelRoomService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      if (!id) {
        this.error = 'Khong tim thay phong tro can xem.';
        this.room = undefined;
        return;
      }

      this.loadRoom(id);
    });
  }

  loadRoom(id: number): void {
    this.loading = true;
    this.error = '';

    this.roomService.getById(id).subscribe({
      next: (data) => {
        this.room = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = getApiErrorMessage(error, 'Khong tim thay phong tro.');
        this.room = undefined;
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/student/rooms']);
  }
}
