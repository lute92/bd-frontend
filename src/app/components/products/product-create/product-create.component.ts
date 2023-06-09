import { Component, ElementRef, EventEmitter, Inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IBrand } from '../../../models/brand';
import { ICategory } from '../../../models/category';
import { ProductService } from 'src/app/services/product.service';
import { BrandService } from 'src/app/services/brand.service';
import { CategoryService } from 'src/app/services/category.service';
import { IProductRes } from '../../../models/response/IProductRes';
import { IProductCreateReq } from 'src/app/models/request/IProductCreateReq';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize, forkJoin } from 'rxjs';
import { IProductImage } from 'src/app/models/product-image';
import { AlertDialogComponent } from '../../shared/alert/alert-dialog.component';

@Component({
    selector: 'app-product-create',
    templateUrl: './product-create.component.html',
    styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent {
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
    @ViewChild('imageDialog') imageDialog!: TemplateRef<any>;

    @Output() productCreated: EventEmitter<IProductRes> = new EventEmitter<IProductRes>();


    initialFileCount = 0;

    productForm: FormGroup;
    brands!: IBrand[];
    categories!: ICategory[];

    selectedFiles: any[] = [];
    filePreviews: any[] = [];
    downloadUrls!: string[];


    constructor(
        private formBuilder: FormBuilder,
        private productService: ProductService,
        private brandService: BrandService,
        private categoryService: CategoryService,
        public dialogRef: MatDialogRef<ProductCreateComponent>,
        public dialog: MatDialog,
        private storage: AngularFireStorage,
    ) {
        this.productForm = this.formBuilder.group({
            productName: ['', Validators.required],
            description: [''],
            sellingPrice: [0],
            category: [null, Validators.required],
            brand: [null, Validators.required]
        });

        this.getBrands();
        this.getCategories();

    }

    onSubmit(): void {
        if (this.productForm.valid) {
            const product: IProductCreateReq = this.productForm.value;
            // Perform save or update operation using the brand data

            this.uploadFiles().subscribe((urls) => {

                this.createProduct(urls);

            })
        }
    }

    openAlertDialog(message:string, title:string) {
        const dialogRef: MatDialogRef<any> = this.dialog.open(AlertDialogComponent, {
          width: '300px',
          data: { message: message, title: title }
        });
      }

    getBrands(): void {
        this.brandService.getBrands().subscribe(res => {
            this.brands = res.data;
        });
    }


    getCategories(): void {
        this.categoryService.getCategories().subscribe(res => {
            this.categories = res.data;
        });
    }

    cancel(): void {
        this.dialogRef.close();
    }

    createProduct(downloadUrls: string[]): void {

        console.log("Creating product")
        if (this.productForm.invalid) {
            return;
        }

        const { productName, description, sellingPrice, brand, category } = this.productForm.value;

        const product: IProductCreateReq = {
            productName,
            description,
            brand: brand.brandId || null,
            sellingPrice,
            category: category.categoryId || null,
            imageUrls: downloadUrls
        };

        this.productService.createProduct(product)
            .subscribe(
                (createdProduct: IProductRes) => {
                    console.log('Product created successfully:', createdProduct);

                    this.productCreated.emit(createdProduct);
                    this.productForm.reset();
                    this.dialogRef.close();

                },
                error => {
                    //To-Do need to refactor the delete image flow on product creation failed
                    this.selectedFiles.forEach((file) => {
                        this.deleteFileStorage(file.name);
                    })
                    //debugger
                    this.openAlertDialog(error.error.message,"Failed")
                    console.error('Failed to create product:', error);
                }
            );
    }

    showImage(imageUrl: string): void {
        this.dialog.open(this.imageDialog, {
            data: imageUrl
        });
    }

    onFileSelected(event: any): void {
        //debugger
        this.selectedFiles = Array.from(event.target.files);
        this.filePreviews = [];

        // Generate file previews
        for (const file of this.selectedFiles) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.filePreviews.push(e.target.result);
            };
            reader.readAsDataURL(file);
        }

    }

    private deleteFileStorage(name: string): void {
        //debugger
        const storageRef = this.storage.ref('product-images/');
        storageRef.child(name).delete();
    }

    removeImage(index: number): void {
        //debugger
        this.selectedFiles.splice(index, 1);
        this.filePreviews.splice(index,1)

        // Reset the file input if all images are removed
        if (this.selectedFiles.length === 0) {
            this.resetFileInput();
        }

    }

    private resetFileInput(): void {
        // Clear the selected files by resetting the file input value
        if (this.fileInput && this.fileInput.nativeElement) {
            this.fileInput.nativeElement.value = '';
        }
    }

    uploadFiles(): Observable<string[]> {
        return new Observable<string[]>(observer => {
            if (!this.selectedFiles || this.selectedFiles.length === 0) {
                observer.complete();
                return;
            }

            const uploadObservables: Observable<string>[] = [];

            for (const file of this.selectedFiles) {
                //debugger
                const filePath = `product-images/${file.name}`;
                const fileRef = this.storage.ref(filePath);
                const uploadTask = this.storage.upload(filePath, file);

                const uploadObservable = new Observable<string>(innerObserver => {
                    uploadTask.snapshotChanges().pipe(
                        finalize(() => {
                            fileRef.getDownloadURL().subscribe(downloadUrl => {
                                innerObserver.next(downloadUrl);
                                innerObserver.complete();
                            });
                        })
                    ).subscribe();
                });

                uploadObservables.push(uploadObservable);
            }

            if (uploadObservables.length > 0) {
                forkJoin(uploadObservables).subscribe((results: string[]) => {
                    observer.next(results);
                    observer.complete();
                });
            } else {
                observer.complete();
            }
        });
    }
}
