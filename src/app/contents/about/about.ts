import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../services/loading';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements OnInit {

  constructor(public loadingService:LoadingService){}

  ngOnInit(){
    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    },250);
  }
}
