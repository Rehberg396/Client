import { Component, input, output } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'vh-customer-context',
  standalone: true,
  imports: [
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatBadgeModule,
    MatTooltipModule,
  ],
  templateUrl: './customer-context.component.html',
  styleUrl: './customer-context.component.scss',
})
export class CustomerContextComponent {
  customers = input<string[]>([]);
  currentCustomer = input<string | undefined>(undefined);
  changeCustomer = output<string>();
}
