import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ICategory } from '../../../models/category';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CategoryService } from 'src/app/services/category.service';

@Component({
    selector: 'app-category-create',
    templateUrl: './category-create.component.html',
    styleUrls: ['./category-create.component.css']
})
export class CategoryCreateComponent {
    @Output() categoryCreated: EventEmitter<ICategory> = new EventEmitter<ICategory>();
    categoryForm: FormGroup;



    constructor(
        private formBuilder: FormBuilder,
        private categoryService: CategoryService,
        private dialogRef: MatDialogRef<CategoryCreateComponent>
    ) {
        this.categoryForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['']
        });
    }

    onSubmit(): void {
        if (this.categoryForm.valid) {
            const category: ICategory = this.categoryForm.value;
            // Perform save or update operation using the brand data
            this.createCategory();
            console.log(category);
            this.categoryForm.reset();
            this.dialogRef.close();
        }
    }

    createCategory() {
        if (this.categoryForm.invalid) {
            return;
        }

        const category: ICategory = {
            _id: "",
            name: this.categoryForm.value.name,
            description: this.categoryForm.value.description
        };

        this.categoryService.createCategory(category).subscribe(
            (createdCategory: ICategory) => {
                this.categoryCreated.emit(createdCategory);
                this.categoryForm.reset();
                this.dialogRef.close();
            },
            (error) => {
                console.log('Error creating category:', error);
                this.dialogRef.close();
            }
        );
    }

    cancel(): void {
        this.dialogRef.close();
    }
}
