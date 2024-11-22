import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@cps/ui';
import { AuthService } from '../auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'vh-access-denied',
  standalone: true,
  imports: [ButtonComponent, MatIconModule],
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss'],
})
export class AccessDeniedComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
