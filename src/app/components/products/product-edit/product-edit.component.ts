import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
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
import { BehaviorSubject, Observable, ReplaySubject, Subject, finalize, forkJoin, last, map, of, switchMap, take, takeUntil } from 'rxjs';
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
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.services';
import { ConfirmationDialogComponent } from '../../shared/confirmation/confirmation.component';

@Component({
    selector: 'app-product-edit',
    templateUrl: './product-edit.component.html',
    styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
    @ViewChild('imageDialog') imageDialog!: TemplateRef<any>;

    @Output() productUpdated: EventEmitter<IProductRes> = new EventEmitter<IProductRes>();

    initialFileCount = 0;

    productForm: FormGroup;
    brands!: IBrand[];
    categories!: ICategory[];
    initialProductData: any = {};

    selectedFiles: any[] = [];
    filePreviews: any[] = [];
    downloadUrls!: string[];
    selectedFileNames: string[] = [];

    productImages: {_id: string, url: string, fileName:string }[] = [];
    isUpdateProcessRunning: boolean = false;
    filesTouched: boolean = false;

    batches: IProductBatch[] = [];
    batchesDataSource: IProductBatch[] = [];

    batchListDisplayColumns: string[] = [
        'mnuDate', 'expDate', 'purchasePrice', 'sellingPrice', 'quantity', 'note', 'actions'
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

    productId!: string;

    constructor(
        private formBuilder: FormBuilder,
        private productService: ProductService,
        private brandService: BrandService,
        private categoryService: CategoryService,
        public dialog: MatDialog,
        private storage: AngularFireStorage,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
        private firebaseService: FirebaseStorageService
    ) {
        this.productForm = this.formBuilder.group({
            productName: ['', Validators.required],
            description: [''],
            category: [null, Validators.required],
            brand: [null, Validators.required],
            batches: [[]]
        });

    }

    async ngOnInit(): Promise<void> {
        this.productId = this.route.snapshot.paramMap.get('id')!;
        await this.bindProductForm();
    }

    async bindProductForm() {

        await Promise.all([this.getBrands(), this.getCategories()]);

        // Convert ReplaySubject to array
        const categoriesArray = await this.filteredCategories.pipe(take(1)).toPromise();
        const brandsArray = await this.filteredBrands.pipe(take(1)).toPromise();

        if (this.productId) {
            this.productService.getProduct(this.productId).subscribe((product: any) => {

                if (product) {
                    this.productForm.patchValue({
                        productName: product.name,
                        description: product.description,
                        batches: product.batches
                    });

                    const selectedCategory = categoriesArray?.find(categoryItem => categoryItem._id === product.category);
                    const selectedBrand = brandsArray?.find(brandItem => brandItem._id === product.brand);

                    this.productForm.controls['category'].setValue(selectedCategory);
                    this.productForm.controls['brand'].setValue(selectedBrand);

                    this.batches = product.batches;
                    this.batchesDataSource = [...this.batches];

                    this.filePreviews = product.images.slice();

                    
                    let urls = product.images.map((image: any) => {
                        this.productImages.push(image);
                        return image.url;
                    });

                    this.getProductImageDownloadUrls(urls).then((firebaseStorageUrls) => {
                        for(let i=0; i< firebaseStorageUrls.length; i++){
                            this.productImages[i].url = firebaseStorageUrls[i];
                        }
                    })

                    // Store initial product data
                    this.initialProductData = {
                        productName: product.name,
                        description: product.description,
                        category: selectedCategory,
                        brand: selectedBrand,
                        batches: product.batches
                    };

                }
            });
        }
    }

    loadProduct(): void {
        this.productService.getProduct(this.productId).subscribe((product: IProductRes) => {
            this.productForm.patchValue({
                productName: product.productName,
                description: product.description,
                category: product.category,
                brand: product.brand,
                batches: product.batches
            });

            this.filePreviews = product.images.map(image => image.url);
            this.batches = product.batches;
            this.batchesDataSource = [...this.batches];
        });
    }

    filterCategories() {
        if (!this.categories) {
            return;
        }
        let search = this.categoryFilterCtrl.value ?? '';  // Default to an empty string if search is null
        search = search.toLowerCase();

        this.filteredCategories.next(
            this.categories.filter(category => category.name.toLowerCase().includes(search))
        );
    }

    filterBrands() {
        if (!this.brands) {
            return;
        }
        let search = this.brandFilterCtrl.value ?? '';  // Default to an empty string if search is null
        if (typeof search === 'string') {
            search = search.toLowerCase();
        } else {
            search = ''; // Handle the null case explicitly
        }
        this.filteredBrands.next(
            this.brands.filter(brand => brand.name.toLowerCase().includes(search))
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
            this.brands = res.brands;
            this.filteredBrands.next(this.brands.slice());
            this.brandFilterCtrl.valueChanges
                .pipe(takeUntil(this._onDestroy))
                .subscribe(() => {
                    this.filterBrands();
                });
        });
    }

    getCategories(): void {
        this.categoryService.getCategories(0, 0).subscribe(res => {
            this.categories = res.categories;
            this.filteredCategories.next(this.categories.slice());
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

    updateProduct(): void {
        if (this.productForm.invalid) {
            return;
        }
    
        const { productName, description, brand, category } = this.productForm.value;
        debugger
        const updatedFields: any = {};
    
        if (productName !== this.initialProductData.productName) {
            updatedFields.name = productName;
        }
        if (description !== this.initialProductData.description) {
            updatedFields.description = description;
        }
        if (brand && brand._id !== this.initialProductData.brand._id) {
            updatedFields.brand = brand._id;
        }
        if (category && category._id !== this.initialProductData.category._id) {
            updatedFields.category = category._id;
        }
    
        // Only proceed if there are changes
        if (Object.keys(updatedFields).length === 0) {
            this.messageService.showMessage("No changes detected.", 10000, "warning");
            return;
        }
    
        this.productService.updateProduct(this.productId, updatedFields)
            .subscribe(
                (updatedProduct: IProductRes) => {
                    this.productUpdated.emit(updatedProduct);
                    this.messageService.showMessage("Product information updated.", 10000, "success");
                    //this.router.navigate(['/products']);
                },
                error => {
                    this.openAlertDialog(error.error.message, "Failed");
                    this.messageService.showMessage(`Failed to update product information: ${error.message}`, 5000, "error");
                    //console.error('Failed to update product information:', error);
                }
            );
    }
    

    onFileSelected(event: any): void {
        this.filesTouched = true;
        const fileList: FileList = event.target.files;

        // Convert FileList to an array
        this.selectedFiles = Array.from(fileList);

        const formData = new FormData();

        for (let i = 0; i < this.selectedFiles.length; i++) {
            formData.append('images', this.selectedFiles[i]);
        }

        this.productService.uploadProductImages(this.productId, formData).subscribe(
            (updatedProduct: IProductRes) => {

                this.productImages = updatedProduct.images;

                let urls = updatedProduct.images.map((image: any) => {
                    return image.url;
                });

                this.getProductImageDownloadUrls(urls).then((firebaseStorageUrls) => {
                    for(let i =0; i < firebaseStorageUrls.length; i++){
                        this.productImages[i].url = firebaseStorageUrls[i];
                    }
                    this.messageService.showMessage("Image uploaded.", 10000, "success");
                })


            },
            error => {
                this.openAlertDialog(error.error.message, "Failed to update product images.");
                this.messageService.showMessage(`Failed to update product: ${error.message}`, 5000, "error");
                console.error('Failed to update product:', error.message);
            }
        );
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

    async getProductImageDownloadUrls(urls: string[]): Promise<string[]> {
        const promises: Promise<string>[] = urls.map(async (url) => {
            try {
                return await this.firebaseService.getDownloadUrl(url);
            } catch (error: any) {
                console.error(`Failed to get download URL for ${url}:`, error.message);
                // You can choose to return a default value or handle the error in a different way
                return ''; // or throw error;
            }
        });

        const downloadUrls: string[] = await Promise.all(promises);

        return downloadUrls;
    }

    deleteFileStorage(name: string): Observable<any> {
        //
        const storageRef = this.storage.ref('product-images/');
        return storageRef.child(name).delete();
    }

    showImagePreview(imageUrl: string): void {
        this.dialog.open(this.imageDialog, {
            data: imageUrl
        });
    }

    removeImage(id: string): void {

        let file = this.productImages.find((img)=> { return img._id === id});
        
        if(file){
            const filename = this.getFilenameFromUrl(file.url);
            this.productService.deleteProductImage(this.productId, filename, id).subscribe(
                (updatedProduct: IProductRes) => {
    
                    this.productImages = updatedProduct.images;
    
                    let urls = updatedProduct.images.map((image: any) => {
                        return image.url;
                    });
    
                    this.getProductImageDownloadUrls(urls).then((firebaseStorageUrls) => {
                        for(let i =0; i < firebaseStorageUrls.length; i++){
                            this.productImages[i].url = firebaseStorageUrls[i];
                        }
                        this.messageService.showMessage("Image deleted.", 10000, "success");
                    })
    
    
                },
                error => {
                    this.openAlertDialog(error.error.message, "Failed to delete product images.");
                    this.messageService.showMessage(`Failed to update product: ${error.message}`, 5000, "error");
                    console.error('Failed to delete product:', error.message);
                }
            );
        }
        
    }

    resetFileInput(): void {
        if (this.fileInput && this.fileInput.nativeElement) {
            this.fileInput.nativeElement.value = '';
        }
    }

    triggerFileInput(fileInput: HTMLInputElement): void {
        fileInput.click();
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

    openUpdateConfirmationDialog(): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: "Confirmation.",
                message: "Are you sure to update this product's information?"
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log('Update confirmed.');

                this.updateProduct();

            } else {
                // Cancel logic
                console.log('Update canceled.');
            }
        });
    }

    getFilenameFromUrl(url: string): string {
        // Create a new URL object from the given URL
        const parsedUrl = new URL(url);
        
        // Get the pathname from the URL
        const pathname = parsedUrl.pathname;
        
        // Split the pathname by '/' and get the last segment
        const segments = pathname.split('/');
        const filename = segments.pop() || '';
        
        return filename;
      }
      

}
