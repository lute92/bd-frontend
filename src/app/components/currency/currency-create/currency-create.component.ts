import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ICurrency } from '../../../models/currency';
import { CurrencyService } from 'src/app/services/currency.service';

@Component({
    selector: 'app-currency-create',
    templateUrl: './currency-create.component.html',
    styleUrls: ['./currency-create.component.css']
})
export class CurrencyCreateComponent {
    @Output() currencyCreated: EventEmitter<ICurrency> = new EventEmitter<ICurrency>();
    currencyForm: FormGroup;



    constructor(
        private formBuilder: FormBuilder,
        private currencyService: CurrencyService,
        private dialogRef: MatDialogRef<CurrencyCreateComponent>
    ) {
        this.currencyForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['']
        });
    }

    onSubmit(): void {
        if (this.currencyForm.valid) {
            const currency: ICurrency = this.currencyForm.value;
            // Perform save or update operation using the brand data
            this.createCurrency();
            console.log(currency);
            this.currencyForm.reset();
            this.dialogRef.close();
        }
    }

    createCurrency() {
        if (this.currencyForm.invalid) {
            return;
        }

        const currency: ICurrency = {
            currencyId: "",
            name: this.currencyForm.value.name,
            description: this.currencyForm.value.description
        };

        this.currencyService.createCurrency(currency).subscribe(
            (createdCurrency: ICurrency) => {
                this.currencyCreated.emit(createdCurrency);
                this.currencyForm.reset();
                this.dialogRef.close();
            },
            (error) => {
                console.log('Error creating currency:', error);
                this.dialogRef.close();
            }
        );
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
