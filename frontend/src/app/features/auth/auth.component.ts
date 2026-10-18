import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { map } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  public loading = false;

  constructor(
    private authSevice: AuthService,
    private router: Router,
  ) {}

  private route = inject(ActivatedRoute);
  mode$ = this.route.data.pipe(map((d) => d['mode'] as 'login' | 'register'));

  // LOGIN FORM
  loginFields: FormlyFieldConfig[] = [
    { key: 'username', type: 'input', props: { label: 'Username', required: true } },
    {
      key: 'password',
      type: 'input',
      props: {
        label: 'Password',
        type: 'password',
        required: true,
      },
    },
  ];
  loginModel = { username: '', password: '' };
  loginForm = new FormGroup({});

  // REGISTER FORM
  registerFields: FormlyFieldConfig[] = [
    ...this.loginFields,
    {
      key: 'confirmPassword',
      type: 'input',
      props: {
        label: 'Confirm password',
        type: 'password',
        required: true,
      },
    },
  ];
  registerModel = {
    username: '',
    password: '',
    confirmPassword: '',
  };
  registerForm = new FormGroup({});

  public loginSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.authSevice.loginUser(this.loginModel).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err: HttpErrorResponse) => {
        this.loading = false;
      },
    });
  }
  public registerSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const payload = {
      username: this.registerModel.username,
      password: this.registerModel.password,
    };

    this.loading = true;
    this.authSevice.registerUser(payload).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err: HttpErrorResponse) => {
        this.loading = false;
      },
    });
  }
}
