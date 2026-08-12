import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/report';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { ChartData, ChartConfiguration } from 'chart.js';
import { LoadingService } from '../../services/loading';

@Component({
  selector: 'app-reports',
  standalone: false,
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports implements OnInit {
  value = localStorage.getItem('loggedInUser');

  filterMonth = new Date().getMonth();

  selectedMonth = this.filterMonth + 1;

  selectedYear = new Date().getFullYear();

  expenses:any[]=[];

  months = [
    "January","February","March","April",
    "May","June","July","August",
    "September","October","November","December"
  ];

  years = [2024,2025,2026];

  pieChartType:'pie'='pie';

  pieChartData:ChartData<'pie'>={

    labels:[],

  datasets:[

    {

      data:[],

      backgroundColor:[

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

  pieChartOptions:ChartConfiguration<'pie'>['options']={

    responsive:true,

    maintainAspectRatio:false,

    plugins:{

      legend:{

        position:'bottom'

      }

    }

  };

  barChartType:'bar'='bar';

  barChartData:ChartData<'bar'>={

    labels:[],

    datasets:[

        {

            label:'Expenses',

            data:[],

            backgroundColor:'#F77F00',

            borderRadius:8

        }

    ]

  };

  barChartOptions:ChartConfiguration<'bar'>['options']={

    responsive:true,

    maintainAspectRatio:false,

    plugins:{

        legend:{

            display:false

        }

    },

    scales:{

        y:{

            beginAtZero:true

        }

    }

  };

  lineChartType:'line'='line';

  lineChartData:ChartData<'line'>={

    labels:[],

    datasets:[

        {

            label:'Trend',

            data:[],

            borderColor:'#003049',

            backgroundColor:'rgba(0,48,73,.15)',

            fill:true,

            tension:.4

        }

    ]

  };

  lineChartOptions:ChartConfiguration<'line'>['options']={

    responsive:true,

    maintainAspectRatio:false

  };

  ngOnInit(){
    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    },250);
  }

  generatePieChart(){

    const totals:any={};

    this.expenses.forEach(expense=>{

        totals[expense.category]=

        (totals[expense.category]||0)

        +expense.amount;

    });

    this.pieChartData={

        labels:Object.keys(totals),

        datasets:[{

            data:Object.values(totals) as number[],

            backgroundColor:[

                '#003049',

                '#F77F00',

                '#00BF7C',

                '#6C63FF',

                '#FF4D6D',

                '#8D99AE'

            ]

        }]

    };

  }

  generateBarChart(){

    const totals:any={};

    this.expenses.forEach(expense=>{

        const day=

        new Date(expense.date)

        .getDate();

        totals[day]=

        (totals[day]||0)

        +expense.amount;

    });

    this.barChartData={

        labels:Object.keys(totals),

        datasets:[

            {

                label:'Daily Expense',

                data:Object.values(totals) as number[],

                backgroundColor:'#F77F00',

                borderRadius:8

            }

        ]

    };

  }

  generateLineChart(){

    const totals:any={};

    this.expenses.forEach(expense=>{

        const week=

        Math.floor(

            (new Date(expense.date).getDate()-1)

            /7

        )+1;

        totals[week]=

        (totals[week]||0)

        +expense.amount;

    });

    this.lineChartData={

        labels:Object.keys(totals).map(

            week=>`Week ${week}`

        ),

        datasets:[

            {

                label:'Expense Trend',

                data:Object.values(totals) as number[],

                borderColor:'#003049',

                backgroundColor:'rgba(0,48,73,.15)',

                fill:true,

                tension:.4

            }

        ]

    };

  }

  constructor(private reportService: ReportService, public loadingService:LoadingService){}

  calculateSummary(){

    const totalExpense =
    this.expenses.reduce(

        (sum,expense)=>

        sum+expense.amount,

        0

    );

    const transactions =
    this.expenses.length;

    const categoryTotals:any={};

    this.expenses.forEach(expense=>{

        categoryTotals[expense.category]=

        (categoryTotals[expense.category]||0)

        +expense.amount;

    });

    const highestCategory=

    Object.keys(categoryTotals)

    .reduce(

        (a,b)=>

        categoryTotals[a]>

        categoryTotals[b]

        ?a:b

    );

    const largestExpense=

    Math.max(

        ...this.expenses.map(

            expense=>expense.amount

        )

    );

    return{

        totalExpense,

        transactions,

        highestCategory,

        largestExpense,

        categoryTotals

    };

  }

  loadReport(){

    this.reportService

    .getExpenses()

    .subscribe({

        next:(res:any)=>{

          console.log("Selected Month:", this.selectedMonth);
          console.log("Selected Year:", this.selectedYear);

          res.expenses.forEach((expense: any) => {
          
              const date = new Date(expense.date);
          
              console.log({
                  description: expense.description,
                  expenseDate: expense.date,
                  month: date.getMonth() + 1,
                  year: date.getFullYear()
              });
            
          });

            this.expenses =
            res.expenses.filter(

                (expense:any)=>{

                    const date =
                    new Date(expense.date);

                    return (

                        date.getMonth()+1 ===
                        this.selectedMonth

                        &&

                        date.getFullYear() ===
                        this.selectedYear

                    );

                }

            );

            console.log("Filtered Expenses:", this.expenses);

            this.generatePieChart();

            this.generateBarChart();

            this.generateLineChart();

            this.pieChartData = {
                ...this.pieChartData
            };

            this.barChartData = {
                ...this.barChartData
            };

            this.lineChartData = {
                ...this.lineChartData
            };

        },
        error:(err:any)=>{

            console.error("Error fetching expenses:", err);

        }

    });

    console.log("Error");

  }

  async getChartImage(chartId: string): Promise<string | null> {

    const chart = document.getElementById(chartId);
    
    if (!chart) {
    
      return null;
    
    }
  
    const canvas = await html2canvas(chart as HTMLElement);
  
    return canvas.toDataURL("image/png");
  
  }

  async downloadPDF(){

    if(this.expenses.length===0){

        alert("Generate report first.");

        return;

    }

    const summary=this.calculateSummary();

    const pdf=new jsPDF();

    const monthName = this.months[this.selectedMonth - 1];

    pdf.setFontSize(24);

    pdf.setTextColor(0,48,73);

    pdf.text("Expense Tracker",14,20);

    pdf.setFontSize(17);

    pdf.setTextColor(247,127,0);

    pdf.text(
        `${monthName} ${this.selectedYear} Expense Report`,
        14,
        32
    );

    pdf.setTextColor(0);

    pdf.setFontSize(11);

    pdf.text(
        `Generated on ${new Date().toLocaleString()}`,
        14,
        42
    );

    pdf.setDrawColor(247,127,0);

    pdf.setLineWidth(.8);

    pdf.line(14,48,195,48);

    pdf.setFillColor(245,247,250);

    pdf.roundedRect(
        14,
        55,
        181,
        40,
        4,
        4,
        "F"
    );

    pdf.setFontSize(15);

    pdf.setTextColor(0,48,73);

    pdf.text("Summary",20,65);

    pdf.setFontSize(11);

    pdf.setTextColor(0);

    pdf.text(
        `Total Expense : ₹${summary.totalExpense}`,
        20,
        75
    );

    pdf.text(
        `Transactions : ${summary.transactions}`,
        20,
        82
    );

    pdf.text(
        `Highest Category : ${summary.highestCategory}`,
        105,
        75
    );

    pdf.text(
        `Largest Expense : ₹${summary.largestExpense}`,
        105,
        82
    );

    const pieImage = await this.getChartImage('expensePieChart');

    if (pieImage) {
    
      pdf.setFontSize(16);
    
      pdf.text("Category Distribution", 14, 95);
    
      pdf.addImage(
      
        pieImage,
      
        'PNG',
      
        14,
      
        100,
      
        80,
      
        80
      
      );
    
    }

    autoTable(pdf,{

      startY:190,

      theme:'grid',

      head:[[
          "Date",
          "Category",
          "Amount",
          "Payment"
      ]],

      styles:{
          fontSize:10
      },

      headStyles:{
          fillColor:[0,48,73],
          textColor:255
      },

      alternateRowStyles:{
          fillColor:[248,248,248]
      },

      body:this.expenses.map(expense=>([
          new Date(expense.date).toLocaleDateString(),
          expense.category,
          `₹${expense.amount}`,
          expense.paymentMethod
      ]))

    });

    let y=(pdf as any).lastAutoTable.finalY+15;

    pdf.setFillColor(255,252,244);

    pdf.roundedRect(
        14,
        y,
        181,
        55,
        4,
        4,
        "F"
    );

    pdf.setFontSize(15);

    pdf.setTextColor(0,48,73);

    pdf.text(
        "Category Summary",
        20,
        y+12
    );

    const barImage = await this.getChartImage('expenseBarChart');

    if (barImage) {
    
      pdf.addPage();
  
      pdf.setFontSize(18);
  
      pdf.text("Monthly Spending", 14, 20);
  
      pdf.addImage(
      
          barImage,
      
          'PNG',
      
          15,
      
          30,
      
          170,
      
          90
      
      );
    
    }

    const lineImage = await this.getChartImage('expenseLineChart');

    if (lineImage) {

      pdf.addPage();

      pdf.setFontSize(18);

      pdf.text("Expense Trend", 14, 20);

      pdf.addImage(
      
          lineImage,
      
          'PNG',
      
          15,
      
          30,
      
          170,
      
          90
      
      );
    
    }

    pdf.setFontSize(11);

    pdf.setTextColor(0);

    let line=y+22;

    Object.keys(summary.categoryTotals).forEach(category=>{
    
        pdf.text(
            category,
            20,
            line
        );
      
        pdf.text(
            `₹${summary.categoryTotals[category]}`,
            150,
            line
        );
      
        line+=8;
      
    });

    pdf.setFontSize(10);

    pdf.text(

        "Generated by Expense Tracker",

        14,

        y+15

    );

    const pages = pdf.getNumberOfPages();

    for(let i=1;i<=pages;i++){
    
      pdf.setPage(i);
  
      pdf.setDrawColor(220);
  
      pdf.line(
          14,
          287,
          195,
          287
      );
    
      pdf.setFontSize(9);
    
      pdf.setTextColor(120);
    
      pdf.text(
          "Generated by Expense Tracker",
          14,
          293
      );
    
      pdf.text(
          `Page ${i} of ${pages}`,
          175,
          293
      );
      
    }

    pdf.save("Expense_Report.pdf");

  }

  downloadExcel() {

    if (this.expenses.length === 0) {

        alert("Generate report first.");

        return;

    }

    const summary = this.calculateSummary();

    const excelData = this.expenses.map(expense => ({

        Date: new Date(expense.date).toLocaleDateString(),

        Category: expense.category,

        Amount: expense.amount,

        Payment_Method: expense.paymentMethod,

        Description: expense.description,

        Notes: expense.notes

    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Expenses"

    );

    XLSX.writeFile(

        workbook,

        `Expense_Report_${this.selectedMonth}_${this.selectedYear}.xlsx`

    );

    const summarySheet = XLSX.utils.json_to_sheet([{

      Total_Expense: summary.totalExpense,

      Transactions: summary.transactions,

      Highest_Category: summary.highestCategory,

      Largest_Expense: summary.largestExpense

  }]);

  const categoryData = Object.keys(summary.categoryTotals).map(category => ({

    Category: category,

    Total: summary.categoryTotals[category]

  }));

  const categorySheet = XLSX.utils.json_to_sheet(categoryData);

  XLSX.utils.book_append_sheet(

    workbook,

    worksheet,

    "Expenses"

    );

    XLSX.utils.book_append_sheet(
    
        workbook,
    
        summarySheet,
    
        "Summary"
    
    );

    XLSX.utils.book_append_sheet(
    
        workbook,
    
        categorySheet,
    
        "Categories"
    
    );

  }
}
