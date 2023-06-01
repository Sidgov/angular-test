import { Component, OnInit } from '@angular/core';
import { IProduct } from './product';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'pm-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  product: IProduct | undefined;
  
  constructor() {
    console.log('test')
  }

  ngOnInit(): void {
    this.productForm = new FormGroup({
      productName: new FormControl(),
      productCode: new FormControl(),
      price: new FormControl(),
      starRating: new FormControl(),
    });
  }
}
