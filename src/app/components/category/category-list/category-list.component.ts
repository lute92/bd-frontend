import { Component, OnInit } from '@angular/core';
import { ICategory } from '../../../models/category';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CategoryCreateComponent } from '../category-create/category-create.component';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  currentPage = 1;
  totalPages = 1;
  recordLimitParPage = 6;

  searchNameVal: string = "";
  searchDescVal: string = "";

  currentItem: ICategory | null = null;
  isConfirmationModalOpen = false;
  categories: ICategory[] = [];

  showCreateModal: boolean = false;

  constructor(private categoryService: CategoryService, private modalService: NgbModal) { }

  ngOnInit() {
    this.getAllCategories();
  }

  deleteCategory(category: ICategory) {
    this.currentItem = category;
  }

  deleteConfirmed() {
    // Remove the category from the categories array
    if (this.currentItem) {
      console.log('Deleting category:', this.currentItem);
      this.categoryService.deleteCategory(this.currentItem?.categoryId).subscribe(() => {

        console.log('Category deleted.');
        this.getAllCategories();
      },
        (error: any) => {
          console.error(error);
        })
    }

    this.closeConfirmationModal();
  }

  closeConfirmationModal() {
    this.currentItem = null;
  }

  getAllCategories() {

    this.categoryService.getCategories(
      
      this.currentPage,
      this.recordLimitParPage,
      this.searchNameVal,
      this.searchDescVal

    ).subscribe(
      (res: any) => {
        this.categories = res.data;
        this.totalPages = res.totalPages;
      },
      (error: any) => {
        console.error(error);
      }
    );
  }


  editCategory(category: ICategory) {
    // Call the category service to update the category
    this.categoryService.updateCategory(category).subscribe(
      (updatedCategory: ICategory) => {
        // Update the category in the categories array
        const index = this.categories.findIndex(b => b.categoryId === updatedCategory.categoryId);
        if (index !== -1) {
          this.categories[index] = updatedCategory;
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getAllCategories();
    }
  }

  openCreateCategoryModal() {
    const modalRef: NgbModalRef = this.modalService.open(CategoryCreateComponent);
    modalRef.componentInstance.categoryCreate.subscribe((createdCategory: ICategory) => {
      this.categories.push(createdCategory);
    });
  }



}
