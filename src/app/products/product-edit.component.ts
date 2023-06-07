import { Component, OnInit } from '@angular/core';
import { IMessages, IProduct, IValidationMessages, Inputs, isIProduct } from './product';
import { AbstractControl, Form, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ProductService } from './product.service';
import { Router } from '@angular/router';

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
  styleUrls: ['./product-edit.component.css'],
  providers: [ProductService]
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  product: IProduct | undefined;

  get tags(): FormArray {
    return <FormArray>this.productForm.get('tags');
  }

  messages: IMessages = {
    productName: '',
    productCode: '',
    price: '',
    starRating: '',
    description: ''
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
    description: {
      required: 'Please enter a description',
    },
  }
  
  constructor(
    private fb : FormBuilder,
    private readonly productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (isIProduct(history.state)) {
      this.product = history.state;
    }

    this.productForm = this.fb.group({
      productName: [this.product?.productName, [Validators.required, Validators.minLength(3)]],
      productCode: [this.product?.productCode, [Validators.required]],
      price: [this.product?.price, [Validators.required, Validators.min(0)]],
      starRating: [this.product?.starRating, [Validators.required, ratingRange(1, 5)]],
      tags: this.fb.array([this.buildTag()]),
      description: this.product?.description
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

  buildTag(): FormGroup {
    return this.fb.group({
      tagName: ['', [Validators.required]]
    });
  }

  addTag(): void {
    console.log('je passe bien la')
    this.tags.push(this.buildTag());
  }

  deleteTag(index: number): void {
    this.tags.removeAt(index);
  }

  sendForm(): void {
    if (this.productForm.valid) {
      if (this.productForm.dirty) {
        const p = {...this.product, ...this.productForm.value}
        delete p.tags;

        if (this.product) {
          this.productService.updateProduct(p).subscribe({
            next: ({ data }) => {
              console.log('got data', data);
              this.onSaveComplete()
            },
            error: error => {
              console.log('there was an error sending the query', error);
            },
          })
        } else {
          this.productService.createProduct(p).subscribe({
            next: ({ data }) => {
              console.log('got data', data);
              this.onSaveComplete()
            },
            error: error => {
              console.log('there was an error sending the query', error);
            },
          })
        }

      }
    }
  }

  onSaveComplete(): void {
    this.productForm.reset();
    this.router.navigate(['/products']);
  }

  setMessage(input: Inputs, c: AbstractControl): void {
    this.messages[input] = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.messages[input] = Object.keys(c.errors).map(
        key => this.validationMessages[input][key]).join(' ');
    }
  }
}
