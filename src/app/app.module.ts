import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrandListComponent } from './components/brands/brand-list/brand-list.component';
import { MaterialModule } from './material/material.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrandCreateComponent } from './components/brands/brand-create/brand-create.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBar } from '@angular/material/progress-bar';
import { LoaderInterceptor } from './utils/loader-interceptor';
import { LoaderComponent } from './components/shared/loader/loader.component';
import { CategoryCreateComponent } from './components/categories/category-create/category-create.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { ConfirmationDialogComponent } from './components/shared/confirmation/confirmation.component';
import { CurrencyCreateComponent } from './components/currency/currency-create/currency-create.component';
import { CurrencyListComponent } from './components/currency/currency-list/currency-list.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductCreateComponent } from './components/products/product-create/product-create.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    BrandListComponent,
    BrandCreateComponent,
    CategoryListComponent,
    CategoryCreateComponent,
    CurrencyListComponent,
    CurrencyCreateComponent,
    LoaderComponent,
    ConfirmationDialogComponent,
    ProductListComponent,
    ProductCreateComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    AngularEditorModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    MatProgressBar
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
