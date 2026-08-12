import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  paginate(
    data: any[],
    currentPage: number,
    itemsPerPage: number
  ) {

    const start = (currentPage - 1) * itemsPerPage;

    return data.slice(
      start,
      start + itemsPerPage
    );

  }

  getTotalPages(
    data: any[],
    itemsPerPage: number
  ) {

    return Math.ceil(
      data.length / itemsPerPage
    );

  }

  getPages(totalPages: number) {

    return Array(totalPages)
      .fill(0)
      .map((_, index) => index + 1);

  }

}