import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing-module';
import { FormlySharedModule } from '../../shared/formly/formly-shared.module';

@NgModule({
  declarations: [AuthComponent],
  imports: [CommonModule, FormlySharedModule, AuthRoutingModule],
})
export class AuthModule {}
