import {
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { App } from './app';
import { AppRoutingModule } from './app-routing-module';
import { LandingComponent } from './pages/landing/landing.component';
import { FormlyModule } from '@ngx-formly/core';
import { FORMLY_CONFIG } from './shared/formly/formly.config';
import { FormlySharedModule } from './shared/formly/formly-shared.module';
import { SharedModule } from './shared/shared-module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './interceptors/error.interceptor';
import { authInterceptor } from './interceptors/auth.interceptor';
import { HomeModule } from './features/home/home-module';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

@NgModule({
  declarations: [App, LandingComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HomeModule,

    // import formly
    FormlyModule.forRoot(FORMLY_CONFIG),
    FormlySharedModule,
  ],
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([errorInterceptor, authInterceptor])),
  ],
  bootstrap: [App],
})
export class AppModule {}
