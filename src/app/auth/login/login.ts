import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth';
import Swal from 'sweetalert2';
import { LoginToastService } from '../../services/loginToast';
import { LoadingService } from '../../services/loading';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  value = localStorage.getItem('loggedInUser');
  loginForm!: FormGroup;
  showEyeValue = false;
  isLoading = false;
  loginSuccess = false;
  showSuccess = false;
  showFailed = false;

  showForgotPassword = false;
  step = 1;
  forgotEmail = '';
  otp = '';
  newPassword = '';
  confirmPassword = '';
  resendCountdown = 30;
  canResend = false;
  isSending = false;

  showNewPassword = false;
  showConfirmPassword = false;
  passwordStrength = '';
  passwordStrengthClass = '';

  constructor(
  private fb: FormBuilder,
  private authService: AuthService,
  private router: Router,
  private popupToast: LoginToastService,
  public loadingService:LoadingService
) {

  this.loginForm = this.fb.group({

    username: ['', Validators.required],

    password: ['', Validators.required]

  });

}

//Eye button in passsword
showEye() {
  this.showEyeValue = !this.showEyeValue;
}

openForgotPassword() {

    this.showForgotPassword = true;

    this.step = 1;

    this.forgotEmail = '';

    this.otp = '';

    this.otpDigits = [
        '',
        '',
        '',
        '',
        '',
        ''
    ];

    this.newPassword = '';

    this.confirmPassword = '';

    this.passwordStrength = '';

    this.passwordStrengthClass = '';

}

closeForgotPassword(){

    this.showForgotPassword = false;

}

sendOTP() {

  if (!this.forgotEmail) {

    Swal.fire({

      title: 'Email Required',

      html: `
        <i class="fa-solid fa-envelope custom-alert-icon profile-error-popup-icon"></i>
        <p>Please enter your registered email address.</p>
      `,

      showConfirmButton: false,

      timer: 1800,

      customClass: {

        popup: 'profile-error-popup',

        title: 'profile-error-popup-title'

      },

      buttonsStyling: false

    });

    return;

  }

  this.isSending = true;

  this.authService

    .forgotPassword(this.forgotEmail)

    .subscribe({

      next: (res: any) => {

        this.isSending = false;

        this.step = 2;

        this.startCountdown();

        Swal.fire({

          title: 'OTP Sent',

          html: `
            <i class="fa-solid fa-paper-plane custom-alert-icon profile-success-popup-icon"></i>
            <p>OTP has been sent to your email.</p>
          `,

          showConfirmButton: false,

          timer: 1800,

          customClass: {

            popup: 'profile-success-popup',

            title: 'profile-success-popup-title'

          },

          buttonsStyling: false

        });

      },

      error: (err: any) => {

        this.isSending = false;

        console.error(
          'FORGOT PASSWORD ERROR:',
          err
        );

        Swal.fire({

          title: 'Unable to Send OTP',

          html: `
            <i class="fa-solid fa-triangle-exclamation custom-alert-icon profile-error-popup-icon"></i>
            <p>
              ${err.error?.message ||
              'Something went wrong. Please try again.'}
            </p>
          `,

          showConfirmButton: false,

          timer: 2200,

          customClass: {

            popup: 'profile-error-popup',

            title: 'profile-error-popup-title'

          },

          buttonsStyling: false

        });

      }

    });

}

startCountdown(){

    this.canResend = false;

    this.resendCountdown = 30;

    const timer = setInterval(()=>{

        this.resendCountdown--;

        if(this.resendCountdown===0){

            this.canResend = true;

            clearInterval(timer);

        }

    },1000);

}

verifyOTP() {

  if (this.otp.length !== 6) {

    Swal.fire({

      title: 'Invalid OTP',

      html: `
        <i class="fa-solid fa-key custom-alert-icon profile-error-popup-icon"></i>
        <p>Please enter the complete 6-digit OTP.</p>
      `,

      showConfirmButton: false,

      timer: 1800,

      customClass: {

        popup: 'profile-error-popup',

        title: 'profile-error-popup-title'

      },

      buttonsStyling: false

    });

    return;

  }

  this.authService

    .verifyOTP(

      this.forgotEmail,

      this.otp

    )

    .subscribe({

      next: (res: any) => {

        this.step = 3;

        Swal.fire({

          title: 'OTP Verified',

          html: `
            <i class="fa-solid fa-circle-check custom-alert-icon profile-success-popup-icon"></i>
            <p>Your OTP has been verified successfully.</p>
          `,

          showConfirmButton: false,

          timer: 1500,

          customClass: {

            popup: 'profile-success-popup',

            title: 'profile-success-popup-title'

          },

          buttonsStyling: false

        });

      },

      error: (err: any) => {

        console.error(
          'VERIFY OTP ERROR:',
          err
        );

        Swal.fire({

          title: 'OTP Verification Failed',

          html: `
            <i class="fa-solid fa-triangle-exclamation custom-alert-icon profile-error-popup-icon"></i>
            <p>
              ${err.error?.message ||
              'Invalid OTP. Please try again.'}
            </p>
          `,

          showConfirmButton: false,

          timer: 2200,

          customClass: {

            popup: 'profile-error-popup',

            title: 'profile-error-popup-title'

          },

          buttonsStyling: false

        });

      }

    });

}

changePassword() {

  if (!this.newPassword ||
      !this.confirmPassword) {

    Swal.fire({

      title: 'Missing Password',

      html: `
        <i class="fa-solid fa-lock custom-alert-icon profile-error-popup-icon"></i>
        <p>Please enter both password fields.</p>
      `,

      showConfirmButton: false,

      timer: 1800,

      customClass: {

        popup: 'profile-error-popup',

        title: 'profile-error-popup-title'

      },

      buttonsStyling: false

    });

    return;

  }

  if (this.newPassword.length < 6) {

    Swal.fire({

      title: 'Password Too Short',

      html: `
        <i class="fa-solid fa-lock custom-alert-icon profile-error-popup-icon"></i>
        <p>Password must contain at least 6 characters.</p>
      `,

      showConfirmButton: false,

      timer: 1800,

      customClass: {

        popup: 'profile-error-popup',

        title: 'profile-error-popup-title'

      },

      buttonsStyling: false

    });

    return;

  }

  if (
    this.newPassword !==
    this.confirmPassword
  ) {

    Swal.fire({

      title: 'Passwords Do Not Match',

      html: `
        <i class="fa-solid fa-triangle-exclamation custom-alert-icon profile-error-popup-icon"></i>
        <p>Please make sure both passwords are the same.</p>
      `,

      showConfirmButton: false,

      timer: 1800,

      customClass: {

        popup: 'profile-error-popup',

        title: 'profile-error-popup-title'

      },

      buttonsStyling: false

    });

    return;

  }

  this.authService

    .resetPassword(

      this.forgotEmail,

      this.newPassword,

      this.confirmPassword

    )

    .subscribe({

      next: (res: any) => {

        Swal.fire({

          title: 'Password Updated',

          html: `
            <i class="fa-solid fa-circle-check custom-alert-icon profile-success-popup-icon"></i>
            <p>Your password has been changed successfully.</p>
          `,

          showConfirmButton: false,

          timer: 2200,

          customClass: {

            popup: 'profile-success-popup',

            title: 'profile-success-popup-title'

          },

          buttonsStyling: false

        });

        this.resetForgotPasswordForm();

      },

      error: (err: any) => {

        console.error(
          'RESET PASSWORD ERROR:',
          err
        );

        Swal.fire({

          title: 'Password Reset Failed',

          html: `
            <i class="fa-solid fa-triangle-exclamation custom-alert-icon profile-error-popup-icon"></i>
            <p>
              ${err.error?.message ||
              'Unable to reset password. Please try again.'}
            </p>
          `,

          showConfirmButton: false,

          timer: 2200,

          customClass: {

            popup: 'profile-error-popup',

            title: 'profile-error-popup-title'

          },

          buttonsStyling: false

        });

      }

    });

}

resetForgotPasswordForm() {

  this.showForgotPassword = false;

  this.step = 1;

  this.forgotEmail = '';

  this.otp = '';

  this.otpDigits = [
    '',
    '',
    '',
    '',
    '',
    ''
  ];

  this.newPassword = '';

  this.confirmPassword = '';

  this.passwordStrength = '';

  this.passwordStrengthClass = '';

  this.showNewPassword = false;

  this.showConfirmPassword = false;

  this.isSending = false;

}

//Login Fn
  login() {

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    const username = this.loginForm.get('username')?.value?.trim();
    const password = this.loginForm.get('password')?.value?.trim();

    if (!username && !password) {
      Swal.fire({

        html:`<i class="fa-regular fa-circle-xmark custom-alert-icon login-popup-icon"></i>
        <p>Please enter your username and password.</p>`,

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
      this.resetForm();
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
      this.resetForm();
      return;
    }

    if (!password) {
      Swal.fire({

        html:`<i class="fa-regular fa-circle-xmark custom-alert-icon login-popup-icon"></i>
        <p>Please enter your password.</p>`,

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
      this.resetForm();
      return;
    }
  }

  // Start loading screen
  this.isLoading = true;

  // Reset previous success state
  this.loginSuccess = false;

  this.authService.login(this.loginForm.value)
    .subscribe({

      next: (res: any) => {

        console.log('LOGIN RESPONSE:', res);

        localStorage.setItem('token', res.token);

        localStorage.setItem(
          'loggedInUser',
          JSON.stringify(res.user)
        );
      
        this.loginSuccess = true;
        this.showSuccess = false;
        this.showFailed = false;
      
        // Keep loader for 1.5 seconds
        setTimeout(() => {
        
          // Remove loader
          this.isLoading = false;
        
          // Show success popup
          this.showSuccess = true;
        
          // Keep popup visible for 3 seconds
          this.popupToast.show();

          this.router.navigate(['/home']);
        
        }, 1500);
      
      },

      error: (err) => {

        console.error('LOGIN ERROR:', err);

        
        this.loginSuccess = false;
        this.showFailed = false;
        this.showSuccess = false;

        setTimeout(() => {
        
          this.isLoading = false;
        
          this.showFailed = true;
        
          setTimeout(() => {
          
            this.showFailed = false;
          
          }, 2000);
        
        }, 1500);

        this.resetForm();
      
      }

    });

}

resetForm(): void {
  this.loginForm.reset({
    username: '',
    password: ''
  });
}

otpDigits: string[] = ['', '', '', '', '', ''];

onOtpInput(event: any, index: number) {

  const input = event.target as HTMLInputElement;

  // Keep only one digit
  input.value = input.value.replace(/\D/g, '').slice(0, 1);

  this.otpDigits[index] = input.value;

  // Move to next box
  if (input.value && index < 5) {

    const next = document.getElementById(
      `otp-${index + 1}`
    ) as HTMLInputElement;

    next?.focus();

  }

  this.otp = this.otpDigits.join('');

}

onOtpKeydown(event: KeyboardEvent, index: number) {

  const input = event.target as HTMLInputElement;

  if (
    event.key === 'Backspace' &&
    !input.value &&
    index > 0
  ) {

    const previous = document.getElementById(
      `otp-${index - 1}`
    ) as HTMLInputElement;

    previous?.focus();

  }

}

onOtpPaste(event: ClipboardEvent) {

  event.preventDefault();

  const pasted =
    event.clipboardData
      ?.getData('text')
      .replace(/\D/g, '')
      .slice(0, 6);

  if (!pasted) return;

  this.otpDigits =
    pasted.split('');

  while (this.otpDigits.length < 6) {

    this.otpDigits.push('');

  }

  this.otp =
    this.otpDigits.join('');

}

checkPasswordStrength() {

    const password = this.newPassword;

    if (!password) {

        this.passwordStrength = '';

        this.passwordStrengthClass = '';

        return;

    }

    if (password.length < 6) {

        this.passwordStrength = 'Weak';

        this.passwordStrengthClass = 'weak';

    }
    else if (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    ) {

        this.passwordStrength = 'Strong';

        this.passwordStrengthClass = 'strong';

    }
    else {

        this.passwordStrength = 'Medium';

        this.passwordStrengthClass = 'medium';

    }

}

}
