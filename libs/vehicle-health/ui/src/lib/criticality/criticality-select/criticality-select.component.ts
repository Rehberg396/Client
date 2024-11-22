import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { criticalities } from '../criticality.const';

@Component({
  selector: 'vh-criticality-select',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './criticality-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CriticalitySelectComponent {
  @Output() selectionChange = new EventEmitter<string>();

  control = new FormControl<string | null>({
    disabled: false,
    value: '',
  });

  options = [
    {
      value: '',
      label: 'Show all',
      icon: 'bosch-ic-emoji-neutral',
      color: undefined,
    },
    ...criticalities.map((criticality) => ({
      value: criticality.value,
      label: criticality.value,
      icon: criticality.icon,
      color: criticality.color,
    })),
  ];
}
