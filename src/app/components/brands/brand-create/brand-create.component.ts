import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IBrand } from '../../../models/brand';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BrandService } from 'src/app/services/brand.service';

@Component({
    selector: 'app-brand-create',
    templateUrl: './brand-create.component.html',
    styleUrls: ['./brand-create.component.css']
})
export class BrandCreateComponent {
    @Output() brandCreated: EventEmitter<IBrand> = new EventEmitter<IBrand>();
    brandForm: FormGroup;



    constructor(
        private formBuilder: FormBuilder,
        private brandService: BrandService,
        private dialogRef: MatDialogRef<BrandCreateComponent>
    ) {
        this.brandForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['']
        });
    }

    onSubmit(): void {
        if (this.brandForm.valid) {
            const brand: IBrand = this.brandForm.value;
            // Perform save or update operation using the brand data
            this.createBrand();
            console.log(brand);
            this.brandForm.reset();
            this.dialogRef.close();
        }
    }

    createBrand() {
        if (this.brandForm.invalid) {
            return;
        }

        const brand: IBrand = {
            _id: "",
            name: this.brandForm.value.name,
            description: this.brandForm.value.description
        };

        this.brandService.createBrand(brand).subscribe(
            (createdBrand: IBrand) => {
                this.brandCreated.emit(createdBrand);
                this.brandForm.reset();
                this.dialogRef.close();
            },
            (error) => {
                console.log('Error creating brand:', error);
                this.dialogRef.close();
            }
        );
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
