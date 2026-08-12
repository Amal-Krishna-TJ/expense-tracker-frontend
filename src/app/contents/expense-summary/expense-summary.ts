import { Component, OnInit } from '@angular/core';
import { ActiveElement, Chart, ChartConfiguration, ChartData, ChartEvent } from 'chart.js';
import { ExpenseService } from '../../services/expense';
import { LoadingService } from '../../services/loading';

@Component({
  selector: 'app-expense-summary',
  standalone: false,
  templateUrl: './expense-summary.html',
  styleUrl: './expense-summary.css',
})
export class ExpenseSummary implements OnInit{
  value = localStorage.getItem('loggedInUser');
  selectedView = 'all';

  selectedMonth = 'July';

  selectedYear = 2026;

  averageDailyExpense = 0;

  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  years = [2023, 2024, 2025, 2026];

  totalExpense = 0;
  transactionCount = 0;
  highestCategory = 'N/A';
  averageExpense = 0;
  highestMonth = 'N/A';
  largestExpense = 0;
  comparison = 0;

  expenses: any[] = [];

  filteredExpenses: any[] = [];

  ngOnInit(): void {

    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    },250);

    this.loadExpenses();

  }

  //Calculation on comparison percentage
  calculateComparison() {

  let currentExpenses: any[] = [];
  let previousExpenses: any[] = [];

  // =========================
  // MONTHLY
  // =========================

  if (this.selectedView === 'month') {

    const currentMonthIndex =
      this.months.indexOf(this.selectedMonth);

    const currentYear =
      Number(this.selectedYear);

    let previousMonthIndex =
      currentMonthIndex - 1;

    let previousYear =
      currentYear;

    // January -> December previous year
    if (previousMonthIndex < 0) {

      previousMonthIndex = 11;

      previousYear--;

    }

    // Current selected month
    currentExpenses =
      this.expenses.filter(expense => {

        const date =
          new Date(expense.date);

        return (
          date.getMonth() === currentMonthIndex &&
          date.getFullYear() === currentYear
        );

      });


    // Previous month
    previousExpenses =
      this.expenses.filter(expense => {

        const date =
          new Date(expense.date);

        return (
          date.getMonth() === previousMonthIndex &&
          date.getFullYear() === previousYear
        );

      });

  }


  // =========================
  // YEARLY
  // =========================

  else if (this.selectedView === 'year') {

    const currentYear =
      Number(this.selectedYear);

    const previousYear =
      currentYear - 1;


    currentExpenses =
      this.expenses.filter(expense => {

        const date =
          new Date(expense.date);

        return (
          date.getFullYear() === currentYear
        );

      });


    previousExpenses =
      this.expenses.filter(expense => {

        const date =
          new Date(expense.date);

        return (
          date.getFullYear() === previousYear
        );

      });

  }


  // =========================
  // ALL TIME
  // =========================

  else {

    this.comparison = 0;

    return;

  }


  // TOTAL CURRENT PERIOD

  const currentTotal =
    currentExpenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount),
      0
    );


  // TOTAL PREVIOUS PERIOD

  const previousTotal =
    previousExpenses.reduce(
      (sum, expense) =>
        sum + Number(expense.amount),
      0
    );


  console.log(
    'CURRENT TOTAL:',
    currentTotal
  );

  console.log(
    'PREVIOUS TOTAL:',
    previousTotal
  );

  console.log(
    'CURRENT EXPENSES:',
    currentExpenses
  );

  console.log(
    'PREVIOUS EXPENSES:',
    previousExpenses
  );


  // No previous-period expenses

  if (previousTotal === 0) {

    this.comparison = 0;

    return;

  }


  // Percentage change

  this.comparison =
    Math.round(
      (
        (currentTotal - previousTotal)
        /
        previousTotal
      ) * 100
    );


  console.log(
    'COMPARISON:',
    this.comparison + '%'
  );

  }

  //Loading expenses
  loadExpenses() {

  this.expenseService
    .getExpenses()
    .subscribe({

      next: (res: any) => {

        this.expenses =
          res.expenses || [];

        this.updateAvailableYears();

        // Initially show all expenses
        this.filteredExpenses = [
          ...this.expenses
        ];

        this.calculateSummary(
          this.filteredExpenses
        );

        this.updateCharts(
          this.filteredExpenses
        );

        this.calculateComparison(); 

      },

      error: (err: any) => {

        console.error(
          'SUMMARY LOAD ERROR:',
          err
        );

      }

    });

  }

  //Summary calculation
  calculateSummary(expenses: any[]) {

    if (expenses.length === 0) {

      this.totalExpense = 0;
      this.transactionCount = 0;
      this.highestCategory = 'N/A';
      this.averageExpense = 0;
      this.averageDailyExpense = 0;
      this.highestMonth = 'N/A';
      this.largestExpense = 0;
      this.comparison = 0;
        
      return;
    }
    

    // TOTAL
    this.totalExpense = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount),
    0
    );

    // =========================
    // AVERAGE DAILY EXPENSE
    // =========================

    const uniqueDays = new Set(
    
      expenses.map(expense => {
      
        const date = new Date(expense.date);
      
        return date.toISOString().split('T')[0];
      
      })
    
    );

    this.averageDailyExpense =
      uniqueDays.size > 0
        ? Math.round(
            this.totalExpense /
            uniqueDays.size
          )
        : 0;


    // TRANSACTIONS
    this.transactionCount =
      expenses.length;


    // AVERAGE
    this.averageExpense =
      Math.round(
      this.totalExpense /
      this.transactionCount
      );


    // LARGEST EXPENSE
    this.largestExpense =
      Math.max(
      ...expenses.map(
        expense =>
          Number(expense.amount)
      )
      );


    // CATEGORY TOTALS
    const categoryTotals:
      Record<string, number> = {};


    expenses.forEach(expense => {

    const category =
      expense.category || 'Unassigned';

    categoryTotals[category] =
      (categoryTotals[category] || 0)
      + Number(expense.amount);

    });


    this.highestCategory =
      Object.keys(categoryTotals)
        .reduce(
        (highest, category) =>
          categoryTotals[category] >
          categoryTotals[highest]
            ? category
            : highest
        );


    // MONTH TOTALS
    const monthTotals =
      new Array(12).fill(0);


    expenses.forEach(expense => {

    const date =
      new Date(expense.date);

    if (!isNaN(date.getTime())) {

      monthTotals[
        date.getMonth()
      ] += Number(expense.amount);

    }

    });


    const highestMonthIndex =
      monthTotals.indexOf(
      Math.max(...monthTotals)
      );


    this.highestMonth =
      this.months[
        highestMonthIndex
      ];

  }

  //PIE Chart updation
  updatePieChart(expenses: any[]) {

    const categoryTotals:
      Record<string, number> = {};


    expenses.forEach(expense => {

      const category =
        expense.category || 'Unassigned';

      categoryTotals[category] =
        (categoryTotals[category] || 0)
        + Number(expense.amount);

    });


    const labels =
      Object.keys(categoryTotals);

    const values =
      Object.values(categoryTotals);


    const colors = [
      '#003049',
      '#F77F00',
      '#00BF7C',
      '#6C63FF',
      '#FF4D6D',
      '#8D99AE',
      '#FFD166',
      '#118AB2',
      '#EF476F',
      '#06D6A0'
    ];


    this.pieChartData = {

      labels,

      datasets: [
        {
          data: values,

          backgroundColor:
            labels.map(
              (_, index) =>
                colors[
                  index % colors.length
                ]
            )
        }
      ]

    };

  }

  //Available Years
  updateAvailableYears() {

  const expenseYears =
    this.expenses
      .map(expense => {

        return new Date(
          expense.date
        ).getFullYear();

      })
      .filter(year =>
        !isNaN(year)
      );


  this.years = [
    ...new Set(expenseYears)
  ].sort(
    (a, b) => b - a
  );

  }

  constructor(
    private expenseService: ExpenseService,
    public loadingService:LoadingService
  ) {}

  //Changing in views
  changeView() {

  // Reset month when switching views
  if (
    this.selectedView === 'month'
  ) {

    const currentMonth =
      new Date().getMonth();

    this.selectedMonth =
      this.months[currentMonth];

  }


  // Reset year
  if (
    this.selectedView !== 'all'
  ) {

    this.selectedYear =
      new Date().getFullYear();

  }

  }

  //Filter
  applyFilter() {

  // =========================
  // ALL TIME
  // =========================

  if (this.selectedView === 'all') {

    this.filteredExpenses = [
      ...this.expenses
    ];

  }


  // =========================
  // YEAR
  // =========================

  else if (
    this.selectedView === 'year'
  ) {

    this.filteredExpenses =
      this.expenses.filter(
        expense => {

          const date =
            new Date(expense.date);

          return (
            date.getFullYear() ===
            Number(this.selectedYear)
          );

        }
      );

  }


  // =========================
  // MONTH
  // =========================

  else if (
    this.selectedView === 'month'
  ) {

    const monthIndex =
      this.months.indexOf(
        this.selectedMonth
      );


    this.filteredExpenses =
      this.expenses.filter(
        expense => {

          const date =
            new Date(expense.date);

          return (

            date.getMonth() ===
              monthIndex &&

            date.getFullYear() ===
              Number(this.selectedYear)

          );

        }
      );

  }


  console.log(
    'FILTERED EXPENSES:',
    this.filteredExpenses
  );


  // Recalculate everything
  this.calculateSummary(
    this.filteredExpenses
  );

  this.updateCharts(
    this.filteredExpenses
  );

  this.calculateComparison();

  }

  //BAR Chart updation
  updateBarChart(expenses: any[]) {

    const monthlyTotals =
      new Array(12).fill(0);
    
    
    expenses.forEach(expense => {
    
      const date =
        new Date(expense.date);
    
      if (!isNaN(date.getTime())) {
      
        monthlyTotals[
          date.getMonth()
        ] += Number(expense.amount);
      
      }
    
    });
  
  
    this.barChartData = {
    
      labels: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ],
    
      datasets: [
      
        {
        
          label:
            'Monthly Expense',
        
          data:
            monthlyTotals,
        
          backgroundColor:
            new Array(12)
              .fill('#F77F00'),
        
          hoverBackgroundColor:
            '#F77F00',
        
          borderRadius: 8
        
        }
      
      ]
    
    };
  
  }

  //LINE Chart updation
  updateLineChart(expenses: any[]) {

  // MONTHLY VIEW → Weekly trend
  if (this.selectedView === 'month') {

    const weeklyTotals = [0, 0, 0, 0, 0];

    expenses.forEach(expense => {

      const date = new Date(expense.date);

      if (isNaN(date.getTime())) {
        return;
      }

      const day = date.getDate();

      // 1-7   = Week 1
      // 8-14  = Week 2
      // 15-21 = Week 3
      // 22-28 = Week 4
      // 29-31 = Week 5

      const weekIndex =
        Math.min(
          Math.floor((day - 1) / 7),
          4
        );

      weeklyTotals[weekIndex] +=
        Number(expense.amount);

    });


    this.lineChartData = {

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

          data: weeklyTotals,

          fill: true,

          borderColor: '#003049',

          backgroundColor:
            'rgba(0,48,73,.15)',

          tension: 0.4
        }

      ]

    };

  }


  // YEAR / ALL TIME → Monthly trend
  else {

    const monthlyTotals =
      new Array(12).fill(0);


    expenses.forEach(expense => {

      const date =
        new Date(expense.date);

      if (isNaN(date.getTime())) {
        return;
      }

      monthlyTotals[
        date.getMonth()
      ] += Number(expense.amount);

    });


    this.lineChartData = {

      labels: [
        'Jan', 'Feb', 'Mar',
        'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep',
        'Oct', 'Nov', 'Dec'
      ],

      datasets: [

        {
          label: 'Expense Trend',

          data: monthlyTotals,

          fill: true,

          borderColor: '#003049',

          backgroundColor:
            'rgba(0,48,73,.15)',

          tension: 0.4
        }

      ]

    };

  }

  }

  updateCharts(expenses: any[]) {

    this.updatePieChart(expenses);
    
    this.updateBarChart(expenses);

    this.updateLineChart(expenses);
    
  }

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

  pieChartOptions:
  ChartConfiguration<'pie'>['options'] = {

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

  barChartOptions:

  ChartConfiguration<'bar'>['options'] = {

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
}
