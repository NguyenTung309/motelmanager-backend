import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      // Gửi đúng tên thuộc tính backend yêu cầu
      this.auth.login({
        Username: this.loginForm.value.username,
        Password: this.loginForm.value.password
      }).subscribe({
        next: (_res: any) => {
          // Điều hướng về trang list đúng theo role
          const role = this.auth.getRole();
          if (role === 'admin') {
            this.router.navigate(['/admin/users']);
          } else if (role === 'owner') {
            this.router.navigate(['/owner/rooms']);
          } else {
            this.router.navigate(['/student/rooms']);
          }
        },
        error: (_err: any) => {
          // Hiển thị lỗi chi tiết nếu có, tránh hiện [object ProgressEvent]
          if (_err?.error && typeof _err.error === 'string') {
            this.error = _err.error;
          } else if (_err?.status === 0) {
            this.error = 'Không thể kết nối tới máy chủ.';
          } else if (_err?.statusText) {
            this.error = _err.statusText;
          } else {
            this.error = 'Sai tài khoản hoặc mật khẩu';
          }
        }
      });
    }
  }
}
