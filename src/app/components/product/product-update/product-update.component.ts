import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { IProduct } from '../../../models/product';

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
      name: ['', Validators.required],
      description: [''],
      brandId: [''],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      currencyId: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.productId = this.route.snapshot.params['id'];
    this.loadProduct();
  }

  loadProduct() {
    this.productService.getProduct(this.productId).subscribe((product: IProduct) => {
      this.productForm.patchValue({
        name: product.name,
        description: product.description,
        brand: product.brand,
        price: product.price,
        quantity: product.quantity,
        currency: product.currency,
        category: product.currency
      });
    });
  }

  updateProduct() {
    if (this.productForm.invalid) {
      return;
    }

    const productData: IProduct = {
      _id: this.productId,
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      brand: this.productForm.value.brand,
      price: this.productForm.value.price,
      quantity: this.productForm.value.quantity,
      currency: this.productForm.value.currency,
      category: this.productForm.value.category
    };

    this.productService.updateProduct(this.productId, productData).subscribe(() => {
      // Product updated successfully
      this.router.navigate(['/products']);
    });
  }
}
