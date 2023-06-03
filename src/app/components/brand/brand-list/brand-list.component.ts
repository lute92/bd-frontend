import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BrandService } from '../../../services/brand.service';
import { IBrand } from '../../../models/brand';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BrandCreateComponent } from '../brand-create/brand-create.component';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {
  currentPage = 1;
  totalPages = 1;
  recordLimitParPage = 6;

  searchNameVal: string = "";
  searchDescVal: string = "";

  confirmationBrand: IBrand | null = null;
  isConfirmationModalOpen = false;
  brands: IBrand[] = [];

  showCreateModal: boolean = false;

  constructor(private brandService: BrandService, private modalService: NgbModal) { }

  ngOnInit() {
    this.getAllBrands();
  }

  deleteBrand(brand: IBrand) {
    this.confirmationBrand = brand;
  }

  deleteConfirmedBrand() {
    // Remove the brand from the brands array
    if (this.confirmationBrand) {
      console.log('Deleting brand:', this.confirmationBrand);
      this.brandService.deleteBrand(this.confirmationBrand?.brandId).subscribe(() => {

        console.log('Brand deleted.');
        this.getAllBrands();
      },
        (error: any) => {
          console.error(error);
        })
    }

    this.closeConfirmationModal();
  }

  closeConfirmationModal() {
    this.confirmationBrand = null;
  }

  getAllBrands() {

    this.brandService.getBrands(
      
      this.currentPage,
      this.recordLimitParPage,
      this.searchNameVal,
      this.searchDescVal

    ).subscribe(
      (res: any) => {
        this.brands = res.data;
        this.totalPages = res.totalPages;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }


  editBrand(brand: IBrand) {
    // Call the brand service to update the brand
    this.brandService.updateBrand(brand).subscribe(
      (updatedBrand: IBrand) => {
        // Update the brand in the brands array
        const index = this.brands.findIndex(b => b.brandId === updatedBrand.brandId);
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
    const modalRef: NgbModalRef = this.modalService.open(BrandCreateComponent);
    modalRef.componentInstance.brandCreated.subscribe((createdBrand: IBrand) => {
      this.brands.push(createdBrand);
    });
  }



}
