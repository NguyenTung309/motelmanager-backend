import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MotelRoomService } from 'src/app/services/motel-room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-owner-create-room',
  templateUrl: './owner-create-room.component.html',
  styleUrls: ['./owner-create-room.component.scss']
})
export class OwnerCreateRoomComponent {
  roomForm: FormGroup;
  error = '';
  success = '';

  constructor( 
    private fb: FormBuilder,
    private roomService: MotelRoomService,
    private router: Router
  ) {
    this.roomForm = this.fb.group({
      title: ['', Validators.required],
      address: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1000)]],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.roomForm.valid) {
      this.roomService.create(this.roomForm.value).subscribe({
        next: () => {
          this.success = 'Đăng bài thành công!';
          this.error = '';
          this.router.navigate(['/owner/rooms']);
        },
        error: () => {
          this.error = 'Đăng bài thất bại.';
          this.success = '';
        }
      });
    }
  }
}
