import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { catchError, map, of, Subject, switchMap, takeUntil, timer } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent implements OnInit {
  public loading = false;
  private destroy$ = new Subject<any>();

  public teams: any[] = [];
  public drivers: any[] = [];

  public activeStep = 0;

  private route = inject(ActivatedRoute);

  public errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDict();
  }

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
    // Step 1: main-info
    {
      fieldGroup: [
        {
          key: 'username',
          type: 'input',
          props: { label: 'Username', required: true, minLength: 4 },
          asyncValidators: {
            usernameTaken: {
              expression: (control: AbstractControl) => {
                if (!control.value || control.value.length < 4) return of(true);

                return timer(400).pipe(
                  switchMap(() => this.authService.isUsernameAvailable(control.value)),
                  catchError(() => of(true)),
                );
              },
              message: 'Username is already taken',
            },
          },
        },
        {
          key: 'password',
          type: 'input',
          props: {
            label: 'Password',
            type: 'password',
            required: true,
            minLength: 8,
          },
        },
        {
          key: 'confirmPassword',
          type: 'input',
          props: {
            label: 'Confirm password',
            type: 'password',
            required: true,
            minLength: 8,
          },
          validators: {
            fieldMatch: {
              expression: (control: AbstractControl) =>
                !control.value || control.value === control.parent?.get('password')?.value,
              message: 'Passwords do not match',
            },
          },
        },
      ],
    },
    {
      key: 'favoriteDriverId',
      type: 'card-select',
      props: {
        label: 'Pick favorite driver',
        columns: 3,
        options: [] as any[],
      },
    },
    {
      key: 'favoriteTeamId',
      type: 'card-select',
      props: {
        label: 'Pick favorite team',
        columns: 2,
        options: [] as any[],
      },
    },
  ];

  stepForms = [new FormGroup({}), new FormGroup({}), new FormGroup({})];
  stepFields: FormlyFieldConfig[][] = this.registerFields.map((f) => [f]);

  registerModel = {
    username: '',
    password: '',
    confirmPassword: '',
    favoriteDriverId: null,
    favoriteTeamId: null,
  };
  registerForm = new FormGroup({});

  public loginSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.errorMessage = '';
    this.loading = true;
    this.authService.loginUser(this.loginModel).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err: HttpErrorResponse) => {
        this.loading = false;

        console.log(err, err.status);

        if (err.status === 401) {
          this.errorMessage = 'Not correct username or password';
        } else {
          this.errorMessage = err.error?.message ?? 'Something went wrong';
        }

        console.log(err.error.message);
      },
    });
  }
  public registerSubmit() {
    if (!this.allStepsValid) {
      this.stepForms.forEach((f) => f.markAllAsTouched());
      return;
    }

    const payload = {
      username: this.registerModel.username,
      password: this.registerModel.password,
      favoriteDriverId: this.registerModel.favoriteDriverId,
      favoriteTeamId: this.registerModel.favoriteTeamId,
    };

    this.errorMessage = '';
    this.loading = true;
    this.authService.registerUser(payload).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err: HttpErrorResponse) => {
        this.loading = false;

        if (err.status === 409) {
          this.errorMessage = 'Username exists';
        }

        console.log(err);
      },
    });
  }

  private loadDict() {
    this.authService
      .getAllTeams()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (teams) => {
          this.teams = teams || [];
          this.buildStepFields();
        },
        error: (err: HttpErrorResponse) => console.error('Failed to load teams', err),
      });

    this.authService
      .getAllDrivers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (drivers) => {
          this.drivers = drivers || [];
          this.buildStepFields();
        },
        error: (err: HttpErrorResponse) => console.error('Failed to load drivers', err),
      });
  }

  // page-form methods
  get isLastStep(): boolean {
    return this.activeStep === this.stepFields.length - 1;
  }

  get allStepsValid(): boolean {
    return this.stepForms.every((f) => f.valid);
  }

  nextStep() {
    const form = this.stepForms[this.activeStep];
    if (form.valid) {
      this.activeStep++;
    } else {
      form.markAllAsTouched();
    }
  }

  prevStep() {
    if (this.activeStep > 0) {
      this.activeStep--;
    }
  }

  private buildStepFields() {
    const [, driverField, teamField] = this.registerFields;

    driverField.props!.options = this.drivers.map((d) => ({
      value: d.id,
      label: `${d.first_name} ${d.last_name}`,
    }));
    teamField.props!.options = this.teams.map((t) => ({ value: t.id, label: t.name }));
  }
}
