import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class LoginToastService {
  private loginToast = new BehaviorSubject<boolean>(false);
  
    loginToast$ = this.loginToast.asObservable();
  
    show() {
  
      this.loginToast.next(true);
  
      setTimeout(() => {
        this.loginToast.next(false);
      }, 2000);
  
    }
}
