import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import { Login } from './login/login';
import { Register } from './register/register';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Navbar } from '../others/navbar/navbar';
import { Profile } from './profile/profile';
import { BaseChartDirective } from 'ng2-charts';
import { Pagination } from '../shared/pagination/pagination';

@NgModule({
  declarations: [
    Login,
    Register,
    Profile
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    Navbar,
    FormsModule,
    BaseChartDirective,
    Pagination
  ]
})
export class AuthModule { }
