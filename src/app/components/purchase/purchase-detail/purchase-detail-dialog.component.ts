import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { IProductRes } from 'src/app/models/response/IProductRes';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-purchase-detail-dialog',
  templateUrl: './purchase-detail-dialog.component.html',
  styleUrls: ['./purchase-detail-dialog.component.css']
})
export class PurchaseDetailDialogComponent implements OnInit {

  products!: IProductRes[];
  purchaseDetailForm!: FormGroup;

  productControl = new FormControl();
  productFilterControl = new FormControl();
  filteredProducts: IProductRes[] = [];

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PurchaseDetailDialogComponent>
  ) {
    this.getAllProducts();

  }


  ngOnInit() {
    this.purchaseDetailForm = this.formBuilder.group({
      product: ['', Validators.required],
      quantity: ['', Validators.required],
      purchasePrice: ['', Validators.required],
      itemCost: ['', Validators.required],
      expDate: ['', Validators.required],
      mnuDate: ['', Validators.required]
    });


  }

  getAllProducts() {
    this.productService.getProducts(0, 0).subscribe((res: any) => {
      this.products = res.data;
    });
  }

  
  onCancelClick() {
    this.dialogRef.close();
  }

  onAddClick() {
    if (this.purchaseDetailForm.valid) {
      debugger
      this.dialogRef.close(this.purchaseDetailForm.value);
    }
  }
}
