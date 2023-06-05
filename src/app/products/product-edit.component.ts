import { Component, OnInit } from '@angular/core';
import { IMessages, IProduct, IValidationMessages, Inputs, isIProduct } from './product';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';

function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null  => {
    if (c.value !== null && (isNaN(c.value)) || c.value < min || c.value > max) {
      return { 'range': true };
    }
    return null;
  }
}

@Component({
  selector: 'pm-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  product: IProduct | undefined;

  messages: IMessages = {
    productName: '',
    productCode: '',
    price: '',
    starRating: ''
  }

  private validationMessages: IValidationMessages = {
    productName: {
      required: 'Please enter a product name.',
      minlength: 'The product name must be longer than 3 characters.',
    },
    productCode: {
      required: 'Please enter a product code.',
    },
    price: {
      required: 'Please enter a price.',
    },
    starRating: {
      range: 'A star rating must be between 1 and 5'
    },
  }
  
  constructor(private fb : FormBuilder) {}

  ngOnInit(): void {
    if (isIProduct(history.state)) {
      this.product = history.state;
    }

    this.productForm = this.fb.group({
      productName: [this.product?.productName, [Validators.required, Validators.minLength(3)]],
      productCode: [this.product?.productCode, [Validators.required]],
      price: [this.product?.price, [Validators.required]],
      starRating: [this.product?.starRating, [Validators.required, ratingRange(1, 5)]],
    });

    const productNameControl = this.productForm.get(Inputs.PRODUCT_NAME);
    productNameControl?.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      () => this.setMessage(Inputs.PRODUCT_NAME, productNameControl)
    );
    const productCodeControl = this.productForm.get(Inputs.PRODUCT_CODE);
    productCodeControl?.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      () => this.setMessage(Inputs.PRODUCT_CODE, productCodeControl)
    );
    const priceControl = this.productForm.get(Inputs.PRICE);
    priceControl?.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      () => this.setMessage(Inputs.PRICE, priceControl)
    );
    const starRatingControl = this.productForm.get(Inputs.STAR_RATING);
    starRatingControl?.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      () => this.setMessage(Inputs.STAR_RATING, starRatingControl)
    );
  }

  setMessage(input: Inputs, c: AbstractControl): void {
    this.messages[input] = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.messages[input] = Object.keys(c.errors).map(
        key => this.validationMessages[input][key]).join(' ');
    }
  }
}
