import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  appName = 'Hệ thống Nhà trọ Sinh viên';
  tagline = 'Nền tảng đáng tin cậy để quản lý và tìm kiếm nhà trọ';
  role: string = '';
  isLoggedIn: boolean = false;
  constructor(public auth: AuthService, private router: Router) {
    this.role = this.auth.getRole();
    this.isLoggedIn = this.auth.isLoggedIn();
  }

    logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
