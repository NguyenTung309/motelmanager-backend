import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
// Đã thay thế bằng các component mới
import { OwnerRoomsComponent } from './pages/owner-rooms/owner-rooms.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminRegisterRequestsComponent } from './pages/admin-register-requests/admin-register-requests.component';
import { StudentRoomsComponent } from './pages/student-rooms/student-rooms.component';
import { StudentRoomDetailComponent } from './pages/student-room-detail/student-room-detail.component';
import { OwnerCreateRoomComponent } from './pages/owner-create-room/owner-create-room.component';
import { OwnerEditRoomComponent } from './pages/owner-edit-room/owner-edit-room.component';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    // Đã thay thế bằng các component mới
    OwnerRoomsComponent,
    AdminUsersComponent,
    AdminRegisterRequestsComponent,
    StudentRoomsComponent,
    StudentRoomDetailComponent,
    OwnerCreateRoomComponent,
    OwnerEditRoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
