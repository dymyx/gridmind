import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { HomeComponent } from './features/home/home.component';
import { ResultsComponent } from './features/results/results.component';
import { ProfileComponent } from './features/profile/profile.component';
import { LayoutComponent } from './shared/ui/layout/layout.component';
import { AuthGuard } from './guards/auth-guard';
import { ScheduleComponent } from './features/schedule/schedule.component';
import { RaceDetailsComponent } from './features/schedule/race-details/race-details.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: '', loadChildren: () => import('./features/auth/auth-module').then((m) => m.AuthModule) },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'results',
        component: ResultsComponent,
      },
      {
        path: 'schedule',
        component: ScheduleComponent,
      },
      { path: 'schedule/:id', component: RaceDetailsComponent },
      {
        path: 'profile',
        component: ProfileComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
