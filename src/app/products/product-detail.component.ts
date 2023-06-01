import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { IProduct } from './product';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit{
  pageTitle = 'Product Detail';
  imageWidth = 300;
  imageMargin = 2;
  product: IProduct | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router) {}


  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.pageTitle += `: ${id}`;
    this.product = history.state;
  }

  onBack(): void {
    this.router.navigate(['/products'])
  }
}
