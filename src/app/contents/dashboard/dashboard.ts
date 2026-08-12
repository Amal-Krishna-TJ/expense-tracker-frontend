import { Component } from '@angular/core';
import { AuthService } from '../../auth/services/auth';
import { DashboardService } from '../../services/dashboard';
import { LoadingService } from '../../services/loading';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

  value = localStorage.getItem('loggedInUser');

  summary: any = {
    totalExpense: 0,
    todayExpense: 0,
    thisMonthExpense: 0,
    transactionCount: 0,
    largestExpense: 0,
    topCategory: '',
    recentTransactions: [],
    weeklyChart: []
  };

  isAdmin = this.user.role === 'admin';

  displayTotalExpense = 0;
  displayThisMonthExpense = 0;
  displayTransactionCount = 0;
  displayTodayExpense = 0;

  barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Weekly Expense',
        data: [0, 0, 0, 0, 0, 0, 0]
      }
    ]
  };

  constructor(private authService: AuthService, private dashboardService: DashboardService, public loadingService:LoadingService) {}

  get greeting() {

    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good Morning';
    }

    if (hour < 16) {
      return 'Good Afternoon';
    }

    return 'Good Evening';

  }

  animateNumber(target: number,callback: (value: number) => void) {

    let current = 0;

    const increment = target / 80;

    const timer = setInterval(() => {

      current += increment;

      if (current >= target) {

        callback(target);

        clearInterval(timer);

      } else {

        callback(Math.round(current));

      }

    }, 30);

  }

  ngOnInit(): void {

    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    },250);

    this.loadDashboard();

    //To Get Profiles
    this.authService.getProfile().subscribe({

      next: (res) => {
        console.log(res);
      },

      error: (err) => {
        console.log(err);
      }

    });
  }

  loadDashboard() {

    this.dashboardService
      .getDashboard()
      .subscribe({

        next: (res: any) => {

          this.summary = res.summary;

          this.animateNumber(this.summary.totalExpense, value => this.displayTotalExpense = value);

          this.animateNumber(this.summary.thisMonthExpense, value => this.displayThisMonthExpense = value);

          this.animateNumber(this.summary.transactionCount, value => this.displayTransactionCount = value);

          this.animateNumber(this.summary.todayExpense, value => this.displayTodayExpense = value);

          this.updateChart();

        },

        error: err => {

          console.error(err);

        }

      });

  }

  updateChart() {

    this.barChartData.datasets[0].data = this.summary.weeklyChart;

  }
}
