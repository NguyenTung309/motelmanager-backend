import { Component, OnInit } from '@angular/core';
import { AdminService, RegisterRequest } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-register-requests',
  templateUrl: './admin-register-requests.component.html',
  styleUrls: ['./admin-register-requests.component.scss']
})
export class AdminRegisterRequestsComponent implements OnInit {
  requests: RegisterRequest[] = [];
  filteredRequests: RegisterRequest[] = [];
  pagedRequests: RegisterRequest[] = [];

  error = '';
  success = '';
  searchTerm = '';
  entriesPerPage = 10;
  currentPage = 1;

  constructor(public adminService: AdminService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.adminService.getRegisterRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.filteredRequests = [...this.requests];
        this.updatePagination();
      },
      error: () => this.error = 'Không tải được danh sách đơn.'
    });
  }

  approve(id: number) {
    this.adminService.approveRegister(id).subscribe({
      next: () => {
        this.loadRequests()
        this.success = "Duyệt thành công!";
      },
      error: () => this.error = 'Duyệt thất bại.'
    });
  }

  get total() {
    return this.filteredRequests.length;
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
    const all = this.requests.filter(r =>
      r.username.toLowerCase().includes(search)
    );
    this.filteredRequests = all;
    this.pagedRequests = all.slice(this.start, this.end);
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
