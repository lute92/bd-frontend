import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandListComponent } from './components/brands/brand-list/brand-list.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { CurrencyListComponent } from './components/currency/currency-list/currency-list.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { PurchaseCreateComponent } from './components/purchase/purchase-create/purchase-create.component';
import { PurchaseListComponent } from './components/purchase/purchase-list/purchase-list.component';
import { PurchaseEditComponent } from './components/purchase/purchase-edit/purchase-edit.component';

const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'brands', component: BrandListComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'currencies', component: CurrencyListComponent },
  { path: 'purchases', component: PurchaseListComponent },
  { path: 'purchaseCreate', component: PurchaseCreateComponent },
  { path: 'purchaseEdit/:id', component: PurchaseEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
