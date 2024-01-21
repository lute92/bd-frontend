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
import { ProductEditComponent } from '../product-edit/product-edit.component';
import { Observable, catchError, finalize, forkJoin, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  loading: boolean = false;

  displayedColumns: string[] = [
    'image', 'productName', 'weight', 'mnuCountry',
    'category', 'brand', 'sellingPrice', 'totalQuantity', 'actions'
  ];

  currentPage = 1;
  totalPages = 1;
  recordLimitParPage = 5;

  productName: string = "";
  categoryId: string = "";
  brandId: string = "";

  products: any[] = [];
  categories: any[] = [];
  brands: any[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.initializeData();
  }

  initializeData(): void {
    this.loading = true;
  
    forkJoin([
      this.loadCategories(),
      this.loadBrands(),
      this.getALLProducts()
    ]).pipe(
      finalize(() => this.loading = false),
      catchError((error) => {
        console.error('Failed to initialize data:', error);
        return throwError(error);
      })
    ).subscribe(() => {
      
    });
  }
  

  loadCategories(): Observable<void> {
    return this.categoryService.getCategories(0, 0).pipe(
      tap((res) => {
        this.categories = res.categories;
        if (this.categories?.length) {
          this.categories.unshift({ categoryId: "", name: "All", description: "" });
        }
      }),
      catchError((error) => {
        console.error('Failed to load categories:', error);
        return throwError(error);
      })
    );
  }

  loadBrands(): Observable<void> {
    return this.brandService.getBrands(0, 0).pipe(
      tap((res) => {
        this.brands = res.brands;
        if (this.brands?.length) {
          this.brands.unshift({ brandId: "", name: "All", description: "" });
        }
      }),
      catchError((error) => {
        console.error('Failed to load brands:', error);
        return throwError(error);
      })
    );
  }

  getALLProducts(): Observable<void> {
    return this.productService.getProducts(this.currentPage, this.recordLimitParPage).pipe(
      tap((res: any) => {
        this.products = res.products;
        this.totalPages = res.totalPages;
      }),
      catchError((error) => {
        console.error('Failed to retrieve products:', error);
        return throwError(error);
      })
    );
  }

  searchProducts(): void {
    if (this.categoryId == "All") {
      this.categoryId = ""
    }

    if (this.brandId == "All") {
      this.brandId = "";
    }

    this.productService.searchProducts(this.currentPage, this.recordLimitParPage,
      this.productName, this.brandId, this.categoryId)
      .subscribe(
        (response: any) => {
          this.products = response.products;
          this.totalPages = response.totalPages;
        },
        (error) => {
          console.error(error);
        }
      );
  }


  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.searchProducts();
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
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Product form closed');
      this.getALLProducts();
    });
  }

  openEditDialogForm(productId: string): void {
    const dialogRef = this.dialog.open(ProductEditComponent, {
      width: '60%',
      disableClose: true,
      data: {
        productId: productId
      }
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
