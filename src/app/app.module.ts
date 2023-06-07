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
import { CustomHttpInterceptor } from './utils/http-interceptor';
import { MatProgressBar } from '@angular/material/progress-bar';
import { LoaderInterceptor } from './utils/loader-interceptor';
import { LoaderComponent } from './components/shared/loader/loader.component';
import { CategoryCreateComponent } from './components/categories/category-create/category-create.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { ConfirmationDialogComponent } from './components/shared/confirmation/confirmation.component';
import { CurrencyCreateComponent } from './components/currency/currency-create/currency-create.component';
import { CurrencyListComponent } from './components/currency/currency-list/currency-list.component';

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
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
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
