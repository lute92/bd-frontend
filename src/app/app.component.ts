import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Beauty Duty';
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  isAuthenticated: boolean = false;
  private authSubscription: Subscription | undefined;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.authSubscription = this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      this.cdr.detectChanges(); // Trigger change detection on auth state change
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  logOut() {
    this.authService.removeAuthToken();
    this.router.navigate(['/login']);
  }
}
