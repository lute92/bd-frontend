import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IBrand } from '../../../models/brand';
import { ICategory } from '../../../models/category';
import { ProductService } from 'src/app/services/product.service';
import { BrandService } from 'src/app/services/brand.service';
import { CategoryService } from 'src/app/services/category.service';
import { IProductRes } from '../../../models/response/IProductRes';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, ReplaySubject, Subject, catchError, finalize, forkJoin, last, lastValueFrom, map, of, switchMap, take, takeUntil, tap, throwError } from 'rxjs';
import { IProductImage } from 'src/app/models/product-image';
import { AlertDialogComponent } from '../../shared/alert/alert-dialog.component';
import { MatSelect } from '@angular/material/select';
import { CategoryCreateComponent } from '../../categories/category-create/category-create.component';
import { BrandCreateComponent } from '../../brands/brand-create/brand-create.component';
import { ActivatedRoute } from '@angular/router';
import { IProductReq } from 'src/app/models/request/IProductReq';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.services';
import { FileUploadResult } from 'src/app/models/fileupload-result';
import { v4 as uuidv4 } from 'uuid';
import { ConfirmationDialogComponent } from '../../shared/confirmation/confirmation.component';

@Component({
    selector: 'app-product-edit',
    templateUrl: './product-edit.component.html',
    styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent {
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
    @ViewChild('imageDialog') imageDialog!: TemplateRef<any>;

    @Output() productCreated: EventEmitter<IProductRes> = new EventEmitter<IProductRes>();

    productId: string | null = "";
    productInfo!: any;

    initialFileCount = 0;

    productForm: FormGroup;
    brands!: IBrand[];
    categories!: ICategory[];

    selectedFiles: any[] = [];
    filePreviews: any[] = [];
    downloadUrls!: string[];

    isUpdateProcessRunning: boolean = false;
    filesTouched: boolean = false;

    /** control for the MatSelect filter keyword */
    public categoryFilterCtrl: FormControl<string | null> = new FormControl<string>('');
    public brandFilterCtrl: FormControl<string | null> = new FormControl<string>('');

    /** list of categories and brand filtered by search keyword */
    public filteredCategories: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public filteredBrands: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);


    @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private productService: ProductService,
        private brandService: BrandService,
        private categoryService: CategoryService,
        public dialogRef: MatDialogRef<ProductEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { productId: string },
        public dialog: MatDialog,
        private storage: AngularFireStorage,
        private route: ActivatedRoute,
        private firebaseService: FirebaseStorageService
    ) {
        this.productForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: [''],
            sellingPrice: [0],
            category: [null, Validators.required],
            brand: [null, Validators.required]
        });

        this.bindProductForm();

    }

    async bindProductForm() {
        debugger
        await Promise.all([this.getBrands(), this.getCategories()]);

        // Convert ReplaySubject to array
        const categoriesArray = await this.filteredCategories.pipe(take(1)).toPromise();
        const brandsArray = await this.filteredBrands.pipe(take(1)).toPromise();

        if (this.data.productId) {
            this.productService.getProduct(this.data.productId).subscribe((res) => {
                //this.productInfo = {} as any; // Initialize as an empty object

                if (res) {
                    debugger
                    this.productInfo = res;

                    const { name, description, sellingPrice, category, brand, images, weight } = this.productInfo;

                    const selectedCategory = categoriesArray?.find(categoryItem => categoryItem._id === category);
                    const selectedBrand = brandsArray?.find(brandItem => brandItem._id === brand);

                    this.productForm.patchValue({
                        name,
                        description,
                        sellingPrice
                    });

                    this.productForm.get('category')?.patchValue(selectedCategory);
                    this.productForm.get('brand')?.patchValue(selectedBrand);

                    this.filePreviews = this.productInfo.images.slice();

                    let downloadUrls = this.productInfo.images.map((item:any) => {return item.url});

                    this.downloadFiles(downloadUrls).then((files) => {
                        this.selectedFiles = files;
                        console.log(this.selectedFiles)
                    })

                }
            });
        }
    }

    protected filterCategories() {
        if (!this.categories) {
            return;
        }
        // get the search keyword
        let search = this.categoryFilterCtrl.value;
        if (!search) {
            this.filteredCategories.next(this.categories.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredCategories.next(
            this.categories.filter(category => {
                const searchTerm = search ? search.toLowerCase() : '';
                return category.name.toLowerCase().indexOf(searchTerm) > -1;
            })
        );
    }

    protected filterBrands() {
        if (!this.brands) {
            return;
        }
        // get the search keyword
        let search = this.brandFilterCtrl.value;
        if (!search) {
            this.filteredBrands.next(this.brands.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBrands.next(
            this.brands.filter(brand => {
                const searchTerm = search ? search.toLowerCase() : '';
                return brand.name.toLowerCase().indexOf(searchTerm) > -1;
            })
        );
    }

    openCategoryCreateForm(): void {
        const dialogRef = this.dialog.open(CategoryCreateComponent, {
            width: '40%',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(() => {
            console.log('Category form closed');
            this.getCategories();
        });
    }

    openBrandCreateForm(): void {
        const dialogRef = this.dialog.open(BrandCreateComponent, {
            width: '40%',
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(() => {
            console.log('Brand form closed');
            this.getBrands();
        });
    }

    async getBrands(): Promise<any> {
        const brandsSubject = new Subject<any>();

        this.brandService.getBrands(0, 0).subscribe(res => {

            this.brands = res.brands;

            // set initial selection
            if (this.brands && this.brands.length > 0) {
                this.productForm.controls['brand'].setValue(this.brands[0]);
            }


            // load the initial brand list
            this.filteredBrands.next(this.brands.slice());

            // listen for search field value changes
            this.brandFilterCtrl.valueChanges
                .pipe(takeUntil(this._onDestroy))
                .subscribe(() => {
                    this.filterBrands();
                });

            brandsSubject.next(this.brands);
            brandsSubject.complete();

        });
    }

    async getCategories(): Promise<any> {
        const categorySubject = new Subject<any>();

        this.categoryService.getCategories(0, 0).subscribe(res => {

            this.categories = res.categories;

            // set initial selection
            if (this.categories && this.categories.length > 0) {
                this.productForm.controls['category'].setValue(this.categories[0]);
            }

            // load the initial brand list
            this.filteredCategories.next(this.categories.slice());

            // listen for search field value changes
            this.categoryFilterCtrl.valueChanges
                .pipe(takeUntil(this._onDestroy))
                .subscribe(() => {
                    this.filterCategories();
                });

            categorySubject.next(this.categories);
            categorySubject.complete();

        });
    }

    onSubmit(): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: "Confirmation.",
                message: "Are you sure to update changes?"
            }
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                console.log('Update confirmed.');
                this.updateProductWithFiles();
            } else {
                console.log('Update cancelled.');
            }
        });
    }

    updateProductWithFiles(): void {
        if (this.productForm.valid) {
            this.isUpdateProcessRunning = true;
            this.uploadFiles()
                .pipe(
                    switchMap((urls) => this.updateProduct(urls)),
                    finalize(() => {
                        this.isUpdateProcessRunning = false; // Set isUpdateProcessRunning to false after the operation completes (success or error)
                    })
                )
                .subscribe(
                    (createdProduct: IProductRes) => {
                        console.log("Product info updated successfully.");
                    },
                    (error) => {
                        console.error("Product update failed.", error);
                    }
                );
        }
    }


    updateProduct(fileUploadResults: FileUploadResult[]): Observable<IProductRes> {
        console.log("Creating product");

        if (this.productForm.invalid) {
            return throwError('Invalid form');
        }

        const { name, description, sellingPrice, brand, category } = this.productForm.value;

        const product = {
            name: name,
            description,
            brand: brand._id || null,
            sellingPrice,
            category: category._id || null,
            images: fileUploadResults,
        };

        return this.productService.updateProduct(this.productInfo._id, product).pipe(
            tap((createdProduct: IProductRes) => {
                console.log('Product created successfully:', createdProduct);
                this.productCreated.emit(createdProduct);
                this.productForm.reset();
                this.dialogRef.close();
            }),
            catchError((error) => {
                this.selectedFiles.forEach((file) => {
                    this.deleteFileStorage(file.name);
                });
                this.openAlertDialog(error.error.message, "Failed");
                console.error('Failed to create product:', error);
                return throwError(error);
            })
        );
    }


    openAlertDialog(message: string, title: string) {
        const dialogRef: MatDialogRef<any> = this.dialog.open(AlertDialogComponent, {
            width: '300px',
            data: { message: message, title: title }
        });
    }

    cancel(): void {
        this.dialogRef.close();
    }

    showImagePreview(imageUrl: string): void {
        this.dialog.open(this.imageDialog, {
            data: imageUrl
        });
    }

    onFileSelected(event: any): void {
        this.filesTouched = true;
        //debugger
        Array.from(event.target.files).forEach((file) => {
            this.selectedFiles.push(file);

            this.getDataUrl(file).then((dataUrl) => {
                this.filePreviews.push({ _id: "", url: dataUrl })
            })
        })

        console.log("File previews", this.filePreviews);
        console.log("Selected Files", this.selectedFiles);

    }

    getDataUrl(file: any): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                resolve(e.target.result);
            };
            reader.onerror = (e) => {
                reject(e);
            };
            reader.readAsDataURL(file);
        });
    }

    deleteFileStorage(name: string): Observable<any> {
        //debugger
        const storageRef = this.storage.ref('product-images/');
        return storageRef.child(name).delete();
    }

    removeImage(index: number): void {
        this.filesTouched = true;
        console.log(this.filesTouched);
        //debugger
        this.selectedFiles.splice(index, 1);
        this.filePreviews.splice(index, 1)

        // Reset the file input if all images are removed
        if (this.selectedFiles.length === 0) {
            this.resetFileInput();
        }
        console.log(this.filePreviews)
        console.log(this.selectedFiles)
    }

    resetFileInput(): void {
        // Clear the selected files by resetting the file input value
        if (this.fileInput && this.fileInput.nativeElement) {
            this.fileInput.nativeElement.value = '';
        }
    }

    uploadFiles(): Observable<FileUploadResult[]> {

        if (!this.selectedFiles || this.selectedFiles.length === 0) {
            return of([]);
        }
        console.log(this.productInfo);
        this.productInfo.images.forEach((image:any) => {

            let fileName = image.fileName.replace("product-images/", "");
            this.deleteFileStorage(fileName)
        })


        const uploadObservables: Observable<FileUploadResult>[] = [];

        for (const file of this.selectedFiles) {
            const fileName = `product-images/${uuidv4()}`;
            const fileRef = this.storage.ref(fileName);
            const uploadTask = this.storage.upload(fileName, file);

            const uploadObservable = uploadTask.snapshotChanges().pipe(
                last(),
                switchMap(() => fileRef.getDownloadURL()),
                map(url => ({
                    product: "",
                    fileName,
                    url
                }))
            );

            uploadObservables.push(uploadObservable);
        }

        return uploadObservables.length > 0 ? forkJoin(uploadObservables) : of([]);
    }

    async downloadFiles(urls: string[]): Promise<any[]> {
        const promises: Promise<any>[] = urls.map((url) => {
            return lastValueFrom(this.firebaseService.getFile(url));
        });

        try {
            const files: any[] = await Promise.all(promises);
            this.selectedFiles = files;

            return files;

        } catch (error) {
            throw error;
        }
    }

    openUpdateConfirmationDialog(): void {


    }

}

