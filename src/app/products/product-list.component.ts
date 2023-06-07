import { Component, type OnInit } from '@angular/core'
import { type IProduct } from './product'
import { ProductService } from './product.service'

@Component({
  selector: 'pm-products',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [ProductService]
})
export class ProductListComponent implements OnInit {
  constructor (private readonly productService: ProductService) { }

  pageTitle = 'Product List'
  imageWidth = 50
  imageMargin = 2
  showImage = false
  errorMessage = ''

  private _listFilter = ''
  get listFilter (): string {
    return this._listFilter
  }

  set listFilter (value: string) {
    this._listFilter = value
    console.log('In setter:', value)
    this.filteredProducts = this.performFilter(value)
  }

  filteredProducts: IProduct[] = []
  products: IProduct[] = []

  toggleImage (): void {
    this.showImage = !this.showImage
  }

  performFilter (filterBy: string): IProduct[] {
    filterBy = filterBy.toLocaleLowerCase()
    return this.products.filter((value) => value.productName.toLocaleLowerCase().includes(filterBy))
  }

  ngOnInit (): void {
    this.productService.getProducts(0, 100).then(
      products => {
        this.products = products
        this.filteredProducts = this.products
      }, 
    ).catch(
      err => { this.errorMessage = err }
    );
  }

  onRatingClicked (message: string): void {
    this.pageTitle = `Product List: ${message}`
  }
}
