import { Component, OnInit } from '@angular/core';
import { AdminService, User } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  
  users: any[] = [];
  filteredUsers: any[] = [];

  searchTerm = '';
  entriesPerPage = 10;
  currentPage = 1;
  error = '';
  constructor(public adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = [...this.users];
        this.updatePagination();
      },
      error: () => this.error = 'Không tải được danh sách user.'
    });
  }
  
  get total() {
    return this.filteredUsers.length;
  }

  get start() {
    return (this.currentPage - 1) * this.entriesPerPage;
  }

  get end() {
    return Math.min(this.start + this.entriesPerPage, this.total);
  }

  get totalPages() {
    return Math.ceil(this.total / this.entriesPerPage);
  }

  get totalPagesArray() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  updatePagination() {
    const search = this.searchTerm.toLowerCase();
    const all = this.users.filter(user =>
      user.username.toLowerCase().includes(search)
    );
    this.filteredUsers = all;

    this.filteredUsers = all.slice(this.start, this.end);
  }

  onSearch() {
    this.currentPage = 1;
    this.updatePagination();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
}
