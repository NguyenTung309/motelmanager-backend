import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MotelRoomService } from 'src/app/services/motel-room.service';

@Component({
  selector: 'app-owner-edit-room',
  templateUrl: './owner-edit-room.component.html',
  styleUrls: ['./owner-edit-room.component.scss']
})
export class OwnerEditRoomComponent implements OnInit {
  roomForm!: FormGroup;
  error = '';
  roomId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private roomService: MotelRoomService
  ) {}

  ngOnInit(): void {
    this.roomId = Number(this.route.snapshot.paramMap.get('id'));

    this.roomForm = this.fb.group({
      title: ['', Validators.required],
      address: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1000)]],
      description: ['']
    });

    this.roomService.getById(this.roomId).subscribe({
      next: room => this.roomForm.patchValue(room),
      error: () => this.error = 'Không tìm thấy bài đăng.'
    });
  }

  onSubmit(): void {
    if (this.roomForm.invalid) return;

    this.roomService.update(this.roomId, this.roomForm.value).subscribe({
      next: () => this.router.navigate(['/owner/rooms']),
      error: () => this.error = 'Cập nhật thất bại.'
    });
  }
}
