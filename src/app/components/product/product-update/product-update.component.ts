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
        brandId: product.brandId,
        price: product.price,
        quantity: product.quantity,
        currencyId: product.currencyId,
        categoryId: product.categoryId
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
      brandId: this.productForm.value.brandId,
      price: this.productForm.value.price,
      quantity: this.productForm.value.quantity,
      currencyId: this.productForm.value.currencyId,
      categoryId: this.productForm.value.categoryId
    };

    this.productService.updateProduct(this.productId, productData).subscribe(() => {
      // Product updated successfully
      this.router.navigate(['/products']);
    });
  }
}
