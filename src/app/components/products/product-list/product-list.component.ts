import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { IProductRes } from '../../../models/response/IProductRes';
import { CategoryService } from 'src/app/services/category.service';
import { BrandService } from 'src/app/services/brand.service';
import { Router } from '@angular/router';
import { ProductCreateComponent } from '../product-create/product-create.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/confirmation/confirmation.component';
import { ProductEditComponent } from '../product-edit/product-edit.component';
import { BehaviorSubject, Observable, catchError, finalize, forkJoin, from, tap, throwError } from 'rxjs';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.services';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  loading: boolean = false;

  displayedColumns: string[] = [
    'image', 'productName', 'createdDate', 'category', 'brand', 'totalQuantity', 'actions'
  ];

  currentPage = 1;
  totalPages = 1;
  recordLimitParPage = 10;
  totalProducts = 0;

  productName: string = "";
  categoryId: string = "";
  brandId: string = "";

  // Use BehaviorSubject for products
  private productsSubject = new BehaviorSubject<IProductRes[]>([]);
  products$: Observable<IProductRes[]> = this.productsSubject.asObservable();

  categories: any[] = [];
  brands: any[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    public dialog: MatDialog,
    private messageService: MessageService,
    private router: Router, private firebaseService: FirebaseStorageService) { }

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
      tap(async (res: any) => {
        const productsWithTotalQuantity = await Promise.all(res.products.map(async (product: any) => {
          const totalQuantity = product.batches.reduce((sum: number, batch: any) => sum + batch.quantity, 0);
          const imageUrl = product.images[0]?.url;
          if (imageUrl) {
            try {
              const downloadURL = await this.firebaseService.getDownloadURL(imageUrl).toPromise();
              return { ...product, totalQuantity, imageUrl: downloadURL };
            } catch (error) {
              console.error('Failed to get download URL:', error);
              return { ...product, totalQuantity, imageUrl };
            }
          } else {
            return { ...product, totalQuantity, imageUrl };
          }
        }));

        this.productsSubject.next(productsWithTotalQuantity);
        this.totalPages = res.totalPages;
        this.totalProducts = res.totalProducts;
      }),
      catchError((error) => {
        console.error('Failed to retrieve products:', error);
        return throwError(error);
      })
    );
  }

  searchProducts(): void {
    debugger
    if (this.categoryId == "All") {
      this.categoryId = ""
    }

    if (this.brandId == "All") {
      this.brandId = "";
    }

    this.productService.searchProducts(this.currentPage, this.recordLimitParPage,
      this.productName, this.brandId, this.categoryId).pipe(
        tap(async (res: any) => {
          const productsWithTotalQuantity = await Promise.all(res.products.map(async (product: any) => {
            const totalQuantity = product.batches.reduce((sum: number, batch: any) => sum + batch.quantity, 0);
            const imageUrl = product.images[0]?.url;
            if (imageUrl) {
              try {
                const downloadURL = await this.firebaseService.getDownloadURL(imageUrl).toPromise();
                return { ...product, totalQuantity, imageUrl: downloadURL };
              } catch (error) {
                console.error('Failed to get download URL:', error);
                return { ...product, totalQuantity, imageUrl };
              }
            } else {
              return { ...product, totalQuantity, imageUrl };
            }
          }));

          this.productsSubject.next(productsWithTotalQuantity);
          this.totalPages = res.totalPages;
        }),
        catchError((error) => {
          console.error('Failed to retrieve products:', error);
          return throwError(error);
        })
      ).subscribe();

    /* this.productService.searchProducts(this.currentPage, this.recordLimitParPage,
      this.productName, this.brandId, this.categoryId)
      .subscribe(
        (response: any) => {
          this.productsSubject.next(response.products);
          this.totalPages = response.totalPages;
        },
        (error) => {
          console.error(error);
        }
      ); */
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
        this.getALLProducts().subscribe(() => {
          this.messageService.showMessage("Product deleted.", 5000, "success");
          console.log('Products refreshed');
        });
      },
      (error) => {
        this.messageService.showMessage("Error while deleting a product.", 5000, "error");
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
      this.getALLProducts().subscribe(() => {
        console.log('Products refreshed');
      });
    });
  }

  redirectToEdit(): void {
    this.router.navigate(['/productCreate']); // Assuming '/edit/:id' is your edit route
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
      this.getALLProducts().subscribe(() => {
        console.log('Products refreshed');
      });
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

        this.productService.deleteProduct(product._id).subscribe({
          next: () => {
            console.log('Product deleted!');
            this.getALLProducts().subscribe(() => {
              console.log('Products refreshed');
            });
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
