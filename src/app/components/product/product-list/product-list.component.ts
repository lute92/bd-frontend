import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { IProduct } from '../../../models/product';
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
  productName: string = "";
  categoryId: string = "";
  brandId: string = "";
  products: IProduct[] = [];
  categories: ICategory[] = [];
  brands: IBrand[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private router: Router,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getProducts();
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
    this.brandService.getBrands().subscribe(
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
        (response) => {
          this.products = response;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getProducts(): void {
    this.productService.getProducts().subscribe(
      (products: IProduct[]) => {
        this.products = products;
      },
      (error) => {
        console.log('Failed to retrieve products:', error);
      }
    );
  }

  deleteProduct(id: string): void {
    this.productService.deleteProduct(id).subscribe(
      () => {
        this.getProducts();
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
          this.getProducts();
        }
      },
      () => {}
    );
  }
}
