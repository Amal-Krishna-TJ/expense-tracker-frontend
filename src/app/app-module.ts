import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { authInterceptor } from './interceptors/auth-interceptor';
import { LoadingSpinner } from './shared/loading-spinner/loading-spinner';
import { NotFound } from './shared/not-found/not-found';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Unauthorized } from './shared/unauthorized/unauthorized';
import { ServerError } from './shared/server-error/server-error';

Chart.register(...registerables);

@NgModule({
  declarations: [
    App,
    LoadingSpinner
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NotFound,
    BrowserAnimationsModule,
    Unauthorized,
    ServerError
  ],
  providers: [
  provideBrowserGlobalErrorListeners(),

  provideHttpClient(
    withInterceptors([
      authInterceptor
    ])
  )
],
  bootstrap: [App]
})
export class AppModule { }
