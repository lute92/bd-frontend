import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { IProductRes } from '../../../models/response/IProductRes';
import { ICategory } from 'src/app/models/category';
import { IBrand } from 'src/app/models/brand';
import { CategoryService } from 'src/app/services/category.service';
import { BrandService } from 'src/app/services/brand.service';
import { Router } from '@angular/router';
import { PurchaseCreateComponent } from '../purchase-create/purchase-create.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation/confirmation.component';
import { HttpClient } from '@angular/common/http';
import { PurchaseService } from 'src/app/services/purchase.service';
import { IPurchase } from 'src/app/models/purchase';
@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.css']
})
export class PurchaseListComponent implements OnInit {

  displayedColumns: string[] = [
    'purchaseDate', 'currency', 'exchangeRate',
    'extraCost', 'note', 'actions'
  ];

  currentPage = 1;
  totalPages = 1;
  recordLimitParPage = 4;

  purchases: IPurchase[] = [];

  constructor(
    private purchaseService: PurchaseService,
    public dialog: MatDialog,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllPurchases();
  }

  navigateToPurchaseCreate(): void {
    this.router.navigate(['/purchaseCreate']);
  }

  searchPurchases(): void {
    
    this.purchaseService.searchPurchase(this.currentPage, this.recordLimitParPage)
      .subscribe(
        (response: any) => {
          this.purchases = response.data;
        },
        (error) => {
          console.error(error);
        }
      );
  }


  getAllPurchases(): void {
    this.purchaseService.getPurchases(this.currentPage, this.recordLimitParPage).subscribe(
      (res: any) => {
        this.purchases = res.data;
        this.totalPages = res.totalPages;
      },
      (error) => {
        console.log('Failed to retrieve products:', error);
      }
    );
  }


  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getAllPurchases();
    }
  }

  deletePurchase(id: string): void {
    this.purchaseService.deletePurchase(id).subscribe(
      () => {
        this.getAllPurchases();
      },
      (error) => {
        console.log('Failed to delete pruchase info:', error);
      }
    );
  }

  openPurchaseCreateForm(): void {
    const dialogRef = this.dialog.open(PurchaseCreateComponent, {
      width: '75%',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Purchase form closed');
      this.getAllPurchases();
    });
  }

  

  openDeleteConfirmationDialog(purchase: IPurchase): void {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Delete Confirmation",
        message: "Are you sure to delete this record?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Delete confirmed');

        this.purchaseService.deletePurchase(purchase.purchaseId).subscribe({
          next: () => {
            console.log('Purchase information deleted!');
            this.getAllPurchases()
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
