import { Component, OnInit } from '@angular/core';
import * as Papa from 'papaparse';
import { ExpenseService } from '../../services/expense';
import { CategoryService } from '../../services/category';
import Swal from 'sweetalert2';
import { LoadingService } from '../../services/loading';
import { PaginationService } from '../../services/pagination';

@Component({
  selector: 'app-add-expense',
  standalone: false,
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css',
})
export class AddExpense implements OnInit {
  value = localStorage.getItem('loggedInUser');
  selectedData = 2;
  importedCount = 0;
  failedImportCount = 0;
  showDeletePopUp = false;

  paginatedRecentExpenses:any[]=[];
  recentCurrentPage=1;
  recentItemsPerPage=5;
  recentTotalPages=0;

  paginatedPreviewExpenses:any[]=[];
  previewCurrentPage=1;
  previewItemsPerPage=5;
  previewTotalPages=0;

    defaultCategories: string[] = [

      'Transportation',
      'Groceries',
      'Entertainment',
      'Shopping',
      'Healthcare',
      'Education',
      'Bills & Utilities',
      'Food & Dining',
      'Unassigned'

    ];


    categories: string[] = [
      ...this.defaultCategories
    ];


    expense = {
        amount: null as number | null,
        category: '',
        date: '',
        paymentMethod: '',
        description: '',
        notes: ''
    };


  recentExpenses: any[] = [];


    showCategoryModal = false;

    showSuccess = false;

    newCategory = '';

    fileName = '';

  expenses: any[] = [];

  importSuccess = false;

  //Pagination
  updateRecentPagination(){

    this.recentTotalPages =

    this.paginationService.getTotalPages(

        this.recentExpenses,

        this.recentItemsPerPage

    );

    this.paginatedRecentExpenses =

    this.paginationService.paginate(

        this.recentExpenses,

        this.recentCurrentPage,

        this.recentItemsPerPage

    );

  }

  updatePreviewPagination(){

    this.previewTotalPages =

    this.paginationService.getTotalPages(

        this.expenses,

        this.previewItemsPerPage

    );

    this.paginatedPreviewExpenses =

    this.paginationService.paginate(

        this.expenses,

        this.previewCurrentPage,

        this.previewItemsPerPage

    );

  }

  changePage(type:'recent'|'preview', direction:number){

    if(type==='recent'){

        const next =

        this.recentCurrentPage + direction;

        if(

            next>=1 &&

            next<=this.recentTotalPages

        ){

            this.recentCurrentPage = next;

            this.updateRecentPagination();

        }

    }

    if(type==='preview'){

        const next =

        this.previewCurrentPage + direction;

        if(

            next>=1 &&

            next<=this.previewTotalPages

        ){

            this.previewCurrentPage = next;

            this.updatePreviewPagination();

        }

    }

  }

  onRecentPageChange(page:number){

    this.recentCurrentPage = page;

    this.updateRecentPagination();

  }

  onPreviewPageChange(page:number){

    this.previewCurrentPage = page;

    this.updatePreviewPagination();

  }


  
  selectedDataTrue() {

    this.selectedData = 0;

  }

  selectedDataFalse() {

    this.selectedData = 1;

  }

  ngOnInit(): void {

    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    },250);

    this.loadRecentExpenses();

    this.loadCategories();

  }

    //Recent Expense
    loadRecentExpenses() {

    this.expenseService
        .getExpenses()
        .subscribe({

            next: (res: any) => {


              this.recentExpenses = res.expenses || [];

              this.recentCurrentPage = 1;
                          
              this.updateRecentPagination();

            },

            error: (err: any) => {

                console.error(
                    'GET EXPENSE ERROR:',
                    err
                );

            }

        });

    }

    //Categories
    loadCategories() {

        this.categoryService
        .getCategories()
        .subscribe({

          next: (res: any) => {

            const customCategories =
              res.categories.map(
                (category: any) =>
                  category.name
              );

            this.categories = [

              ...this.defaultCategories,

              ...customCategories

            ];

          },

          error: (err: any) => {

            console.error(
              'GET CATEGORY ERROR:',
              err
            );

          }

        });

    }

    // Selected File
  onFileSelected(event: any): void {

    const file: File = event.target.files[0];

    if (!file) {
      return;
    }

    this.fileName = file.name;

    Papa.parse(file, {

      header: true,

      skipEmptyLines: true,

      complete: (result: any) => {

        this.expenses =
          result.data.map((row: any) => ({
          
            amount:
              Number(row.Amount),
          
            category:
              row.Category?.trim(),
          
            date:
              row.Date,
          
            paymentMethod:
              row.PaymentMethod?.trim(),
          
            description:
              row.Description?.trim() || '',
          
            notes:
              row.Notes?.trim() || ''
          
          }));

          this.expenses = [...this.expenses];

          this.previewCurrentPage = 1;

          this.updatePreviewPagination();
        
        console.log(
          'CSV EXPENSES:',
          this.expenses
        );
      
      },

      error: (error) => {

        console.error(error);

        alert("Unable to read CSV file.");

      }

    });

  }

  //Expense Import
  importExpenses() {

    if (this.expenses.length === 0) {

      Swal.fire({
      
        title: 'Updated',

        html:`<i class="fa-solid fa-triangle-exclamation custom-alert-icon profile-success-popup-icon"></i>
        <p>Please select a CSV file first.</p>`,

        showConfirmButton:false,

        timer:1800,

        customClass: {

          popup: 'profile-success-popup',

          title: 'profile-success-popup-title',

          confirmButton: 'profile-success-popup-confirm'

        },

        buttonsStyling: false

      });
    
      return;
    
    }
  
  
    this.expenseService
      .importExpenses(this.expenses)
      .subscribe({
      
        next: (res: any) => {
        
          console.log(
            'IMPORT RESPONSE:',
            res
          );
        
        
          this.importSuccess = true;
        
        
          // Add imported expenses to
          // recent expenses list
        
          this.recentExpenses = [

            ...res.expenses,
                  
            ...this.recentExpenses

          ];

          this.recentCurrentPage = 1;

          this.updateRecentPagination();
        
        
          // Clear selected file
        
          this.fileName = '';
        
          this.expenses = [];
        
        
          // Hide success message
          setTimeout(() => {
          
            this.importSuccess = false;
          
          }, 3000);
        
        },
      
      
        error: (err: any) => {
        
          console.error(
            'IMPORT ERROR:',
            err
          );
        
          alert(
            err.error?.message ||
            'Failed to import expenses'
          );
        
        }
      
      });
    
  }

    //Finish Import
    finishImport(
      successCount: number,
      failedCount: number
    ) {

      this.importedCount = successCount;
      this.failedImportCount = failedCount;

      this.importSuccess = true;

      this.loadRecentExpenses();

      setTimeout(() => {

        this.importSuccess = false;

      }, 3000);

    }

    //Cancel Import
  cancelImport() {

    this.fileName = '';

    this.expenses = [];

    this.importSuccess = false;

  }

    constructor(private expenseService: ExpenseService, private categoryService: CategoryService, public loadingService:LoadingService, private paginationService: PaginationService) {
        this.setTodayDate();
    }


    setTodayDate() {

        const today = new Date();

        this.expense.date =
            today.toISOString().split('T')[0];

    }


    openCategoryModal() {

        this.showCategoryModal = true;

    }


    closeCategoryModal() {

        this.showCategoryModal = false;

        this.newCategory = '';

    }

    //ADD Category
    addCategory() {

      const category = this.newCategory.trim();
        
      if (!category) {
        return;
      }
  
      const exists = this.categories.some(
        item =>
          item.toLowerCase() ===
          category.toLowerCase()
      );
  
      if (exists) {
    
        alert('Category already exists.');
        return;
    
      }
      
      this.categoryService
        .addCategory(category)
        .subscribe({
        
          next: (res: any) => {
        
            this.categories.push(
              res.category.name
            );
        
            this.expense.category =
              res.category.name;
        
            this.closeCategoryModal();
        
          },
      
          error: (err: any) => {
        
            alert(
              err.error?.message ||
              'Failed to create category'
            );
        
          }
      
        });
    
    }

    // To ADD Expense
    addExpense() {

    if (
        !this.expense.amount ||
        !this.expense.category ||
        !this.expense.date ||
        !this.expense.paymentMethod
    ) {

        alert('Please fill all required fields.');
        return;

    }

    this.expenseService
        .addExpense(this.expense)
        .subscribe({

            next: (res: any) => {

                console.log(
                    'EXPENSE SAVED:',
                    res
                );

                // MongoDB expense
                this.recentExpenses.unshift(
                    res.expense
                );

                this.recentCurrentPage = 1;

                this.updateRecentPagination();

                // Your existing success popup
                this.showSuccess = true;

                setTimeout(() => {

                    this.showSuccess = false;

                }, 3000);

                this.resetForm();

            },

            error: (err: any) => {

                console.error(
                    'ADD EXPENSE ERROR:',
                    err
                );

                alert(
                    err.error?.message ||
                    'Failed to add expense'
                );

            }

        });

    }

    //To DELETE Expense
    deleteExpense(id: string) {

        this.expenseService.deleteExpense(id)
        .subscribe({

            next: (res: any) => {
                this.recentExpenses =
                    this.recentExpenses.filter(
                        expense =>
                            expense._id !== id
                    );

                    this.updateRecentPagination();

                console.log(res.message);

                this.showDeletePopUp = true;;

                this.loadRecentExpenses();
                
                setTimeout(() => {

                    this.showDeletePopUp = false;

                }, 3000);
            },
            error: (err) => {
                console.error(
                    'DELETE ERROR:',
                    err
                );
                alert(
                    err.error?.message ||
                    'Failed to delete expense'
                );
            }
        });

    }

    //Form Reset
    resetForm() {

        this.expense = {

            amount: null,

            category: '',

            date: '',

            paymentMethod: '',

            description: '',

            notes: ''

        };


        this.setTodayDate();

    }
}
