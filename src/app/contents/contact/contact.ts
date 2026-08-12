import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../services/loading';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit {
  value = localStorage.getItem('loggedInUser');

  constructor(public loadingService:LoadingService){}

  ngOnInit(){
    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    },250);
  }
}
