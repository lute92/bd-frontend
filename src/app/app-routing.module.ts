import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandListComponent } from './components/brands/brand-list/brand-list.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { CurrencyListComponent } from './components/currency/currency-list/currency-list.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { PurchaseCreateComponent } from './components/purchase/purchase-create/purchase-create.component';
import { PurchaseListComponent } from './components/purchase/purchase-list/purchase-list.component';
import { PurchaseEditComponent } from './components/purchase/purchase-edit/purchase-edit.component';
import { ProductImportComponent } from './components/productImport/product-import.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductListComponent, canActivate: [AuthGuard] },
  { path: 'brands', component: BrandListComponent, canActivate: [AuthGuard] },
  { path: 'categories', component: CategoryListComponent, canActivate: [AuthGuard] },
  { path: 'currencies', component: CurrencyListComponent , canActivate: [AuthGuard]},
  { path: 'purchases', component: PurchaseListComponent, canActivate: [AuthGuard] },
  { path: 'purchaseCreate', component: PurchaseCreateComponent, canActivate: [AuthGuard] },
  { path: 'purchaseEdit/:id', component: PurchaseEditComponent , canActivate: [AuthGuard]},
  { path: 'importProduct', component: ProductImportComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
