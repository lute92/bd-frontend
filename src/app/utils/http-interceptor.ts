import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MatProgressBar } from '@angular/material/progress-bar';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];
  private progressBar: MatProgressBar | undefined;

  constructor(private progressBarRef: MatProgressBar) {
    this.progressBar = progressBarRef;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(request);

    // Show progress bar
    this.showProgressBar();

    return next.handle(request).pipe(
      finalize(() => {
        const index = this.requests.indexOf(request);
        this.requests.splice(index, 1);

        // Hide progress bar when all requests are completed
        if (this.requests.length === 0) {
          this.hideProgressBar();
          console.log("Hiding progress bar")
        }
      })
    );
  }

  private showProgressBar(): void {
    if (this.progressBar) {
        console.log("Entering interceptor")
      this.progressBar.mode = 'indeterminate';
      console.log(this.progressBar.mode);
    }
  }

  private hideProgressBar(): void {
    if (this.progressBar) {
      this.progressBar.mode = 'determinate';
      console.log(this.progressBar.mode);
    }
  }
}
