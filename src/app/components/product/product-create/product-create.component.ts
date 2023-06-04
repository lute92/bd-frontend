import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { IBrand } from "src/app/models/brand";
import { ICategory } from "src/app/models/category";
import { ICurrency } from "src/app/models/currency";
import { IProductResponse } from "src/app/models/response/IProductResponset";
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
  @Output() productCreated: EventEmitter<IProductResponse> = new EventEmitter<IProductResponse>();
  
  productForm!: FormGroup;
  brands!: IBrand[];
  currencies!: ICurrency[];
  categories!: ICategory[];

  constructor(
    private productService: ProductService,
    private brandService: BrandService,
    private currencyService: CurrencyService,
    private categoryService: CategoryService,
    public activeModal: NgbActiveModal,
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
      productName: ['', Validators.required],
      description: ['', Validators.required],
      brand: ['', Validators.required],
      sellingPrice: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required]
    });
  }

  getBrands(): void {
    this.brandService.getBrands().subscribe(res => {
      this.brands = res.data;
    });
  }

  getCurrencies(): void {
    this.currencyService.getCurrencies().subscribe(currencies => {
      this.currencies = currencies;
    });
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res.data;
    });
  }

  createProduct(): void {
    if (this.productForm.invalid) {
      return;
    }
  
    const { productName, description, sellingPrice, brand, category } = this.productForm.value;
  
    const product = {
      productId:"",
      productName,
      description,
      brand: brand || null,
      sellingPrice,
      category: category || null
    };
  
    this.productService.createProduct(product)
      .subscribe(
        (createdProduct: IProductResponse) => {
          console.log('Product created successfully:', createdProduct);
          this.productCreated.emit(createdProduct);
        this.closeModal();
          // Reset the form after successful creation
          this.productForm.reset();
        },
        error => {
          console.error('Failed to create product:', error);
        }
      );
      
  }
  closeModal() {
    this.activeModal.close();
  }
}

