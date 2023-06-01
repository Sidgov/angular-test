import { Injectable } from '@angular/core'
import { IProduct } from './product'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable, catchError, tap, throwError } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productUrl = '/api/products'

  constructor (private readonly http: HttpClient) {}

  getProducts (): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.productUrl).pipe(
      tap(data => { console.log('All :', JSON.stringify(data)) }),
      catchError(this.handleError)
    )
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
