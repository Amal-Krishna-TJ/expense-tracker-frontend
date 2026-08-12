import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private timeout = 60 * 60 * 1000; // 1 hour

  private timer: any;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private http: HttpClient
  ) {}

  private api = `${environment.apiUrl}/auth`;

  //REGISTER
  register(user: any): Observable<any> {

    return this.http.post(
      `${this.api}/register`,
      user
    );

  }

  //LOGIN
  login(credentials: any): Observable<any> {

    return this.http.post(
      `${this.api}/login`,
      credentials
    );

  }

  //Watching Starts
  startWatching() {

    this.resetTimer();

    window.addEventListener('mousemove', () => this.resetTimer());
    window.addEventListener('keydown', () => this.resetTimer());
    window.addEventListener('click', () => this.resetTimer());
    window.addEventListener('scroll', () => this.resetTimer());

  }

  //Watching Timer
  resetTimer() {

    clearTimeout(this.timer);

    this.timer = setTimeout(() => {

      this.logout();

    }, this.timeout);

  }

  //LOGOUT
  logout() {

    localStorage.removeItem('loggedInUser');

    alert("Session expired due to inactivity.");

    this.ngZone.run(() => {

      this.router.navigate(['/login']);

    });

  }

  forgotPassword(email:string){

    return this.http.post(

      `${this.api}/forgot-password`,

      { email }

    );

  }

  verifyOTP(email:string, otp:string){

    return this.http.post(

      `${this.api}/verify-otp`,

      {

        email,

        otp

      }

    );

  }

  resetPassword(email:string, password:string, confirmPassword:string){

    return this.http.put(
    
      `${this.api}/reset-password`,
    
      {
      
        email,
      
        password,
      
        confirmPassword
      
      }
    
    );
  
  }

  getProfile() {
    return this.http.get(`${this.api}/me`);
  }
}
