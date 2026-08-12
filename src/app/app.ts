import { Component, signal } from '@angular/core';
import { AuthService } from './auth/services/auth';
import { LogoutToastService } from './services/logoutToast';
import { LoginToastService } from './services/loginToast';
import { LoadingService } from './services/loading';
import { routeAnimation } from './animations/route-animation';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  animations:[routeAnimation],
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('expenseTracker');
  showLogout = false;
  showLogin = false;
  constructor(private idleService: AuthService, private logoutToast: LogoutToastService, private loginToast: LoginToastService, public loadingService:LoadingService, public router: Router){
    this.logoutToast.logoutToast$.subscribe(value => {

      this.showLogout = value;

    });
    this.loginToast.loginToast$.subscribe(value => {

      this.showLogin = value;

    });
  }

  ngOnInit(){

    this.idleService.startWatching();

  }

  prepareRoute(outlet: any) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
