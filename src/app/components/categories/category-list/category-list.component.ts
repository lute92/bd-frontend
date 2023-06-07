import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryCreateComponent } from '../category-create/category-create.component';
import { CategoryService } from 'src/app/services/category.service';
import { ICategory } from 'src/app/models/category';
import { ConfirmationDialogComponent } from '../../shared/confirmation/confirmation.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  currentPage = 1;
  totalPages = 1;
  recordLimitParPage = 7;

  searchNameVal: string = "";
  searchDescVal: string = "";

  categories: ICategory[] = [];

  showCreateModal: boolean = false;

  constructor(private categoryService: CategoryService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getAllCategories();
  }

  getAllCategories() {

    this.categoryService.getCategories(
      
      this.currentPage,
      this.recordLimitParPage,
      this.searchNameVal,
      this.searchDescVal

    ).subscribe(
      (res: any) => {
        console.log("Received Data")
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
        // Update the category in the category array
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

  openCategoryForm(): void {
    const dialogRef = this.dialog.open(CategoryCreateComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('Category form closed');
    });
  }

  openDeleteConfirmationDialog(category: ICategory): void {
    
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: "Delete Confirmation",
        message: "Are you sure to delete this record?"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Delete confirmed');

        this.categoryService.deleteCategory(category.categoryId).subscribe({
          next: () => {
            console.log('Category deleted!');
            this.getAllCategories()
          },
          error: (error) => {
            console.error(error);
          }
        });

      } else {
        // Cancel logic
        console.log('Delete canceled');
      }
    });
  }
  
}
