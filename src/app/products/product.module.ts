import { NgModule } from '@angular/core';
import { ProductListComponent } from './product-list.component';
import { ProductDetailComponent } from './product-detail.component';
import { RouterModule } from '@angular/router';
import { productDetailGuard } from './product-detail.guard';
import { SharedModule } from '../shared/shared.module';
import { ProductEditComponent } from './product-edit.component';



@NgModule({
  declarations: [
    ProductListComponent,
    ProductDetailComponent,
    ProductEditComponent,
  ],
  imports: [
    RouterModule.forChild([
      { path: 'products', component: ProductListComponent},
      { 
        path: 'products/add',
        component: ProductEditComponent
      },
      { 
        path: 'products/:id',
        component: ProductDetailComponent,
        canActivate: [productDetailGuard]
      },
      { 
        path: 'products/:id/edit',
        component: ProductEditComponent,
        canActivate: [productDetailGuard]
      },
    ]),
    SharedModule,
  ]
})
export class ProductModule { }
