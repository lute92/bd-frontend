import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IProductBatch } from 'src/app/models/productBatch';

@Component({
    selector: 'app-product-batch-create',
    templateUrl: './product-batch-create.component.html',
    styleUrls: ['./product-batch-create.component.css']
})
export class ProductBatchCreateComponent {
    @Output() productBatchAdded: EventEmitter<IProductBatch> = new EventEmitter<IProductBatch>();
    productBatchForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<ProductBatchCreateComponent>
    ) {
        this.productBatchForm = this.formBuilder.group({
            createdDate: [''],
            mnuDate: [''],
            expDate: [''],
            quantity: [''],
            note: ['']

        });
    }

    onSubmit(): void {
        if (this.productBatchForm.valid) {
            const productBatch: IProductBatch = this.productBatchForm.value;
            // Perform save or update operation using the brand data
            this.addProductBatch();
        }
    }

    addProductBatch() {
        if (this.productBatchForm.invalid) {
            return;
        }

        const addedProductBatch = {
            createdDate: 0,
            mnuDate: new Date(this.productBatchForm.value.mnuDate).getTime() / 1000,
            expDate: new Date(this.productBatchForm.value.expDate).getTime() /1000,
            quantity: this.productBatchForm.value.quantity,
            note: this.productBatchForm.value.note
        };

        this.productBatchAdded.emit(addedProductBatch);
        this.productBatchForm.reset();
        this.dialogRef.close();
        
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
