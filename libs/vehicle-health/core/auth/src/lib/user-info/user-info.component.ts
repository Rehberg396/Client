import { Component, input, output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthState } from '../auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'vh-user-info',
  standalone: true,
  imports: [
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
})
export class UserInfoComponent {
  authState = input<AuthState>({ isAuthenticated: false });
  isEnabledCheckForUpdate = input(false);
  logout = output();
  checkForUpdate = output();
}
