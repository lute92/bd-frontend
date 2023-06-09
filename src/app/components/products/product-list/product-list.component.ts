import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { IProductRes } from '../../../models/response/IProductRes';
import { ICategory } from 'src/app/models/category';
import { IBrand } from 'src/app/models/brand';
import { CategoryService } from 'src/app/services/category.service';
import { BrandService } from 'src/app/services/brand.service';
import { Router } from '@angular/router';
import { ProductCreateComponent } from '../product-create/product-create.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation/confirmation.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  displayedColumns: string[] = ['image','productName', 'description','category', 'brand', 'sellingPrice', 'totalQuantity', 'actions'];
  
  currentPage = 1;
  totalPages = 1;
  recordLimitParPage = 4;

  productName: string = "";
  categoryId: string = "";
  brandId: string = "";

  products: IProductRes[] = [];
  categories: ICategory[] = [];
  brands: IBrand[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getALLProducts();
    this.loadCategories();
    this.loadBrands();
  }


  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (res) => {
        this.categories = res.data;
        this.categories.unshift({categoryId:"",name:"All",description:""})
        
      },
      (error:any) => {
        console.error(error);
      }
    );
  }

  loadBrands(): void {
    this.brandService.getBrands().subscribe(
      (res) => {
        this.brands = res.data;
        this.brands.unshift({brandId:"",name:"All",description:""})
      },
      (error:any) => {
        console.error(error);
      }
    );
  }

  searchProducts(): void {
    if(this.categoryId == "All"){
      this.categoryId = ""
    }

    if(this.brandId == "All"){
      this.brandId = "";
    }

    this.productService.searchProducts(this.productName, this.brandId, this.categoryId)
      .subscribe(
        (response:any) => {
          this.products = response.data;
        },
        (error) => {
          console.error(error);
        }
      );
  }


  getALLProducts(): void {
    this.productService.getProducts(this.currentPage, this.recordLimitParPage).subscribe(
      (res: any) => {
        this.products = res.data;
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
      this.getALLProducts();
    }
  }

  deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe(
      () => {
        this.getALLProducts();
      },
      (error) => {
        console.log('Failed to delete product:', error);
      }
    );
  }

  openProductForm(): void {
    const dialogRef = this.dialog.open(ProductCreateComponent, {
      width: '60%',
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Product form closed');
      this.getALLProducts();
    });
  }

  openDeleteConfirmationDialog(product: IProductRes): void {
    
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Delete Confirmation",
        message: "Are you sure to delete this record?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Delete confirmed');

        this.productService.deleteProduct(product.productId).subscribe({
          next: () => {
            console.log('Product deleted!');
            this.getALLProducts()
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
