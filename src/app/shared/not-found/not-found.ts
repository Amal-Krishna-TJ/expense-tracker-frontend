import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingService } from '../../services/loading';

@Component({
  selector: 'app-not-found',
  standalone: true,
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
  imports: [RouterModule]
})
export class NotFound implements OnInit {
  constructor(public loadingService:LoadingService){}
  
  ngOnInit(){
    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    },1000);
  }
}
