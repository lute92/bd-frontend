import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { IPurchaseDetail } from 'src/app/models/purchase-details';
import { PurchaseDetailDialogComponent } from '../purchase-detail/purchase-detail-dialog.component';
import { MatTable } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICurrency } from 'src/app/models/currency';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
  selector: 'app-purchase-create',
  templateUrl: './purchase-create.component.html',
  styleUrls: ['./purchase-create.component.css']
})
export class PurchaseCreateComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<any>;

  purchaseCreateForm!: FormGroup;
  purchaseDetails: IPurchaseDetail[] = [];

  currencies: ICurrency[] = [];

  displayedColumns: string[] = [
    'product',
    'quantity',
    'purchasePrice',
    'itemCost',
    'expDate',
    'mnuDate',
    'delete'
  ];

  constructor(private dialog: MatDialog, private formBuilder: FormBuilder, private currencyService: CurrencyService) {

    this.purchaseCreateForm = this.formBuilder.group({
      purchaseDate: ['', Validators.required],
      currency: ['', Validators.required],
      exchangeRate: [''],
      note: [''],
    });
  }

  ngOnInit(): void {
    this.getCurrencies();
  }

  getCurrencies() {
    this.currencyService.getCurrencies().subscribe(res => {
      this.currencies = res.data;
    });
  }

  onSubmit() {

  }

  openPurchaseDetailDialog() {
    const dialogRef = this.dialog.open(PurchaseDetailDialogComponent, {
      width: '40%',
    });


    dialogRef.afterClosed().subscribe((result: IPurchaseDetail) => {
      debugger
      if (result) {
        this.purchaseDetails.push(result);
        this.table.renderRows();
      }
    });
  }

  removePurchaseDetail(index: number) {
    this.purchaseDetails.splice(index, 1);
    this.table.renderRows();
  }
}
