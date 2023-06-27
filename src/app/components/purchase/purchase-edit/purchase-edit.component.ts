import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { IPurchaseDetail } from 'src/app/models/purchase-details';
import { PurchaseDetailDialogComponent } from '../purchase-detail/purchase-detail-dialog.component';
import { MatTable } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ICurrency } from 'src/app/models/currency';
import { CurrencyService } from 'src/app/services/currency.service';
import { AlertDialogComponent } from '../../shared/alert/alert-dialog.component';
import { IPurchase } from 'src/app/models/purchase';
import { PurchaseService } from 'src/app/services/purchase.service';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, firstValueFrom, take } from 'rxjs';

@Component({
  selector: 'app-purchase-edit',
  templateUrl: './purchase-edit.component.html',
  styleUrls: ['./purchase-edit.component.css']
})
export class PurchaseEditComponent implements OnInit {
  @ViewChild(MatTable) table!: MatTable<any>;


  purchaseEditForm!: FormGroup;
  pruchaseId!: string;

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

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private currencyService: CurrencyService,
    private purchaseService: PurchaseService,
    private route: ActivatedRoute) {

    this.purchaseEditForm = this.formBuilder.group({
      purchaseDate: ['', Validators.required],
      currency: ['', Validators.required],
      exchangeRate: [''],
      extraCost: [''],
      note: ['']
    });



  }

  ngOnInit() {
    this.getCurrencies();
    debugger
    this.route.params.subscribe((params)=> {
      const purchaseId = params['id'];
      if(purchaseId){
        this.purchaseService.getPurchasesById(purchaseId).subscribe((res) => {
          if (res) {
            const purchaseInfo = res;
            const { purchase, purchaseDetails } = purchaseInfo;
  
            this.purchaseEditForm.patchValue({
              purchaseDate: purchase.purchaseDate,
              exchangeRate: purchase.exchangeRate,
              extraCost: purchase.extraCost,
              
              note: purchase.note
            });
            this.purchaseEditForm.get('currency')?.patchValue(purchase.currency);
  
            this.purchaseDetails = purchaseDetails;
          }
        });
      }
    })
    
  }


  getCurrencies() {
    this.currencyService.getCurrencies().subscribe(res => {
      this.currencies = res.data;
    });
  }

  onSubmit(): void {
    this.createPurchase();
  }

  createPurchase() {

    if (this.purchaseEditForm.invalid) {
      return;
    }

    const { purchaseDate, currency, exchangeRate, extraCost, note } = this.purchaseEditForm.value;

    const purchase: IPurchase = {
      purchaseId: "",
      purchaseDate: purchaseDate,
      currency: currency,
      exchangeRate: exchangeRate,
      extraCost: extraCost,
      note: note,
      purchaseDetails: this.purchaseDetails
    };

    this.purchaseService.createPurchase(purchase)
      .subscribe(
        (createdPurchase: IPurchase) => {
          console.log('Purchase created successfully:', createdPurchase);
          this.openAlertDialog("Purchase order created.", "Success.")
          this.purchaseEditForm.reset();
          this.purchaseDetails = [];
          this.table.renderRows();
        },
        error => {

          //debugger
          this.openAlertDialog(error.error.message, "Failed")
          console.error('Failed to create product:', error);
        }
      );
  }

  openAlertDialog(message: string, title: string) {
    const dialogRef: MatDialogRef<any> = this.dialog.open(AlertDialogComponent, {
      width: '300px',
      data: { message: message, title: title }
    });
  }

  openPurchaseDetailDialog() {
    const dialogRef = this.dialog.open(PurchaseDetailDialogComponent, {
      width: '40%',
    });


    dialogRef.afterClosed().subscribe((newItem: IPurchaseDetail) => {
      debugger
      if (newItem) {
        let result = this.purchaseDetails.find((purchase) => {
          return purchase.product.productId === newItem.product.productId;
        })

        if (!result) {
          this.purchaseDetails.push(newItem);
          this.table.renderRows();
        }
        else {
          this.openAlertDialog("Same item already exist in Item List.", "Duplicate Product!")
        }
      }
    });
  }

  removePurchaseDetail(index: number) {
    this.purchaseDetails.splice(index, 1);
    this.table.renderRows();
  }
}
