import { Component, OnInit } from '@angular/core';
import { BudgetService } from '../../services/budget';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingService } from '../../services/loading';

@Component({
  selector: 'app-budget',
  standalone: false,
  templateUrl: './budget.html',
  styleUrl: './budget.css',
})
export class Budget implements OnInit {
  value = localStorage.getItem('loggedInUser');

  budgets: any[] = [];

  totalBudgets = 0;

  totalBudgetAmount = 0;

  totalSpent = 0;

  remainingBudget = 0;

  budgetForm!: FormGroup;

  isEditMode = false;

  searchText = '';

  selectedMonth = new Date().getMonth() + 1;
  
  selectedBudgetId = '';
  
  categories = [
    'Food',
    'Travel',
    'Shopping',
    'Bills',
    'Health',
    'Education',
    'Entertainment',
    'Salary',
    'Other'
  ];

  constructor(private budgetService: BudgetService, private fb: FormBuilder, public loadingService:LoadingService) {}

  get filteredBudgets() {

    return this.budgets.filter(item =>

      item.category
        .toLowerCase()
        .includes(this.searchText.toLowerCase())

      &&

      item.month == this.selectedMonth

    );

  }

  loadBudgets() {

    this.budgetService.getBudgets().subscribe({

      next: (res) => {

        this.budgets = res;

        this.calculateSummary();

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  ngOnInit(): void {

    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    },250);

    this.budgetForm = this.fb.group({
    
      category: ['', Validators.required],
    
      amount: [null, [Validators.required, Validators.min(1)]],
    
      month: [new Date().getMonth() + 1],
    
      year: [new Date().getFullYear()]
    
    });
  
    this.loadBudgets();
  
  }

  openAddBudget() {

    this.isEditMode = false;

    this.selectedBudgetId = '';

    this.budgetForm.reset({

      month: new Date().getMonth() + 1,

      year: new Date().getFullYear()

    });

  }

  editBudget(item: any) {

    this.isEditMode = true;

    this.selectedBudgetId = item._id;

    this.budgetForm.patchValue({

      category: item.category,

      amount: item.amount,

      month: item.month,

      year: item.year

    });

  }

  saveBudget() {

    if (this.budgetForm.invalid) {

      this.budgetForm.markAllAsTouched();

      return;

    }

    const request = this.isEditMode
      ? this.budgetService.updateBudget(
          this.selectedBudgetId,
          this.budgetForm.value
        )
      : this.budgetService.createBudget(
          this.budgetForm.value
        );

    request.subscribe({

      next: () => {

        this.loadBudgets();

        alert(
          this.isEditMode
            ? 'Budget updated successfully.'
            : 'Budget created successfully.'
        );

      },

      error: (err) => {

        alert(
          err.error?.message || 'Something went wrong.'
        );

        console.log(err)

      }

    });

  }

  deleteBudget(id: string) {

    if (!confirm("Delete this budget?")) {
    
      return;
    
    }
  
    this.budgetService.deleteBudget(id)
  
    .subscribe(() => {
    
      this.loadBudgets();
    
    });
  
  }

  calculateSummary() {

    this.totalBudgets = this.budgets.length;

    this.totalBudgetAmount = this.budgets.reduce(

      (sum, budget) => sum + budget.amount,

      0

    );

    this.totalSpent = this.budgets.reduce(

      (sum, budget) => sum + budget.spent,

      0

    );

    this.remainingBudget = this.budgets.reduce(

      (sum, budget) => sum + budget.remaining,

      0

    );

  }
}
