import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { IBrand } from "src/app/models/brand";
import { ICategory } from "src/app/models/category";
import { ICurrency } from "src/app/models/currency";
import { BrandService } from "src/app/services/brand.service";
import { CategoryService } from "src/app/services/category.service";
import { CurrencyService } from "src/app/services/currency.service";
import { ProductService } from "src/app/services/product.service";

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})

export class ProductCreateComponent implements OnInit {
  productForm!: FormGroup;
  brands!: IBrand[];
  currencies!: ICurrency[];
  categories!: ICategory[];

  constructor(
    private productService: ProductService,
    private brandService: BrandService,
    private currencyService: CurrencyService,
    private categoryService: CategoryService,
    public modal: NgbActiveModal,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initProductForm();
    this.getBrands();
    this.getCurrencies();
    this.getCategories();
  }

  initProductForm(): void {
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      currency: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  getBrands(): void {
    this.brandService.getBrands().subscribe(brands => {
      this.brands = brands;
    });
  }

  getCurrencies(): void {
    this.currencyService.getCurrencies().subscribe(currencies => {
      this.currencies = currencies;
    });
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  createProduct(): void {
    if (this.productForm.invalid) {
      return;
    }
  
    const { name, description, price, quantity, brand, currency, category } = this.productForm.value;
  
    const product = {
      _id:"",
      name,
      description,
      brand: brand || null,
      price,
      quantity,
      currency: currency || null,
      category: category || null
    };
  
    this.productService.createProduct(product)
      .subscribe(
        response => {
          console.log('Product created successfully:', response);
          // Reset the form after successful creation
          this.productForm.reset();
        },
        error => {
          console.error('Failed to create product:', error);
        }
      );
  }
  
}
