import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  value = localStorage.getItem('loggedInUser');
  registerForm!: FormGroup;
  showEyeValue = false;

  //FORM
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {

    this.registerForm = this.fb.group({

      fullName: ['', Validators.required],

      username: ['', Validators.required],

      email: ['', [Validators.required, Validators.email]],

      password: ['', [Validators.required, Validators.minLength(6)]],

      confirmPassword: ['', Validators.required],

      phone: ['', Validators.required],

      occupation: ['']

    });

  }

  showEye() {
    this.showEyeValue = !this.showEyeValue;
  }

  //REGISTER
  register() {

  if (this.registerForm.invalid) {

    this.registerForm.markAllAsTouched();
    return;

  }

  if (
    this.registerForm.value.password !==
    this.registerForm.value.confirmPassword
  ) {

    Swal.fire({
    
      html:`<i class="fa-regular fa-circle-xmark custom-alert-icon register-popup-icon"></i>
      <p>Passwords do not match.</p>`,

      title:'Oops!',

      confirmButtonText:'OK',

      customClass:{
        
        popup:'register-popup',
    
        title:'register-popup-title',
    
        htmlContainer:'register-popup-html',
    
        confirmButton:'register-popup-confirm'
        
      },
      
      buttonsStyling:false
      
    });
    this.registerForm.reset();
    return;

  }

  const { confirmPassword, ...user } = this.registerForm.value;

  this.authService.register(user)
    .subscribe({

      next: (res) => {

        Swal.fire({
    
          html:`<i class="fa-regular fa-circle-check custom-alert-icon register-success-popup-icon"></i>
          <p>${res.message}.</p>`,

          title:'Success...',

          showConfirmButton:false,

          timer:1800,

          customClass:{

            popup:'register-success-popup',
          
            title:'register-success-popup-title',
          
            htmlContainer:'register-success-popup-html'

          },

          buttonsStyling:false

        });

        this.registerForm.reset();

        this.router.navigate(['/login']);

      },

      error: (err) => {

        Swal.fire({
    
          html:`<i class="fa-regular fa-circle-xmark custom-alert-icon register-popup-icon"></i>
          <p>${err.error?.message || 'Registration Failed'}.</p>`,

          title:'Oops!',

          confirmButtonText:'OK',

          customClass:{

            popup:'register-popup',
          
            title:'register-popup-title',
          
            htmlContainer:'register-popup-html',
          
            confirmButton:'register-popup-confirm'

          },

          buttonsStyling:false

        });

      }

    });

  }

}
