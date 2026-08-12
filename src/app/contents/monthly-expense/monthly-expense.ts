import { Component, OnInit } from '@angular/core';
import { ChartData, ChartConfiguration } from 'chart.js';
import { ExpenseService } from '../../services/expense';
import { ExportService } from '../../services/export';
import Swal from 'sweetalert2';
import { LoadingService } from '../../services/loading';
import { PaginationService } from '../../services/pagination';

@Component({
  selector: 'app-monthly-expense',
  standalone: false,
  templateUrl: './monthly-expense.html',
  styleUrl: './monthly-expense.css',
})
export class MonthlyExpense implements OnInit {
  value = localStorage.getItem('loggedInUser');
  currentMonth = '';
  currentYear = 0;
  searchText = '';
  selectedCategory = 'All';

  showPopup = false;

  showEditModal = false;

  editingExpense: any = null;
  
  editExpenseData = {

    amount: null as number | null,

    category: '',

    date: '',

    paymentMethod: '',

    description: '',

    notes: ''

  };

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  paginatedExpenses:any[]=[];

  expenses: any[] = [];
  

  allExpenses: any[] = [];

  totalExpense = 0;
  transactionCount = 0;
  topCategory = '';
  dailyAverage = 0;
  previousMonthTotal = 0;
  percentageChange = 0;
  categories: string[] = [];
  categorySummary: any[] = [];
  pieChartType: 'pie' = 'pie';
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: []
      }
    ]
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  barChartType: 'bar' = 'bar';

  barChartData: ChartData<'bar'> = {
    labels: [
      'Week 1',
      'Week 2',
      'Week 3',
      'Week 4',
      'Week 5'
    ],

    datasets: [
      {
        label: 'Weekly Expense',
        data: []
      }
    ]
  };

  barChartOptions:
    ChartConfiguration<'bar'>['options'] = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
  };

  constructor(private expenseService: ExpenseService, private exportService: ExportService, public loadingService:LoadingService, private paginationService: PaginationService) {}

  ngOnInit(): void {

    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    },250);

    this.getCurrentMonth();

    this.loadExpenses();

  }

  updatePagination(){

    this.totalPages =

    this.paginationService.getTotalPages(

        this.expenses,

        this.itemsPerPage

    );

    this.paginatedExpenses =

    this.paginationService.paginate(

        this.expenses,

        this.currentPage,

        this.itemsPerPage

    );

  }

  onPageChange(page:number){

    this.currentPage = page;

    this.updatePagination();

}

  downloadCSV() {

    this.exportService
        .exportCSV(
            this.filteredExpenses
        );
      
  }
  
  downloadExcel() {
  
    this.exportService
        .exportExcel(
            this.filteredExpenses
        );
      
  }
  
  downloadPDF() {
  
    this.exportService
        .exportPDF(
            this.filteredExpenses
        );
      
  }

  //Edit model
  openEditModal(expense: any) {

  this.editingExpense =
    expense;


  this.editExpenseData = {

    amount:
      expense.amount,

    category:
      expense.category,

    date:
      new Date(expense.date)
        .toISOString()
        .split('T')[0],

    paymentMethod:
      expense.paymentMethod,

    description:
      expense.description || '',

    notes:
      expense.notes || ''

  };


  this.showEditModal = true;

  }

  closeEditModal() {

  this.showEditModal = false;

  this.editingExpense = null;

  }

  //Expense loading
  loadExpenses() {

    this.expenseService
      .getExpenses()
      .subscribe({

        next: (res: any) => {

          console.log(
            'MONTHLY EXPENSES:',
            res.expenses
          );

          this.allExpenses =
            res.expenses || [];

          this.filterCurrentMonth();

          this.currentPage = 1;

          this.updatePagination();

          this.filterCurrentMonth();


          this.calculatePreviousMonth();


          this.calculateSummary();

          this.calculateCategorySummary();

          this.calculateWeeklyExpense();

        },

        error: (err: any) => {

          console.error(
            'MONTHLY EXPENSE ERROR:',
            err
          );

        }

      });

  }

  filterCurrentMonth() {

  const today =
    new Date();

  const month =
    today.getMonth();

  const year =
    today.getFullYear();


  this.expenses =
    this.allExpenses.filter(
      expense => {

        const date =
          new Date(expense.date);

        return (

          date.getMonth() === month &&

          date.getFullYear() === year

        );

      }
    );

    
    this.currentPage = 1;

    this.updatePagination();

  }

  calculatePreviousMonth() {

  const today =
    new Date();


  let previousMonth =
    today.getMonth() - 1;

  let previousYear =
    today.getFullYear();


  // January -> December previous year
  if (previousMonth < 0) {

    previousMonth = 11;

    previousYear--;

  }


  const previousExpenses =
    this.allExpenses.filter(
      expense => {

        const date =
          new Date(expense.date);

        return (

          date.getMonth() ===
            previousMonth &&

          date.getFullYear() ===
            previousYear

        );

      }
    );


  this.previousMonthTotal =
    previousExpenses.reduce(

      (total, expense) =>
        total +
        Number(expense.amount),

      0

    );


  console.log(
    'PREVIOUS MONTH TOTAL:',
    this.previousMonthTotal
  );

  }

  //Get current month
  getCurrentMonth() {
    const today = new Date();
    this.currentMonth =
      today.toLocaleString(
        'default',
        {
          month: 'long'
        }
      );
    this.currentYear =
      today.getFullYear();
  }

  //Summary calculation
  calculateSummary() {

  // TOTAL
  this.totalExpense =
    this.expenses.reduce(

      (total, expense) =>
        total +
        Number(expense.amount),

      0

    );


  // TRANSACTIONS
  this.transactionCount =
    this.expenses.length;


  // DAILY AVERAGE

  const today =
    new Date();

  const currentDay =
    today.getDate();


  this.dailyAverage =
    currentDay > 0
      ? this.totalExpense /
        currentDay
      : 0;


  // CATEGORY TOTALS

  const categoryTotals:
    Record<string, number> = {};


  this.expenses.forEach(
    expense => {

      const category =
        expense.category ||
        'Unassigned';


      categoryTotals[category] =
        (
          categoryTotals[category] ||
          0
        )
        +
        Number(expense.amount);

    }
  );


  // TOP CATEGORY

  const categoryNames =
    Object.keys(
      categoryTotals
    );


  if (categoryNames.length > 0) {

    this.topCategory =
      categoryNames.reduce(
        (a, b) =>

          categoryTotals[a] >
          categoryTotals[b]
            ? a
            : b

      );

  } else {

    this.topCategory = 'N/A';

  }


  // PREVIOUS MONTH COMPARISON

  if (
    this.previousMonthTotal > 0
  ) {

    this.percentageChange =

      (
        (
          this.totalExpense -
          this.previousMonthTotal
        )
        /
        this.previousMonthTotal
      )
      * 100;

  } else {

    this.percentageChange = 0;

  }

  }

  //Category summary calculation
  calculateCategorySummary() {
    const totals:
      { [key: string]: number }
      = {};
    this.expenses.forEach(
      expense => {
        if (
          !totals[
            expense.category
          ]
        ) {
          totals[
            expense.category
          ] = 0;
        }
        totals[
          expense.category
        ] += Number(expense.amount);
      }
    );

    this.categorySummary =
      Object.keys(
        totals
      ).map(
        category => ({
          category:
            category,
          amount:
            totals[category],
          percentage:
            this.totalExpense > 0
              ? (
                  totals[category] /
                  this.totalExpense
                ) * 100
              : 0
            * 100
        })
      );
    this.categories =
      Object.keys(
        totals
      );

    this.pieChartData = {
      labels:
        this.categorySummary.map(
          item =>
            item.category
        ),
      datasets: [
        {
          data:
            this.categorySummary.map(
              item =>
                item.amount
            )
          }
      ]
    };
  }

  //Weekly expense calculation
  calculateWeeklyExpense() {
    const weeklyTotals = [
      0,
      0,
      0,
      0,
      0
    ];
    this.expenses.forEach(
      expense => {
        const date =
          new Date(
            expense.date
          );
        const day =
          date.getDate();
        const week =
          Math.floor(
            (day - 1) / 7
          );
        weeklyTotals[week]
          += Number(expense.amount);
      }
    );

    this.barChartData = {
      labels: [
        'Week 1',
        'Week 2',
        'Week 3',
        'Week 4',
        'Week 5'
      ],

      datasets: [
        {
          label:
            'Weekly Expense',
          data:
            weeklyTotals,
          backgroundColor:
            '#F77F00',
          borderRadius:
            8
        }
      ]
    };
  }

  //Filter Expenses
  get filteredExpenses() {

    return this.expenses.filter(
      expense => {

        const matchesSearch =
          (expense.description || '')
            .toLowerCase()
            .includes(
              this.searchText
                .toLowerCase()
            );


        const matchesCategory =

          this.selectedCategory === 'All'

          ||

          expense.category ===
            this.selectedCategory;


        return matchesSearch &&
               matchesCategory;

      }
    );

  }

  //Delete Expenses
  deleteExpense(id: string) {

    Swal.fire({
    
        title: `Delete Expense?`,
    
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
          this.expenseService
          .deleteExpense(id)
          .subscribe({
          
            next: (res: any) => {
            
              console.log(
                'EXPENSE DELETED:',
                res
              );
            
            
              // Remove from complete list
              this.allExpenses = this.allExpenses.filter(expense => expense._id !== id);
            
              this.showPopup = true;
            
              setTimeout(() => {
                this.showPopup = false;
              }, 3000);
            
            
              // Recalculate current month
              this.filterCurrentMonth();
            
              this.calculatePreviousMonth();
            
              this.calculateSummary();
            
              this.calculateCategorySummary();
            
              this.calculateWeeklyExpense();
            
            },
          
            error: (err: any) => {
            
              console.error(
                'DELETE ERROR:',
                err
              );
            
              Swal.fire({
              
                title: 'Error',
              
                html:`<i class="fa-regular fa-circle-xmark custom-alert-icon register-popup-icon"></i>
                <p>${err.error?.message || 'Failed to delete expense'}.</p>`,
              
                confirmButtonText: 'OK',
              
                customClass: {
                
                  popup: 'profile-delete-popup',
                
                  title: 'profile-delete-popup-title',
                
                  confirmButton: 'profile-delete-popup-confirm'
                
                },
              
                buttonsStyling: false
              
              });
            
              return;
            
            }

        });

      }

    })

  }

  //Update expensse
  updateExpense() {

  if (!this.editingExpense) {
    return;
  }


  if (
    !this.editExpenseData.amount ||
    !this.editExpenseData.category ||
    !this.editExpenseData.date ||
    !this.editExpenseData.paymentMethod
  ) {

    Swal.fire({
        
          html:`<i class="fa-solid fa-triangle-exclamation custom-alert-icon register-popup-icon"></i>
          <p>Please fill all required fields.</p>`,
    
          title:'Oops!',
    
          confirmButtonText:'OK',
    
          customClass:{
            
            popup:'register-popup',
        
            title:'register-popup-title',
        
            htmlContainer:'register-popup-html',
        
            confirmButton:'register-popup-confirm'
            
          },
          
          buttonsStyling:false
          
        });

    return;

  }


  this.expenseService
    .updateExpense(
      this.editingExpense._id,
      this.editExpenseData
    )
    .subscribe({

      next: (res: any) => {

        console.log(
          'EXPENSE UPDATED:',
          res
        );


        const index =
          this.allExpenses.findIndex(
            expense =>
              expense._id ===
              this.editingExpense._id
          );


        if (index !== -1) {

          this.allExpenses[index] =
            res.expense;

        }

        Swal.fire({
        
          title: 'Updated!',

          html:`<i class="fa-regular fa-circle-check custom-alert-icon profile-success-popup-icon"></i>
          <p>User Updated successfully.</p>`,

          showConfirmButton:false,

          timer:1800,

          customClass: {

            popup: 'profile-success-popup',

            title: 'profile-success-popup-title',

            confirmButton: 'profile-success-popup-confirm'

          },

          buttonsStyling: false

        });

        // return;

        this.closeEditModal();


        // Recalculate everything
        this.filterCurrentMonth();

        this.calculatePreviousMonth();

        this.calculateSummary();

        this.calculateCategorySummary();

        this.calculateWeeklyExpense();

      },

      error: (err: any) => {

        console.error(
          'UPDATE ERROR:',
          err
        );

        Swal.fire({
        
          title: 'Error',

          html:`<i class="fa-regular fa-circle-xmark custom-alert-icon register-popup-icon"></i>
          <p>${err.error?.message || 'Failed to update expense'}.</p>`,

          confirmButtonText: 'OK',

          customClass: {

            popup: 'profile-delete-popup',

            title: 'profile-delete-popup-title',

            confirmButton: 'profile-delete-popup-confirm'

          },

          buttonsStyling: false

        });

        return;

      }

    });

  }
}
