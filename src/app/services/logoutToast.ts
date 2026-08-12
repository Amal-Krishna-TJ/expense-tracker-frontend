import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogoutToastService {

  private logoutToast = new BehaviorSubject<boolean>(false);

  logoutToast$ = this.logoutToast.asObservable();

  show() {

    this.logoutToast.next(true);

    setTimeout(() => {
      this.logoutToast.next(false);
    }, 2000);

  }

}
