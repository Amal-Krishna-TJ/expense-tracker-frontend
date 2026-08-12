import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile';
import { AdminService } from '../../services/admin';
import { ChartData, ChartConfiguration } from 'chart.js';
import Swal from 'sweetalert2';
import { LoadingService } from '../../services/loading';
import { PaginationService } from '../../services/pagination';

interface ExpenseSummary {
  totalExpense: number;
  transactions: number;
  highestCategory: string;
  largestExpense: number;
  averageExpense: number;
  currentMonth: number;
}

interface RecentExpense {
  category: string;
  amount: number;
  date: string;
}

interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  occupation: string;
  avatar: string;
  heroColor: string;
  summary: ExpenseSummary;
  recentExpenses: RecentExpense[];
}

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  value = localStorage.getItem('loggedInUser');

  analytics:any={};

  profile:any = {};

  paginatedUsers:any=[];
  
  currentPage=1;
  
  itemsPerPage=10;
  
  totalPages=0;

  dashboard = {

    totalUsers: 0,

    totalExpenses: 0,

    totalBudgets: 0,

    totalCategories: 0,

    totalRecurring: 0,

    monthlyExpense: 0

  };

  user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

  isAdmin = this.user.role === 'admin';

  displayTotalUsers = 0;
  displayTotalTransactionns = 0;
  displayTotalExpense = 0;
  displayAverageExpense = 0;
  displayTotalBudgets = 0;
  displayTotalRecurring = 0;
  displayTotalCategories = 0;
  displayThisMonthExpense = 0;

  constructor(private profileService:ProfileService, private adminService: AdminService, public loadingService:LoadingService, private paginationService: PaginationService){}

//Avatar
avatars = [

  '/MProfile1.png',
  '/MProfile2.png',
  '/MProfile3.png',
  '/MProfile4.png',
  '/MProfile5.png',

  '/FProfile1.png',
  '/FProfile2.png',
  '/FProfile3.png',
  '/FProfile4.png',
  '/FProfile5.png'

];

//Hero colors
heroColors = [

  '#003049',
  '#F77F00',
  '#00BF7C',
  '#6C63FF',
  '#E63946'

];

  pieChartType: 'pie' = 'pie';

  pieChartData: ChartData<'pie'> = {

    labels: [

      'Groceries',

      'Transportation',

      'Shopping',

      'Healthcare',

      'Entertainment',

      'Others'

    ],

    datasets: [

      {

        data: [

          32000,

          21000,

          17000,

          14000,

          9000,

          7000

        ],

        backgroundColor: [

          '#003049',
          
          '#F77F00',

          '#00BF7C',

          '#6C63FF',

          '#FF4D6D',

          '#8D99AE'

        ]

      }

    ]

  };

  pieChartOptions:ChartConfiguration<'pie'>['options'] = {

    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      mode: 'nearest',
      intersect: true
    },

    plugins: {

      legend: {
        position: 'bottom'
      }

    }

  };

  barChartType: 'bar' = 'bar';

  barChartData: ChartData<'bar'> = {

  labels: [

    'Jan',

    'Feb',

    'Mar',

    'Apr',

    'May',

    'Jun',

    'Jul'

  ],

  datasets: [

    {

      label: 'Monthly Expense',

      data: [

        18000,

        24000,

        32000,

        21000,

        25000,

        27000,

        29000

      ],

      backgroundColor: [
        '#F77F00',
        '#F77F00',
        '#F77F00',
        '#F77F00',
        '#F77F00',
        '#F77F00',
        '#F77F00'
      ],

      hoverBackgroundColor: '#F77F00',

      borderRadius: 8

    }

  ]

  };

  barChartOptions:ChartConfiguration<'bar'>['options'] = {

  responsive: true,

  maintainAspectRatio: false,

  onHover: (event, activeElements, chart) => {

    const dataset = chart.data.datasets[0];

    const originalColors = [
      '#F77F00',
      '#F77F00',
      '#F77F00',
      '#F77F00',
      '#F77F00',
      '#F77F00',
      '#F77F00'
    ];

    if (activeElements.length) {

      const hovered = activeElements[0].index;

      (dataset as any).backgroundColor = originalColors.map((color, index) =>
        index === hovered
        ? '#fe8a0f'
        : '#ff84007e'
      );

    } else {

      dataset.backgroundColor = [...originalColors];

    }

    chart.update('none');
  },

  plugins: {

    legend: {

      display: false

    }

  },

  scales: {

    y: {

      beginAtZero: true

    }

  },

  interaction: {
      mode: 'nearest',
      intersect: true
    },

    hover: {
      mode: 'nearest'
    },

  };

  lineChartType:'line'='line';

  lineChartData:ChartData<'line'>={
    
    labels:[
    
    'Week 1',
    
    'Week 2',
    
    'Week 3',
    
    'Week 4'
    
    ],

    datasets:[
    
    {
    
      label:'Expense Trend',
      
      data:[
      
      4800,
      
      7200,
      
      6500,
      
      9100
      
      ],

      fill:true,

      borderColor:'#003049',

      backgroundColor:'rgba(0,48,73,.15)',

      tension:.4

    }

    ]

  };

  lineChartOptions:ChartConfiguration<'line'>['options']={
    
    responsive:true,
    
    maintainAspectRatio:false
    
  };

  editMode = false;

  expandedUser: string | null = null;

  //Users
  users:any[] = [];

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

  updateUsersPagination(){

    this.totalPages =

    this.paginationService.getTotalPages(

        this.users,

        this.itemsPerPage

    );

    this.paginatedUsers =

    this.paginationService.paginate(

        this.users,

        this.currentPage,

        this.itemsPerPage

    );

  }

  onPageChange(page:number){

    this.currentPage = page;

    this.updateUsersPagination();

  }

  ngOnInit() {

    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    },250);

    if (this.value) {

      const loggedInUser = JSON.parse(this.value);

      if (loggedInUser.role === "admin") {

        this.loadDashboard();

        this.loadUsers();

        this.loadAnalytics();

      } else {

        this.loadProfile();

      }

    }

  }

  loadAnalytics(){

    this.adminService

    .getAnalytics()

    .subscribe({

        next:(res:any)=>{

            this.analytics =
                res.analytics;

            this.generatePieChart();

            this.generateBarChart();

            this.generateLineChart();

        }

    });

  }

  loadProfile(){

    this.profileService

    .getProfile()

    .subscribe({

        next:(res:any)=>{

            this.profile = {

                fullName: res.user.fullName,

                username: res.user.username,

                email: res.user.email,

                phone: res.user.phone,

                occupation: res.user.occupation,

                avatar: res.user.avatar,

                heroColor: res.user.heroColor

            };

        },

        error:(err)=>{

            console.log(err);

        }

    });

  }

  loadDashboard(){

    this.adminService.getDashboard().subscribe({

      next:(res:any)=>{

        this.dashboard = res.dashboard;

      },

      error:(err)=>{

        console.error(err);

      }

    });

  }

  loadUsers(){

    this.adminService.getUsers().subscribe({

      next:(res:any)=>{

        this.users = res.users.filter((user:any) => user.role !== 'admin');

        this.animateNumber(this.dashboard.totalUsers, value => this.displayTotalUsers = value);

        this.animateNumber(this.totalTransactions, value => this.displayTotalTransactionns = value);
        
        this.animateNumber(this.dashboard.totalExpenses, value => this.displayTotalExpense = value);

        this.animateNumber(this.averageExpense, value => this.displayAverageExpense = value);

        this.animateNumber(this.dashboard.totalBudgets, value => this.displayTotalBudgets = value);

        this.animateNumber(this.dashboard.totalRecurring, value => this.displayTotalRecurring = value);
        
        this.animateNumber(this.dashboard.totalCategories, value => this.displayTotalCategories = value);

        this.animateNumber(this.dashboard.monthlyExpense, value => this.displayThisMonthExpense = value);

        this.currentPage = 1;
              
        this.updateUsersPagination();

      },

      error:(err)=>{

        console.error(err);

      }

    });

  }

  generatePieChart(){

    this.pieChartData={

        labels:Object.keys(

            this.analytics.categoryTotals

        ),

        datasets:[{

            data:Object.values(

                this.analytics.categoryTotals

            ),

            backgroundColor:[

                '#003049',

                '#F77F00',

                '#00BF7C',

                '#6C63FF',

                '#E63946',

                '#8D99AE'

            ]

        }]

    };

  }

  generateBarChart(){

    this.barChartData={

        labels:Object.keys(

            this.analytics.monthlyTotals

        ),

        datasets:[{

            label:'Monthly Expense',

            data:Object.values(

                this.analytics.monthlyTotals

            ),

            backgroundColor:'#F77F00',

            borderRadius:8

        }]

    };

  }

  generateLineChart(){

    this.lineChartData={

        labels:Object.keys(

            this.analytics.userRegistrations

        ),

        datasets:[{

            label:'Users',

            data:Object.values(

                this.analytics.userRegistrations

            ),

            borderColor:'#003049',

            backgroundColor:'rgba(0,48,73,.15)',

            fill:true,

            tension:.4

        }]

    };

  }

//GET Total Transsactions
  get totalTransactions(): number {

  return this.users.reduce(
    (sum, user) => sum + user.summary.transactions,
    0
  );

}

// GET Total Expense
get totalExpense(): number {

  return this.users.reduce(
    (sum, user) => sum + user.summary.totalExpense,
    0
  );

}

// GET Average Expense
get averageExpense(): number {

  if (!this.users.length) return 0;

  return Math.round(this.totalExpense / this.users.length);

}

  toggleCard(id: string): void {
    this.expandedUser = this.expandedUser === id ? null : id;
  }

  isExpanded(id: string): boolean {
    return this.expandedUser === id;
  }
  // DELETE User
  deleteUser(id:string, username: string){

  Swal.fire({

    title: `Delete User ${username}?`,

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

      this.adminService

        .deleteUser(id)

        .subscribe({

          next: () => {

            this.loadUsers();

            this.loadDashboard();

            Swal.fire({

              title: 'Deleted!',

              html:`<i class="fa-regular fa-circle-check custom-alert-icon profile-success-popup-icon"></i>
              <p>User deleted successfully.</p>`,

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

  editProfile() {
    this.editMode = true;
  }

  selectAvatar(avatar: string) {

    this.profile.avatar = avatar;

  }

  changeHeroColor(color: string) {

    this.profile.heroColor = color;

  }
// Save profile
  saveProfile(){

    this.profileService

    .updateProfile(this.profile)

    .subscribe({

        next:(res:any)=>{

            this.profile = res.user;

            this.editMode = false;

            Swal.fire({

              title: 'Updated',

              html:`<i class="fa-regular fa-circle-check custom-alert-icon profile-success-popup-icon"></i>
              <p>Profile Updated Successfully.</p>`,

              showConfirmButton:false,

              timer:1800,

              customClass: {

                popup: 'profile-success-popup',

                title: 'profile-success-popup-title',

                confirmButton: 'profile-success-popup-confirm'

              },

              buttonsStyling: false

            });

        },

        error:(err)=>{

            console.log(err);

            alert("Failed to update profile.");

        }

    });

}

  cancelEdit() {
    this.editMode = false;
  }
}
