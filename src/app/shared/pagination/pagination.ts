import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  @Input() currentPage = 1;

  @Input() totalPages = 1;

  @Output() pageChange =
    new EventEmitter<number>();

  get pages(): number[] {

    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);

  }

  previousPage() {

    if (this.currentPage > 1) {

      this.pageChange.emit(
        this.currentPage - 1
      );

    }

  }

  nextPage() {

    if (this.currentPage < this.totalPages) {

      this.pageChange.emit(
        this.currentPage + 1
      );

    }

  }

  goToPage(page: number) {

    this.pageChange.emit(page);

  }

}
