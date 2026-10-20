import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { map, Subject, takeUntil } from 'rxjs';
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

  constructor(
    private authSevice: AuthService,
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
      props: { label: 'Who are you?' },
      fieldGroup: [
        ...this.loginFields.map((f) => ({ ...f, props: { ...f.props } })),
        {
          key: 'confirmPassword',
          type: 'input',
          props: {
            label: 'Confirm password',
            type: 'password',
            required: true,
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
    favoriteDriverId: '',
    favoriteTeamId: '',
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
    if (!this.allStepsValid) {
      this.stepForms.forEach((f) => f.markAllAsTouched());
      return;
    }

    console.log('Full data', this.registerModel);

    const payload = {
      username: this.registerModel.username,
      password: this.registerModel.password,
      favoriteDriverId: this.registerModel.favoriteDriverId,
      favoriteTeamId: this.registerModel.favoriteTeamId,
    };

    this.loading = true;
    this.authSevice.registerUser(payload).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err: HttpErrorResponse) => {
        this.loading = false;
      },
    });
  }

  private loadDict() {
    this.authSevice
      .getAllTeams()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (teams) => {
          this.teams = teams || [];
          this.buildStepFields();
        },
        error: (err: HttpErrorResponse) => console.error('Failed to load teams', err),
      });

    this.authSevice
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
