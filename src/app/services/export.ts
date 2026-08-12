import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver';

import jsPDF from 'jspdf';

import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  //Export CSV Files
  exportCSV(expenses: any[]) {

    const worksheet =
      XLSX.utils.json_to_sheet(expenses);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Expenses'
    );

    const buffer =
      XLSX.write(workbook, {
        bookType: 'csv',
        type: 'array'
      });

    const blob =
      new Blob([buffer]);

    saveAs(blob, 'Expenses.csv');

  }

  //Export EXCEL Files
  exportExcel(expenses: any[]) {

    const worksheet =
      XLSX.utils.json_to_sheet(expenses);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Expenses');

    const buffer =
      XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array'
      });

    saveAs(
      new Blob([buffer]),
      'Expenses.xlsx'
    );

  }

  //Export PDF Files
  exportPDF(expenses: any[]) {

    const doc =
      new jsPDF();

    doc.setFontSize(18);

    doc.text(
      'Expense Report',
      14,
      15
    );

    autoTable(doc, {

      head: [[
        'Date',
        'Category',
        'Amount',
        'Payment',
        'Description'
      ]],

      body: expenses.map(
        expense => [

          expense.date,

          expense.category,

          expense.amount,

          expense.paymentMethod,

          expense.description

        ]
      )

    });

    doc.save(
      'Expense_Report.pdf'
    );

  }
}