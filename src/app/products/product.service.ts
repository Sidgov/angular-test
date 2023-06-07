import { Injectable } from '@angular/core'
import { IProduct } from './product'
import { HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { Apollo, MutationResult, QueryRef, gql } from 'apollo-angular';

export interface ProductsResult {
  products: IProduct[]
}
export interface ProductResult {
  product: IProduct
}

const CREATE_PRODUCT = gql`mutation create($product: NewProductInput!) {
  addProduct(newProductData: $product) {
    productId
  }
}
`

const UPDATE_PRODUCT = gql`mutation update($product: UpdateProductInput!) {
  updateProduct(updateProductData: $product) {
    productId
  }
}
`

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsQuery: QueryRef<ProductsResult, { skip: number, take: number}>;
  private productQuery: QueryRef<ProductResult, { id: number }>;

  constructor (private readonly apollo: Apollo) {
    this.productsQuery = this.apollo.watchQuery({
      query: gql`query products($skip: Int!, $take: Int!) {
        products(skip: $skip, take: $take) {
          productId
          productName
          productCode
        }
      }`
    });

    this.productQuery = this.apollo.watchQuery({
      query: gql`query product($id: Int!) {
        product(id: $id) {
          productId
          productName
          productCode
        }
      }`
    });
  }

  
  async getProducts(skip: number, take: number): Promise<IProduct[]> {
    const result = await this.productsQuery.refetch({ skip, take });
    return result.data.products;
  }
  
  async getProduct(id: number): Promise<IProduct> {
    const result = await this.productQuery.refetch({ id });
    return result.data.product;
  }
  
  createProduct(product: IProduct): Observable<MutationResult<any>> {
    return this.apollo
      .mutate({
        mutation: CREATE_PRODUCT,
        variables: { product },
        optimisticResponse: {
          __typename: 'Mutation',
          addProduct: {
            __typename: 'Product',
            productId: Number
          },
        },
      });
  }

  updateProduct(product: IProduct): Observable<MutationResult<any>> {
    return this.apollo
      .mutate({
        mutation: UPDATE_PRODUCT,
        variables: { product },
        optimisticResponse: {
          __typename: 'Mutation',
          addProduct: {
            __typename: 'Product',
            productId: Number
          },
        },
      });
  }


  private handleError (err: HttpErrorResponse): Observable<never> {
    let errorMessage = ''
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occured. Handle it accordingly.
      errorMessage = `An error occured: ${err.error.message}`
    } else {
      // The backend returned an unsuccesful response code.
      // The response body may contain clues as to what went wrong
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`
    }
    console.error(errorMessage)
    return throwError(() => errorMessage)
  }
}
