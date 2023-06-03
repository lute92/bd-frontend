import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { IProductResponse } from '../../../models/response/IProductResponset';
import { HttpClient } from '@angular/common/http';
import { ICategory } from 'src/app/models/category';
import { IBrand } from 'src/app/models/brand';
import { CategoryService } from 'src/app/services/category.service';
import { BrandService } from 'src/app/services/brand.service';
import { Router } from '@angular/router';
import { ProductCreateComponent } from '../product-create/product-create.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  currentPage = 1;
  totalPages = 1;
  recordLimitParPage = 10;

  productName: string = "";
  categoryId: string = "";
  brandId: string = "";

  products: IProductResponse[] = [];
  categories: ICategory[] = [];
  brands: IBrand[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getALLProducts();
    this.loadCategories();
    this.loadBrands();
  }


  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  loadBrands(): void {
    this.brandService.getBrands(0,0).subscribe(
      (brands) => {
        this.brands = brands;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  searchProducts(): void {
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

  openProductCreateModal(): void {
    const modalRef = this.modalService.open(ProductCreateComponent);
    modalRef.result.then(
      (result) => {
        if (result === 'success') {
          this.getALLProducts();
        }
      },
      () => {}
    );
  }
}
