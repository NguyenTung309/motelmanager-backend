import { Component, OnInit } from '@angular/core';
import { AdminService, RegisterRequest } from 'src/app/services/admin.service';
import { getApiErrorMessage } from 'src/app/utils/http-error.util';

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

  loadRequests(): void {
    this.adminService.getRegisterRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.currentPage = 1;
        this.updatePagination();
      },
      error: (error) => {
        this.error = getApiErrorMessage(error, 'Khong tai duoc danh sach don dang ky.');
      }
    });
  }

  approve(id: number): void {
    this.adminService.approveRegister(id).subscribe({
      next: (response) => {
        this.success = response.message;
        this.error = '';
        this.loadRequests();
      },
      error: (error) => {
        this.error = getApiErrorMessage(error, 'Duyet that bai.');
        this.success = '';
      }
    });
  }

  get total(): number {
    return this.filteredRequests.length;
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
    this.filteredRequests = this.requests.filter(request =>
      request.username.toLowerCase().includes(search)
    );
    this.pagedRequests = this.filteredRequests.slice(this.start, this.end);
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
