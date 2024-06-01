<<<<<<< HEAD
import { Component, ElementRef, EventEmitter, Inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IBrand } from '../../../models/brand';
import { ICategory } from '../../../models/category';
import { ProductService } from 'src/app/services/product.service';
import { BrandService } from 'src/app/services/brand.service';
import { CategoryService } from 'src/app/services/category.service';
import { IProductRes } from '../../../models/response/IProductRes';
import { IProductReq } from 'src/app/models/request/IProductReq';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, Observable, ReplaySubject, Subject, finalize, forkJoin, last, map, of, switchMap, takeUntil } from 'rxjs';
import { IProductImage } from 'src/app/models/product-image';
import { AlertDialogComponent } from '../../shared/alert/alert-dialog.component';
import { MatSelect } from '@angular/material/select';
import { CategoryCreateComponent } from '../../categories/category-create/category-create.component';
import { BrandCreateComponent } from '../../brands/brand-create/brand-create.component';
import { FileUploadResult } from 'src/app/models/fileupload-result';
import { v4 as uuidv4 } from 'uuid';
import { ProductBatchCreateComponent } from '../product-batch-create/product-batch-create.component';
import { IProductBatch } from 'src/app/models/productBatch';
import { MessageService } from 'src/app/services/message.service';
import { Router } from '@angular/router';

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

    batches: IProductBatch[] = [];
    batchesDataSource: IProductBatch[] = [];

    batchListDisplayColumns: string[] = [
        'mnuDate', 'expDate','purchasePrice','sellingPrice', 'quantity', 'note', 'actions'
    ];

    /** control for the MatSelect filter keyword */
    public categoryFilterCtrl: FormControl<string | null> = new FormControl<string>('');
    public brandFilterCtrl: FormControl<string | null> = new FormControl<string>('');

    /** list of categories and brand filtered by search keyword */
    public filteredCategories: ReplaySubject<ICategory[]> = new ReplaySubject<ICategory[]>(1);
    public filteredBrands: ReplaySubject<IBrand[]> = new ReplaySubject<IBrand[]>(1);


    @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private productService: ProductService,
        private brandService: BrandService,
        private categoryService: CategoryService,
        public dialog: MatDialog,
        private storage: AngularFireStorage,
        private messageService: MessageService,
        private router: Router
    ) {
        this.productForm = this.formBuilder.group({
            productName: ['', Validators.required],
            description: [''],
            category: [null, Validators.required],
            brand: [null, Validators.required],
            batches: [[]]
        });

        this.getBrands();
        this.getCategories();
    }

    filterCategories() {
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

        this.filteredCategories.next(
            this.categories.filter(category => {
                const searchTerm = search ? search.toLowerCase() : '';
                return category.name.toLowerCase().indexOf(searchTerm) > -1;
            })
        );
    }

    filterBrands() {
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

    openAlertDialog(message: string, title: string) {
        const dialogRef: MatDialogRef<any> = this.dialog.open(AlertDialogComponent, {
            width: '300px',
            data: { message: message, title: title }
        });
    }

    getBrands(): void {
        this.brandService.getBrands(0, 0).subscribe(res => {
            //
            this.brands = res.brands;

            // set initial selection
            this.productForm.controls['brand'].setValue(this.brands[0]);

            // load the initial brand list
            this.filteredBrands.next(this.brands.slice());

            // listen for search field value changes
            this.brandFilterCtrl.valueChanges
                .pipe(takeUntil(this._onDestroy))
                .subscribe(() => {
                    this.filterBrands();
                });

        });
    }

    getCategories(): void {
        this.categoryService.getCategories(0, 0).subscribe(res => {
            //
            this.categories = res.categories;

            // set initial selection
            this.productForm.controls['category'].setValue(this.categories[0]);

            // load the initial brand list
            this.filteredCategories.next(this.categories.slice());

            // listen for search field value changes
            this.categoryFilterCtrl.valueChanges
                .pipe(takeUntil(this._onDestroy))
                .subscribe(() => {
                    this.filterCategories();
                });

        });
    }

    cancel(): void {
        this.router.navigate(['/products']);
    }

    createProduct(): void {
        if (this.productForm.invalid) {
            return;
        }

        const { productName, description, brand, category } = this.productForm.value;

        const formData = new FormData();
        formData.append('name', productName);
        formData.append('description', description);
        formData.append('brand', brand._id || null);
        formData.append('category', category._id || null);
        formData.append('batches', JSON.stringify(this.batches)); // Convert to string before sending

        for (let i = 0; i < this.selectedFiles.length; i++) {
            formData.append('images', this.selectedFiles[i]);
        }

        this.productService.createProduct(formData)
            .subscribe(
                (createdProduct: IProductRes) => {
                    console.log('Product created successfully:', createdProduct);
                    this.productCreated.emit(createdProduct);
                    this.productForm.reset();
                    this.filePreviews = [];
                    //this.dialogRef.close();
                    this.messageService.showMessage("Product created.", 5000, "success");
                    this.batches = [];
                    this.batchesDataSource = [...this.batches];
                    this.resetFileInput();
                },
                error => {
                    this.openAlertDialog(error.error.message, "Failed");
                    this.messageService.showMessage(`Failed to create product: ${error}`, 5000, "error");
                    console.error('Failed to create product:', error);
                }
            );
    }


    showImagePreview(imageUrl: string): void {
        this.dialog.open(this.imageDialog, {
            data: imageUrl
        });
    }

    onFileSelected(event: any): void {

        if (event.target.files.length > 0) {
            const fileList: FileList = event.target.files;

            // Convert FileList to an array
            this.selectedFiles = Array.from(fileList);

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

    }

    removeImage(index: number): void {
        debugger
        this.selectedFiles.splice(index, 1);
        this.filePreviews.splice(index, 1)

        // Reset the file input if all images are removed
        if (this.selectedFiles.length === 0) {
            this.resetFileInput();
        }

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

    removeBatchTableItem(index: number) {
        this.batches.splice(index, 1);
        this.batchesDataSource = [...this.batches];
    }

    editBatchTableItem() {
        throw new Error('Method not implemented.');
    }

    openProductBatchCreateDialog() {
        const dialogRef = this.dialog.open(ProductBatchCreateComponent, {
            width: '40%',
            disableClose: true
        });
        debugger
        dialogRef.componentInstance.productBatchAdded.subscribe((addedProductBatch: IProductBatch) => {
            this.batches.push(addedProductBatch);
            this.batchesDataSource = [...this.batches];
        });
    }

}
=======
import { Component, ElementRef, EventEmitter, Inject, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IBrand } from '../../../models/brand';
import { ICategory } from '../../../models/category';
import { ProductService } from 'src/app/services/product.service';
import { BrandService } from 'src/app/services/brand.service';
import { CategoryService } from 'src/app/services/category.service';
import { IProductRes } from '../../../models/response/IProductRes';
import { IProductReq } from 'src/app/models/request/IProductReq';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, Observable, ReplaySubject, Subject, finalize, forkJoin, last, map, of, switchMap, takeUntil } from 'rxjs';
import { IProductImage } from 'src/app/models/product-image';
import { AlertDialogComponent } from '../../shared/alert/alert-dialog.component';
import { MatSelect } from '@angular/material/select';
import { CategoryCreateComponent } from '../../categories/category-create/category-create.component';
import { BrandCreateComponent } from '../../brands/brand-create/brand-create.component';
import { FileUploadResult } from 'src/app/models/fileupload-result';
import { v4 as uuidv4 } from 'uuid';
import { ProductBatchCreateComponent } from '../product-batch-create/product-batch-create.component';
import { IProductBatch } from 'src/app/models/productBatch';
import { MessageService } from 'src/app/services/message.service';
import { Router } from '@angular/router';

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

    batches: IProductBatch[] = [];
    batchesDataSource: IProductBatch[] = [];

    batchListDisplayColumns: string[] = [
        'mnuDate', 'expDate', 'quantity', 'note', 'actions'
    ];

    /** control for the MatSelect filter keyword */
    public categoryFilterCtrl: FormControl<string | null> = new FormControl<string>('');
    public brandFilterCtrl: FormControl<string | null> = new FormControl<string>('');

    /** list of categories and brand filtered by search keyword */
    public filteredCategories: ReplaySubject<ICategory[]> = new ReplaySubject<ICategory[]>(1);
    public filteredBrands: ReplaySubject<IBrand[]> = new ReplaySubject<IBrand[]>(1);


    @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;

    /** Subject that emits when the component has been destroyed. */
    protected _onDestroy = new Subject<void>();

    constructor(
        private formBuilder: FormBuilder,
        private productService: ProductService,
        private brandService: BrandService,
        private categoryService: CategoryService,
        public dialog: MatDialog,
        private storage: AngularFireStorage,
        private messageService: MessageService,
        private router: Router
    ) {
        this.productForm = this.formBuilder.group({
            productName: ['', Validators.required],
            description: [''],
            category: [null, Validators.required],
            brand: [null, Validators.required],
            batches: [[]]
        });

        this.getBrands();
        this.getCategories();
    }

    filterCategories() {
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

        this.filteredCategories.next(
            this.categories.filter(category => {
                const searchTerm = search ? search.toLowerCase() : '';
                return category.name.toLowerCase().indexOf(searchTerm) > -1;
            })
        );
    }

    filterBrands() {
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

    openAlertDialog(message: string, title: string) {
        const dialogRef: MatDialogRef<any> = this.dialog.open(AlertDialogComponent, {
            width: '300px',
            data: { message: message, title: title }
        });
    }

    getBrands(): void {
        this.brandService.getBrands(0, 0).subscribe(res => {
            //
            this.brands = res.brands;

            // set initial selection
            this.productForm.controls['brand'].setValue(this.brands[0]);

            // load the initial brand list
            this.filteredBrands.next(this.brands.slice());

            // listen for search field value changes
            this.brandFilterCtrl.valueChanges
                .pipe(takeUntil(this._onDestroy))
                .subscribe(() => {
                    this.filterBrands();
                });

        });
    }

    getCategories(): void {
        this.categoryService.getCategories(0, 0).subscribe(res => {
            //
            this.categories = res.categories;

            // set initial selection
            this.productForm.controls['category'].setValue(this.categories[0]);

            // load the initial brand list
            this.filteredCategories.next(this.categories.slice());

            // listen for search field value changes
            this.categoryFilterCtrl.valueChanges
                .pipe(takeUntil(this._onDestroy))
                .subscribe(() => {
                    this.filterCategories();
                });

        });
    }

    cancel(): void {
        this.router.navigate(['/products']);
    }

    createProduct(): void {
        if (this.productForm.invalid) {
            return;
        }

        const { productName, description, brand, category } = this.productForm.value;

        const formData = new FormData();
        formData.append('name', productName);
        formData.append('description', description);
        formData.append('brand', brand._id || null);
        formData.append('category', category._id || null);
        formData.append('batches', JSON.stringify(this.batches)); // Convert to string before sending

        for (let i = 0; i < this.selectedFiles.length; i++) {
            formData.append('images', this.selectedFiles[i]);
        }

        this.productService.createProduct(formData)
            .subscribe(
                (createdProduct: IProductRes) => {
                    console.log('Product created successfully:', createdProduct);
                    this.productCreated.emit(createdProduct);
                    this.productForm.reset();
                    this.filePreviews = [];
                    //this.dialogRef.close();
                    this.messageService.showMessage("Product created.", 5000, "success");
                    this.resetFileInput();
                },
                error => {
                    this.openAlertDialog(error.error.message, "Failed");
                    this.messageService.showMessage(`Failed to create product: ${error}`, 5000, "error");
                    console.error('Failed to create product:', error);
                }
            );
    }


    showImagePreview(imageUrl: string): void {
        this.dialog.open(this.imageDialog, {
            data: imageUrl
        });
    }

    onFileSelected(event: any): void {

        if (event.target.files.length > 0) {
            const fileList: FileList = event.target.files;

            // Convert FileList to an array
            this.selectedFiles = Array.from(fileList);

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

    }

    removeImage(index: number): void {
        debugger
        this.selectedFiles.splice(index, 1);
        this.filePreviews.splice(index, 1)

        // Reset the file input if all images are removed
        if (this.selectedFiles.length === 0) {
            this.resetFileInput();
        }

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

    removeBatchTableItem(index: number) {
        this.batches.splice(index, 1);
        this.batchesDataSource = [...this.batches];
    }

    editBatchTableItem() {
        throw new Error('Method not implemented.');
    }

    openProductBatchCreateDialog() {
        const dialogRef = this.dialog.open(ProductBatchCreateComponent, {
            width: '40%',
            disableClose: true
        });

        dialogRef.componentInstance.productBatchAdded.subscribe((addedProductBatch: IProductBatch) => {
            this.batches.push(addedProductBatch);
            this.batchesDataSource = [...this.batches];
        });
    }

}
>>>>>>> 29e195d518aa4b1b23533cc902d31e4ed2f15ab0
