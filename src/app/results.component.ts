import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: true,
  template: `
    <div *ngIf="url">
      <h2>Thank you :)</h2>
      <div class="stack">
        <p>Submitted URL: {{ url }}</p>
        <button class="pill" (click)="returnButton()">Return</button>
      </div>
    </div>
  `,
  styleUrl: './app.component.css',
  imports: [NgIf],
})
export class ResultsComponent implements OnInit {
  url: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  returnButton() {
    this.router.navigateByUrl('/');
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.url = params['url'] || 'No URL provided';
    });
  }
}
