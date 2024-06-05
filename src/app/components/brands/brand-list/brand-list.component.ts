import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BrandService } from '../../../services/brand.service';
import { IBrand } from '../../../models/brand';
import { MatDialog } from '@angular/material/dialog';
import { BrandCreateComponent } from '../brand-create/brand-create.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation/confirmation.component';

/* import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BrandCreateComponent } from '../brand-create/brand-create.component'; */

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {
  currentPage = 1;
  totalPages = 1;
  recordLimitParPage = 0;

  searchNameVal: string = "";
  searchDescVal: string = "";

  brands: IBrand[] = [];

  showCreateModal: boolean = false;

  constructor(private brandService: BrandService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getAllBrands();
  }

  searchBrands() {
    this.brandService.searchBrands(
      this.searchNameVal,
      this.searchDescVal).
      subscribe(
        (res: any) => {
          console.log("Received Data")
          this.brands = res.data;
          this.totalPages = res.totalPages;
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  getAllBrands() {

    this.brandService.getBrands(

      this.currentPage,
      this.recordLimitParPage,
      this.searchNameVal,
      this.searchDescVal

    ).subscribe(
      (res: any) => {
        console.log("Received Data")
        this.brands = res.brands;
        this.totalPages = res.totalPages;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  openDeleteConfirmationDialog(brand: IBrand): void {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Delete Confirmation",
        message: "Are you sure to delete this record?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Delete confirmed');

        this.brandService.deleteBrand(brand._id).subscribe({
          next: () => {
            this.getAllBrands()
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

  editBrand(brand: IBrand) {
    // Call the brand service to update the brand
    this.brandService.updateBrand(brand).subscribe(
      (updatedBrand: IBrand) => {
        // Update the brand in the brands array
        const index = this.brands.findIndex(item => item._id === updatedBrand._id);
        if (index !== -1) {
          this.brands[index] = updatedBrand;
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
      this.getAllBrands();
    }
  }

  openCreateBrandModal() {
    /* const modalRef: NgbModalRef = this.modalService.open(BrandCreateComponent);
    modalRef.componentInstance.brandCreated.subscribe((createdBrand: IBrand) => {
      this.brands.push(createdBrand);
    }); */
  }

  openBrandForm(): void {
    const dialogRef = this.dialog.open(BrandCreateComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Brand form closed');
      this.getAllBrands();
    });
  }


}
