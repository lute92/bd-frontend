import { MediaMatcher } from '@angular/cdk/layout';
import { HttpRequest } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Beauty Duty Admin';
  mobileQuery!: MediaQueryList;
  progressValue = 0;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthService,
    private router: Router) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  updateProgressValue(value: number) {
    this.progressValue = value;
  }

  logOut() {
    this.authService.removeAuthToken();
    this.router.navigate(['/login']);
  }

}
