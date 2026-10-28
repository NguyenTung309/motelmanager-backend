import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { OwnerRoomsComponent } from './pages/owner-rooms/owner-rooms.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminRegisterRequestsComponent } from './pages/admin-register-requests/admin-register-requests.component';
import { StudentRoomsComponent } from './pages/student-rooms/student-rooms.component';
import { StudentRoomDetailComponent } from './pages/student-room-detail/student-room-detail.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { OwnerCreateRoomComponent } from './pages/owner-create-room/owner-create-room.component';
import { OwnerEditRoomComponent } from './pages/owner-edit-room/owner-edit-room.component';

const routes: Routes = [
  {
  path: '',
  component: MainLayoutComponent,
  children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
  ]
},
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'admin/users', component: AdminUsersComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'admin/register-requests', component: AdminRegisterRequestsComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
      { path: 'owner/rooms', component: OwnerRoomsComponent, canActivate: [RoleGuard], data: { role: 'owner' } },
      { path: 'owner/create', component: OwnerCreateRoomComponent, canActivate: [RoleGuard], data: { role: 'owner' } },
      { path: 'owner/edit/:id', component: OwnerEditRoomComponent, canActivate: [RoleGuard], data: { role: 'owner' } },
      { path: 'student/rooms', component: StudentRoomsComponent, canActivate: [RoleGuard], data: { role: 'student' } },
      { path: 'student/room/:id', component: StudentRoomDetailComponent, canActivate: [RoleGuard], data: { role: 'student' } }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
