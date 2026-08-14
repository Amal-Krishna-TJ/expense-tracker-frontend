import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../services/loading';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../services/contact';

@Component({
  selector: 'app-contact',
  standalone: false,
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact implements OnInit {
  value = localStorage.getItem('loggedInUser');
  mailForm!: FormGroup;
  isLoading = false;
  showSuccess = false;
  showFailed = false;

  constructor(private fb: FormBuilder, public loadingService: LoadingService, public contactService: ContactService){
    this.mailForm = this.fb.group({

    username: ['', Validators.required],

    email: ['', Validators.required],

    subject: ['', Validators.required],

    messsage: ['', Validators.required]

  });
  }

  ngOnInit(){
    this.loadingService.show();

    setTimeout(() => {
      this.loadingService.hide();
    },250);
  }

  sendMail() {
  
    if (this.mailForm.invalid) {
      this.mailForm.markAllAsTouched();
      const username = this.mailForm.get('username')?.value?.trim();
      const email = this.mailForm.get('email')?.value?.trim();
      const subject = this.mailForm.get('subject')?.value?.trim();
      const messsage = this.mailForm.get('message')?.value?.trim();
  
      if (!username && !email && !subject && !messsage) {
        Swal.fire({
  
          html:`<i class="fa-regular fa-circle-xmark custom-alert-icon login-popup-icon"></i>
          <p>Please enter details.</p>`,
  
          title:'Oops!',
  
          confirmButtonText:'OK',
  
          customClass:{
          
              popup:'login-popup',
          
              title:'login-popup-title',
          
              htmlContainer:'login-popup-html',
          
              confirmButton:'login-popup-confirm'
          
          },
        
          buttonsStyling:false
        
        });
        this.mailForm.reset();
        return;
      }
  
      if (!email) {
        Swal.fire({
  
          html:`<i class="fa-regular fa-circle-xmark custom-alert-icon login-popup-icon"></i>
          <p>Please enter your email.</p>`,
  
          title:'Oops!',
  
          confirmButtonText:'OK',
  
          customClass:{
          
              popup:'login-popup',
          
              title:'login-popup-title',
          
              htmlContainer:'login-popup-html',
          
              confirmButton:'login-popup-confirm'
          
          },
        
          buttonsStyling:false
        
        });
        this.mailForm.reset();
        return;
      }

      if (!subject) {
        Swal.fire({
  
          html:`<i class="fa-regular fa-circle-xmark custom-alert-icon login-popup-icon"></i>
          <p>Please enter the subject.</p>`,
  
          title:'Oops!',
  
          confirmButtonText:'OK',
  
          customClass:{
          
              popup:'login-popup',
          
              title:'login-popup-title',
          
              htmlContainer:'login-popup-html',
          
              confirmButton:'login-popup-confirm'
          
          },
        
          buttonsStyling:false
        
        });
        this.mailForm.reset();
        return;
      }

      if (!messsage) {
        Swal.fire({
  
          html:`<i class="fa-regular fa-circle-xmark custom-alert-icon login-popup-icon"></i>
          <p>Please enter your messsage.</p>`,
  
          title:'Oops!',
  
          confirmButtonText:'OK',
  
          customClass:{
          
              popup:'login-popup',
          
              title:'login-popup-title',
          
              htmlContainer:'login-popup-html',
          
              confirmButton:'login-popup-confirm'
          
          },
        
          buttonsStyling:false
        
        });
        this.mailForm.reset();
        return;
      }
  
      if (!username) {
        Swal.fire({
  
          html:`<i class="fa-regular fa-circle-xmark custom-alert-icon login-popup-icon"></i>
          <p>Please enter your username.</p>`,
  
          title:'Oops!',
  
          confirmButtonText:'OK',
  
          customClass:{
          
              popup:'login-popup',
          
              title:'login-popup-title',
          
              htmlContainer:'login-popup-html',
          
              confirmButton:'login-popup-confirm'
          
          },
        
          buttonsStyling:false
        
        });
        this.mailForm.reset();
        return;
      }
    }
  
    // Start loading screen
    this.isLoading = true;
  
    this.contactService.contactMailer(this.mailForm.value)
      .subscribe({
  
        next: (res: any) => {
  
          console.log('MAIL RESPONSE:', res);

          this.showSuccess = true;

          this.mailForm.reset();
        
          // Keep loader for 1.5 seconds
          setTimeout(() => {
          
            // Remove loader
            this.isLoading = false;
          
            // Show success popup
            this.showSuccess = false;
          
          }, 1500);
        
        },
  
        error: (err) => {
  
          console.error('LOGIN ERROR:', err);

          this.showFailed = true;

          // Keep loader for 1.5 seconds
          setTimeout(() => {
          
            // Remove loader
            this.isLoading = false;
          
            // Show success popup
            this.showFailed = false;
          
          }, 1500);
                  
        }
  
      });
  
  }
}
