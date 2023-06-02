import { Component, OnInit, ViewChild } from '@angular/core';
import { BrandService } from '../../services/brand.service';
import { IBrand } from '../../models/brand';
import { DeleteConfirmationComponent } from '../common/delete-confirmation/delete-confirmation.component';



@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.css']
})
export class BrandListComponent implements OnInit {

  @ViewChild(DeleteConfirmationComponent)
  deleteConfirmationModal!: DeleteConfirmationComponent;
  

  brands: IBrand[] = [];
  selectedBrand: IBrand | null = null;

  constructor(private brandService: BrandService) { }

  ngOnInit() {
    this.getBrands();
  }

  getBrands() {
    this.brandService.getBrands().subscribe(
      (brands: IBrand[]) => {
        this.brands = brands;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  addBrand() {
    // Implement the logic to add a new brand
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

  deleteBrandConfirmation() {
    if (this.selectedBrand) {
      // Perform the delete operation using the brand's ID
      this.brandService.deleteBrand(this.selectedBrand.brandId).subscribe(
        () => {
          // Delete successful, remove the brand from the list
          const index = this.brands.findIndex(brand => brand.brandId === this.selectedBrand!.brandId);
          if (index !== -1) {
            this.brands.splice(index, 1);
          }
        },
        error => {
          console.log(error);
          // Handle the error case
        }
      );
    }
  
    // Close the delete confirmation modal
    this.deleteConfirmationModal.confirmDelete();
}

}
