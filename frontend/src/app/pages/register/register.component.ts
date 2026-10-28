import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';
  success: string = '';

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['student', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      // Gửi đúng tên thuộc tính backend yêu cầu
      this.auth.register({
        Username: this.registerForm.value.username,
        Password: this.registerForm.value.password,
        Role: this.registerForm.value.role
      }).subscribe({
        next: () => {
          this.success = 'Đăng ký thành công, chờ admin duyệt!';
          this.error = '';
        },
        error: () => {
          this.error = 'Đăng ký thất bại ';
          this.success = '';
        }
      });
    }
  }
}
