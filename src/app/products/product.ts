import { ValidationErrors } from "@angular/forms"

export interface IProduct {
  productId: number
  productName: string
  productCode: string
  releaseDate: string
  description: string
  price: number
  starRating: number
  imageUrl: string
}

export function isIProduct(object: any): object is IProduct {
  return 'productId' in object;
} 

export enum Inputs {
  PRODUCT_NAME = 'productName',
  PRODUCT_CODE = 'productCode',
  PRICE = 'price', 
  STAR_RATING = 'starRating',
  DESCRIPTION = 'description'
}

export type IMessages = {
  [key in Inputs]: string
}

export type IValidationMessages = {
  [key in Inputs]: {
    [key: keyof ValidationErrors]: string,
  }
}
