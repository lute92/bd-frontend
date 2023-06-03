import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IBrand } from '../../../models/brand';
import { BrandService } from '../../../services/brand.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

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
    public activeModal: NgbActiveModal
  ) {
    this.brandForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  createBrand() {
    if (this.brandForm.invalid) {
      return;
    }

    const brand: IBrand = {
      brandId:"",
      name: this.brandForm.value.name,
      description: this.brandForm.value.description
    };

    this.brandService.createBrand(brand).subscribe(
      (createdBrand: IBrand) => {
        this.brandCreated.emit(createdBrand);
        this.closeModal();
        this.brandForm.reset();
      },
      (error) => {
        console.log('Error creating brand:', error);
      }
    );
  }

  closeModal() {
    this.activeModal.close();
  }
}
