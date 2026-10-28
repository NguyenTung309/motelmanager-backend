import { Component, OnInit } from '@angular/core';
import { AdminService, User } from 'src/app/services/admin.service';
import { getApiErrorMessage } from 'src/app/utils/http-error.util';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  pagedUsers: User[] = [];
  searchTerm = '';
  entriesPerPage = 10;
  currentPage = 1;
  error = '';

  constructor(public adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.currentPage = 1;
        this.updatePagination();
      },
      error: (error) => {
        this.error = getApiErrorMessage(error, 'Khong tai duoc danh sach user.');
      }
    });
  }

  get total(): number {
    return this.filteredUsers.length;
  }

  get start(): number {
    return (this.currentPage - 1) * this.entriesPerPage;
  }

  get end(): number {
    return Math.min(this.start + this.entriesPerPage, this.total);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.entriesPerPage));
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  updatePagination(): void {
    const search = this.searchTerm.trim().toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.username.toLowerCase().includes(search)
    );
    this.pagedUsers = this.filteredUsers.slice(this.start, this.end);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.updatePagination();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
}
