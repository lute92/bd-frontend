import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CurrencyCreateComponent } from '../currency-create/currency-create.component';
import { CurrencyService } from 'src/app/services/currency.service';
import { ICurrency } from 'src/app/models/currency';
import { ConfirmationDialogComponent } from '../../shared/confirmation/confirmation.component';

@Component({
  selector: 'app-currency-list',
  templateUrl: './currency-list.component.html',
  styleUrls: ['./currency-list.component.css']
})
export class CurrencyListComponent implements OnInit {
  currentPage = 1;
  totalPages = 1;
  recordLimitParPage = 7;

  searchNameVal: string = "";
  searchDescVal: string = "";

  currencies: ICurrency[] = [];

  showCreateModal: boolean = false;

  constructor(private currencyService: CurrencyService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getAllCurrencies();
  }

  getAllCurrencies() {

    this.currencyService.getCurrencies(
      
      this.currentPage,
      this.recordLimitParPage,
      this.searchNameVal,
      this.searchDescVal

    ).subscribe(
      (res: any) => {
        console.log("Received Data")
        this.currencies = res.data;
        this.totalPages = res.totalPages;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }


  editCurrency(currency: ICurrency) {
    // Call the currency service to update the currency
    this.currencyService.updateCurrency(currency).subscribe(
      (updatedCurrency: ICurrency) => {
        // Update the currency in the currency array
        const index = this.currencies.findIndex(b => b.currencyId === updatedCurrency.currencyId);
        if (index !== -1) {
          this.currencies[index] = updatedCurrency;
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getAllCurrencies();
    }
  }

  openCurrencyForm(): void {
    const dialogRef = this.dialog.open(CurrencyCreateComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Currency form closed');
    });
  }

  openDeleteConfirmationDialog(currency: ICurrency): void {
    
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Delete Confirmation",
        message: "Are you sure to delete this record?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Delete confirmed');

        this.currencyService.deleteCurrency(currency.currencyId).subscribe({
          next: () => {
            console.log('Currency deleted!');
            this.getAllCurrencies()
          },
          error: (error) => {
            console.error(error);
          }
        });

      } else {
        // Cancel logic
        console.log('Delete canceled');
      }
    });
  }
  
}
