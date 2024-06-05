import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import { IProductBatch } from 'src/app/models/productBatch';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-product-batch-edit',
    templateUrl: './product-batch-edit.component.html',
    styleUrls: ['./product-batch-edit.component.css']
})
export class ProductBatchEditComponent implements OnInit {
    @Output() productBatchUpdated: EventEmitter<IProductBatch> = new EventEmitter<IProductBatch>();
    productBatchForm: FormGroup;
    errorMessage: string | null = null;
    
    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<ProductBatchEditComponent>,
        private productService: ProductService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        debugger
        const batch = data.batch as IProductBatch;
        this.productBatchForm = this.formBuilder.group({
            createdDate: [batch.createdDate || ''],
            mnuDate: [new Date(batch.mnuDate * 1000), Validators.required],
            expDate: [batch.expDate ? new Date(batch.expDate * 1000) : null],
            purchasePrice: [batch.purchasePrice, Validators.required],
            sellingPrice: [batch.sellingPrice, Validators.required],
            quantity: [batch.quantity, Validators.required],
            note: [batch.note || ''],
            isPromotionItem: [batch.isPromotionItem || false],
            promotionPrice: [batch.promotionPrice || null]
        });
    }

    ngOnInit(): void {}
    
    updateProductBatch() {
        if (this.productBatchForm.invalid) {
            return;
        }

        const updatedProductBatch: IProductBatch = {
            _id: this.data.batch._id,
            createdDate: this.productBatchForm.value.createdDate,
            mnuDate: new Date(this.productBatchForm.value.mnuDate).getTime() / 1000,
            expDate: new Date(this.productBatchForm.value.expDate).getTime() / 1000,
            quantity: this.productBatchForm.value.quantity,
            note: this.productBatchForm.value.note,
            purchasePrice: this.productBatchForm.value.purchasePrice,
            sellingPrice: this.productBatchForm.value.sellingPrice,
            isPromotionItem: this.productBatchForm.value.isPromotionItem,
            promotionPrice: this.productBatchForm.value.promotionPrice
        };
        this.productBatchUpdated.emit(updatedProductBatch);
        this.dialogRef.close(updatedProductBatch);
        
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
