import { Component } from '@angular/core';
import { RecurringExpenseService } from '../../services/recurring-expense';
import Swal from 'sweetalert2';
import { LoadingService } from '../../services/loading';
import { PaginationService } from '../../services/pagination';

@Component({
  selector: 'app-recurring-expense',
  standalone: false,
  templateUrl: './recurring-expense.html',
  styleUrl: './recurring-expense.css',
})
export class RecurringExpense {
  value = localStorage.getItem('loggedInUser');

  recurringExpenses:any[]=[];

  showPopup = false;

  showDelete = false;

  searchText = '';

  selectedFrequency = '';

  showModal=false;

  editing=false;

  selectedId='';

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  paginatedRecurringExpenses:any[]=[];

  recurring={

    title:'',
    
    amount:null as number | null,
    
    category:'',
    
    paymentMethod:'UPI',
    
    description:'',
    
    frequency:'Monthly',
    
    nextDueDate:''

  };

  updatePagination(){

    this.totalPages =

    this.paginationService.getTotalPages(

        this.recurringExpenses,

        this.itemsPerPage

    );

    this.paginatedRecurringExpenses =

    this.paginationService.paginate(

        this.recurringExpenses,

        this.currentPage,

        this.itemsPerPage

    );

  }

  onPageChange(page:number){

    this.currentPage = page;

    this.updatePagination();

  }

  openAddModal(){

    this.editing=false;

    this.selectedId='';

    this.recurring={
    
      title:'',
      
      amount: null,
      
      category:'',
      
      paymentMethod:'UPI',
      
      description:'',
      
      frequency:'Monthly',
      
      nextDueDate:''
    
    };

    this.showModal=true;

  }

  closeModal(){

    this.showModal=false;

  }

  get filteredRecurringExpenses() {

    return this.recurringExpenses.filter(expense => {

      const search = expense.title
        .toLowerCase()
        .includes(this.searchText.toLowerCase());

      const frequency = this.selectedFrequency
        ? expense.frequency === this.selectedFrequency
        : true;

      return search && frequency;

    });

  }

  toggleStatus(item:any){

    this.recurringService

    .toggleRecurringExpense(item._id)

    .subscribe(()=>{

        this.loadRecurringExpenses();

    });

  }

  getDueStatus(date:string){

    const today=new Date();

    const due=new Date(date);

    today.setHours(0,0,0,0);

    due.setHours(0,0,0,0);

    const diff=

    (due.getTime()-today.getTime())/

    (1000*60*60*24);

    if(diff<0){

        return "Overdue";

    }

    if(diff===0){

        return "Due Today";

    }

    if(diff<=3){

        return "Due Soon";

    }

    return "Upcoming";

  }

  saveRecurringExpense(){

    if(this.editing){
    
      this.recurringService
    
      .updateRecurringExpense(this.selectedId, this.recurring)
    
      .subscribe(()=>{

        this.showPopup = true;
            
        setTimeout(() => {
          this.showPopup = false;
        }, 3000);
      
        this.loadRecurringExpenses();
      
        this.closeModal();
      
      });
    
    }

    else{
    
      this.recurringService

      .addRecurringExpense(this.recurring)

      .subscribe(()=>{

        this.showPopup = true;
            
        setTimeout(() => {
          this.showPopup = false;
        }, 3000);
      
        this.loadRecurringExpenses();

        this.closeModal();
      
      });
    
    }

  }

  editRecurringExpense(item:any){

    this.editing=true;

    this.selectedId=item._id;

    this.recurring={

      ...item,

      nextDueDate:

      item.nextDueDate.substring(0,10)

    };

    this.showModal=true;

  }

  get totalRecurringExpense(){

    return this.recurringExpenses.reduce(

        (sum,item)=>

        sum+item.amount,

        0

    );

  }

  get dueThisMonth(){

    const month=

    new Date().getMonth();

    const year=

    new Date().getFullYear();

    return this.recurringExpenses.filter(item=>{

        const due=new Date(item.nextDueDate);

        return due.getMonth()==month &&

               due.getFullYear()==year;

    }).length;

  }

  get notifications() {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return this.recurringExpenses
    .map(item => {

      const due = new Date(item.nextDueDate);
      due.setHours(0, 0, 0, 0);

      const diff =
        Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      let message = '';

      if (!item.isActive) return null;

      if (diff < 0) {
        message = `${item.title} is overdue`;
      } else if (diff === 0) {
        message = `${item.title} is due today`;
      } else if (diff <= 3) {
        message = `${item.title} is due in ${diff} day${diff > 1 ? 's' : ''}`;
      } else {
        return null;
      }

      return {
        title: item.title,
        message,
        status: diff < 0 ? 'overdue' : diff === 0 ? 'today' : 'soon'
      };

    })
    .filter(notification => notification !== null);

  }

  constructor(private recurringService: RecurringExpenseService, public loadingService:LoadingService, private paginationService: PaginationService){}

  ngOnInit(){

    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    },250);

    this.loadRecurringExpenses();

  }

  loadRecurringExpenses(){

  this.recurringService

  .getRecurringExpenses()

  .subscribe({

    next:(res:any)=>{
    
      this.recurringExpenses=
      
      res.recurringExpenses;

      this.updatePagination();
    
    },

    error:(err)=>{
    
      console.log(err);
    
    }

    });

  }

  deleteRecurringExpense(id:string){

    Swal.fire({
    
      title: `Delete recurring expense?`,
  
      html:`<i class="fa-solid fa-triangle-exclamation custom-alert-icon profile-delete-popup-icon"></i>
        <p>This action cannot be undone.</p>`,
  
      showCancelButton: true,
  
      cancelButtonText: 'Cancel',
  
      confirmButtonText: 'Delete',
  
      reverseButtons: true,
  
      customClass: {
  
        popup: 'profile-delete-popup',
  
        title: 'profile-delete-popup-title',
  
        htmlContainer: 'profile-delete-popup-html',
  
        confirmButton: 'profile-delete-popup-confirm',
  
        cancelButton: 'profile-delete-popup-cancel'
  
      },
  
      buttonsStyling: false
  
    }).then((result) => {
    
      if (result.isConfirmed) {

        this.recurringService

        .deleteRecurringExpense(id)

        .subscribe({

          next: () => {

            this.loadRecurringExpenses();

            this.showDelete = true;
            
            setTimeout(() => {
              this.showDelete = false;
            }, 3000);
          
          },
      
          error: (err) => {
          
            Swal.fire({

              title: 'Error',

              html:`<i class="fa-regular fa-circle-xmark custom-alert-icon register-popup-icon"></i>
              <p>${err.error?.message || 'Failed to delete user'}.</p>`,

              confirmButtonText: 'OK',

              customClass: {

                popup: 'profile-delete-popup',

                title: 'profile-delete-popup-title',

                confirmButton: 'profile-delete-popup-confirm'

              },

              buttonsStyling: false

            });
          
          }
      
        });
      
      }
      
    });
  }
}
