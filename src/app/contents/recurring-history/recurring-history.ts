import { Component, OnInit } from '@angular/core';
import { RecurringExpenseService } from '../../services/recurring-expense';
import { LoadingService } from '../../services/loading';
import { PaginationService } from '../../services/pagination';

@Component({
  selector: 'app-recurring-history',
  standalone: false,
  templateUrl: './recurring-history.html',
  styleUrl: './recurring-history.css',
})
export class RecurringHistory implements OnInit {
  value = localStorage.getItem('loggedInUser');
  history:any[]=[];

  paginatedHistory:any[]=[];
  
  currentPage=1;
  
  itemsPerPage=10;
  
  totalPages=0;

  constructor(private recurringService: RecurringExpenseService, public loadingService:LoadingService, private paginationService: PaginationService){}

  updatePagination(){

    this.totalPages =

    this.paginationService.getTotalPages(

        this.history,

        this.itemsPerPage

    );

    this.paginatedHistory =

    this.paginationService.paginate(

        this.history,

        this.currentPage,

        this.itemsPerPage

    );

  }

  onPageChange(page:number){

    this.currentPage = page;

    this.updatePagination();

}

  ngOnInit(): void {

    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    },250);

    this.recurringService.getRecurringHistory().subscribe({
      next: (res: any[]) => {
        this.history = res || [];

        this.currentPage = 1;

        this.updatePagination();
      },
      error: (err: any) => console.error(err)
    });
  }
}
