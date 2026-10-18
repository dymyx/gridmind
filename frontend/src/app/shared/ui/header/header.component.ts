import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  public logout() {
    this.authService.logout().subscribe({
      complete: () => this.router.navigate(['/login']),
    });
  }
}
