import { Component, OnInit } from '@angular/core';
import { StoreService } from './store.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-url-list',
  standalone: true,
  imports: [NgFor],
  template: `
    <div class="shared-container">
      <h2 class="shared-heading">Submitted URLs</h2>
      <ul class="stack url-list">
        <li *ngFor="let url of page" class="url-item">
          <a href="{{ url }}" target="_blank">{{ url }}</a>
        </li>
      </ul>
      <div class="pagination">
        <button
          class="pill shared-button"
          [disabled]="currentPage === 0"
          (click)="previousPage()"
        >
          <
        </button>
        <button
          *ngFor="let page of pageNumbers"
          class="pill shared-button"
          [class.active]="page === currentPage"
          (click)="goToPage(page)"
        >
          {{ page + 1 }}
        </button>
        <button
          class="pill shared-button"
          [disabled]="currentPage === totalPages"
          (click)="nextPage()"
        >
          >
        </button>
      </div>
    </div>
  `,
  styleUrl: './list.component.css',
})
export class UrlListComponent implements OnInit {
  page: string[] = [];
  currentPage: number = 0;
  pageSize: number = 20;
  totalPages: number = 0;
  pageNumbers: number[] = [];
  maxPageLinks: number = 5;

  constructor(private urlService: StoreService) {}

  async ngOnInit() {
    this.updatePagination();
  }

  private async updatePagination() {
    const startIndex = this.currentPage * this.pageSize;
    this.totalPages = Math.ceil(
      ((await this.urlService.getSize()) + 1) / this.pageSize
    );
    this.page = await this.urlService.getValues(startIndex, this.pageSize);

    // Calculate the range of page numbers to display (max 5)
    const half = Math.floor(this.maxPageLinks / 2); // 2 pages before and after current
    let startPage = Math.max(1, this.currentPage - half);
    let endPage = Math.min(this.totalPages, startPage + this.maxPageLinks - 1);

    // Adjust startPage if endPage is at totalPages to ensure 5 links (if possible)
    if (endPage - startPage + 1 < this.maxPageLinks) {
      startPage = Math.max(1, endPage - this.maxPageLinks + 1);
    }

    this.pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i - 1
    );
  }

  goToPage(page: number) {
    if (page >= 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
}
