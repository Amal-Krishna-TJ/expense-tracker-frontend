import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterLinkActive, RouterModule } from "@angular/router";
import Swal from "sweetalert2";
import { LogoutToastService } from "../../services/logoutToast";
import { LoadingService } from "../../services/loading";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {

  value = localStorage.getItem('loggedInUser');

  user = JSON.parse(localStorage.getItem('loggedInUser') || '{}');

  showLogout = false;

  isAdmin = this.user.role === 'admin';

  menuOpen = false;

  constructor(private router: Router, private popupToast: LogoutToastService, public loadingService:LoadingService){}

  logout() {


    Swal.fire({
        
      title: `Logout?`,
      
      html:`<i class="fa-solid fa-triangle-exclamation custom-alert-icon logout-popup-icon"></i>
        <p>Do you really want to logout.</p>`,
      
      showCancelButton: true,
      
      cancelButtonText: 'Cancel',
      
      confirmButtonText: 'Logout',
      
      reverseButtons: true,
      
      customClass: {
      
        popup: 'logout-popup',
      
        title: 'logout-popup-title',
      
        htmlContainer: 'logout-popup-html',
      
        confirmButton: 'logout-popup-confirm',
      
        cancelButton: 'logout-popup-cancel'
      
      },
    
      buttonsStyling: false
    
    }).then((result) => {
    
      if (result.isConfirmed) {

        this.loadingService.show();

        localStorage.removeItem('loggedInUser');

        localStorage.removeItem('token');

        this.popupToast.show();

        setTimeout(() => {
          this.loadingService.hide();
        }, 1500);

        this.router.navigate(['/login']);

      }
    });
  
  }

  toggleMenu() {

    this.menuOpen = !this.menuOpen;

  }

  closeMenu() {

    this.menuOpen = false;
    
  }

  isExpenseDropdownOpen = false;

  toggleExpenseDropdown() {
    this.isExpenseDropdownOpen = !this.isExpenseDropdownOpen;
  }
  
}