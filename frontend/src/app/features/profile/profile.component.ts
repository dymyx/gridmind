import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { IUser } from '../../shared/types/api.types';
import dayjs from 'dayjs';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private destroy$ = new Subject<void>();
  public loading: boolean = true;
  public user: IUser | null = null;

  constructor(private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.profileService
      .getProfile()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false)),
      )
      .subscribe((user) => (this.user = user ?? null));
  }

  get getAge() {
    const driver_birth = dayjs(this.user?.favoriteDriver.birth_date).year();
    const today = dayjs().year();

    return Number(today - driver_birth);
  }
}
