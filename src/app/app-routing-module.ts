import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFound } from './shared/not-found/not-found';
import { Unauthorized } from './shared/unauthorized/unauthorized';
import { ServerError } from './shared/server-error/server-error';

const routes: Routes = [
  {path: '', loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)},
  {path: '', loadChildren: () => import('./contents/contents-module').then(m => m.ContentsModule)},
  {path:'404', component:NotFound},
  {path: '401', component: Unauthorized},
  {path: '500', component: ServerError},
  {path:'**', redirectTo: '404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
