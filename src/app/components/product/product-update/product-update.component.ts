import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { IProductRequest } from '../../../models/request/IProductRequest';
import { IProductResponse } from 'src/app/models/response/IProductResponset';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css']
})
export class ProductUpdateComponent implements OnInit {
  productId: string = "";
  productForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.formBuilder.group({
      productName: ['', Validators.required],
      description: [''],
      brand: [''],
      sellingPrice: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.productId = this.route.snapshot.params['id'];
    this.loadProduct();
  }

  loadProduct() {
    this.productService.getProduct(this.productId).subscribe((product: IProductResponse) => {
      this.productForm.patchValue({
        productName: product.productName,
        description: product.description,
        brand: product.brand.name,
        sellingPrice: product.sellingPrice,
        category: product.category.name
      });
    });
  }

  updateProduct() {
    if (this.productForm.invalid) {
      return;
    }

    const productData: IProductRequest = {
      productName: this.productForm.value.name,
      description: this.productForm.value.description,
      brand: this.productForm.value.brand,
      sellingPrice: this.productForm.value.price,
      category: this.productForm.value.category
    };

    this.productService.updateProduct(this.productId, productData).subscribe(() => {
      // Product updated successfully
      this.router.navigate(['/products']);
    });
  }
}
