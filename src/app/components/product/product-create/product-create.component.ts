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
  ) {}

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
      brandId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      currencyId: ['', Validators.required],
      categoryId: ['', Validators.required]
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
    if (this.productForm.valid) {
      const newProduct = this.productForm.value;

      this.productService.createProduct(newProduct).subscribe(
        () => {
          this.modal.close('success');
        },
        error => {
          console.error('Failed to create product:', error);
          // Handle error if needed
        }
      );
    }
  }
}
