import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Observable, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { IProductRes } from 'src/app/models/response/IProductRes';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-purchase-detail-edit-dialog',
  templateUrl: './purchase-detail-edit-dialog.component.html',
  styleUrls: ['./purchase-detail-edit-dialog.component.css']
})
export class PurchaseDetailEditDialogComponent implements OnInit {

  products!: IProductRes[];
  purchaseDetailForm!: FormGroup;


  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<PurchaseDetailEditDialogComponent>
  ) {
    this.getAllProducts();

  }

  /** control for the MatSelect filter keyword */
  public productFilterCtrl: FormControl<string | null> = new FormControl<string>('');

  /** list of products filtered by search keyword */
  public filteredProducts: ReplaySubject<IProductRes[]> = new ReplaySubject<IProductRes[]>(1);


  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();
  

  ngOnInit() {
    this.purchaseDetailForm = this.formBuilder.group({
      product: ['', Validators.required],
      quantity: ['', Validators.required],
      purchasePrice: ['', Validators.required],
      expDate: [''],
      mnuDate: ['']
    });


  }

  getAllProducts() {
    this.productService.getProducts(0, 0).subscribe((res: any) => {
      this.products = res.data;

      // set initial selection
      this.purchaseDetailForm.controls['product'].setValue(this.products[0]);

      // load the initial bank list
      this.filteredProducts.next(this.products.slice());

      // listen for search field value changes
      this.productFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
              this.filterProducts();
          });

    });
  }


  protected filterProducts() {
    if (!this.products) {
        return;
    }
    // get the search keyword
    let search = this.productFilterCtrl.value;
    if (!search) {
        this.filteredProducts.next(this.products.slice());
        return;
    } else {
        search = search.toLowerCase();
    }
    // filter the banks
    this.filteredProducts.next(
        this.products.filter(product => {
            const searchTerm = search ? search.toLowerCase() : '';
            return product.productName.toLowerCase().indexOf(searchTerm) > -1;
        })
    );
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
