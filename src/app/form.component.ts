import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UrlListComponent } from './list.component';
import { NgIf } from '@angular/common';
import { StoreService } from './store.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [FormsModule, UrlListComponent, NgIf],
  template: `
    <form (ngSubmit)="onSubmit()">
      <input
        type="text"
        [(ngModel)]="urlInput"
        name="urlInput"
        placeholder="Enter a URL"
        required
      />
      <button class="pill" type="submit">Submit</button>
    </form>
    <div>
      <p *ngIf="inputError" class="error-message">{{ inputError }}</p>
    </div>
    <div class="stack">
      <button class="pill" (click)="clearUrls()">Clear All</button>
      <button class="pill" (click)="addDebugValues()">Add 200 test strings</button>
    </div>
    <app-url-list />
  `,
  styleUrl: './app.component.css',
})
export class FormComponent {
  urlInput: string = '';
  inputError: string = '';
  isLoading: boolean = false;

  // @diegoperini
  // @see https://mathiasbynens.be/demo/url-regex
  readonly URL_REGEX = new RegExp(
    '^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\\u00A1-\\uFFFF][a-z0-9\\u00A1-\\uFFFF_-]{0,62})?[a-z0-9\\u00A1-\\uFFFF]\\.)+(?:[a-z\\u00A1-\\uFFFF]{2,}\\.?))(?::\\d{2,5})?(?:[/?#]\\S*)?$',
    'iu'
  );

  constructor(private router: Router, private urlService: StoreService) {}

  clearUrls() {
    this.urlService.clearAll();
    // TODO replace this hack with angular signals
    window.location.reload();
  }

  async addDebugValues() {
    let i = 0;
    while (++i < 200) {
      await this.urlService.addUrl(`url ${i}`);
    }
    // TODO replace this hack with angular signals
    window.location.reload();
  }

  private async checkUrl(
    url: string,
    method: string,
    headers: HeadersInit = {}
  ): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

    try {
      await fetch(url, {
        method,
        headers,
        signal: controller.signal,
        redirect: 'follow',
        mode: 'no-cors',
      });
      clearTimeout(timeoutId);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async onSubmit() {
    this.isLoading = true;
    this.inputError = '';

    this.urlInput = this.urlInput.trim();
    if (!this.urlInput || !this.URL_REGEX.test(this.urlInput)) {
      this.inputError = 'Please enter a valid url';
      return;
    }

    // TODO extend indexDB to allow for testing link uniqueness and prevent duplicate entries?

    try {
      // Only checking if url exists, so head is sufficient
      await this.checkUrl(this.urlInput, 'HEAD');
      await this.urlService.addUrl(this.urlInput);
      this.router.navigate(['/results'], {
        queryParams: { url: this.urlInput },
      });
      // Clear form for next use
      this.urlInput = '';
    } catch (error: any) {
      this.inputError =
        error.name === 'AbortError'
          ? 'Request timed out'
          : 'URL is unreachable or invalid';
    } finally {
      this.isLoading = false;
    }
  }
}
