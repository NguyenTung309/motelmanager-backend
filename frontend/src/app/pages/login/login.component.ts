import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { getApiErrorMessage } from 'src/app/utils/http-error.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  error = '';

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
    if (this.loginForm.invalid) {
      return;
    }

    this.auth.login(this.loginForm.value).subscribe({
      next: () => {
        const role = this.auth.getRole();

        if (role === 'admin') {
          this.router.navigate(['/admin/users']);
          return;
        }

        if (role === 'owner') {
          this.router.navigate(['/owner/rooms']);
          return;
        }

        this.router.navigate(['/student/rooms']);
      },
      error: (error) => {
        this.error = getApiErrorMessage(error, 'Sai tai khoan hoac mat khau.');
      }
    });
  }
}
