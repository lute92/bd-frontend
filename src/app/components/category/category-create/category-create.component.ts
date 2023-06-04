import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategory } from '../../../models/category';
import { CategoryService } from '../../../services/category.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})
export class CategoryCreateComponent {
  @Output() categoryCreate: EventEmitter<ICategory> = new EventEmitter<ICategory>();

  categoryForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public activeModal: NgbActiveModal
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  createCategory() {
    if (this.categoryForm.invalid) {
      return;
    }

    const category: ICategory = {
      categoryId:"",
      name: this.categoryForm.value.name,
      description: this.categoryForm.value.description
    };

    this.categoryService.createCategory(category).subscribe(
      (createdCategory: ICategory) => {
        this.categoryCreate.emit(createdCategory);
        this.closeModal();
        this.categoryForm.reset();
      },
      (error) => {
        console.log('Error creating category:', error);
      }
    );
  }

  closeModal() {
    this.activeModal.close();
  }
}
