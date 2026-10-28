import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { getApiErrorMessage } from 'src/app/utils/http-error.util';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    public auth: AuthService
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['student', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.auth.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.success = response.message;
        this.error = '';
        this.registerForm.reset({ role: 'student' });
      },
      error: (error) => {
        this.error = getApiErrorMessage(error, 'Dang ky that bai.');
        this.success = '';
      }
    });
  }
}
