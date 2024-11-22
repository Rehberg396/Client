import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'vh-button',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input()
  type: 'primary' | 'secondary' | 'danger' = 'primary';
  @Input()
  icon = '';
  @Input()
  disabled = false;
  @Input()
  class = '';
  @Input()
  size: 'small' | 'regular' | 'big' = 'regular';
  @Input()
  noBorder = false;
  @Input()
  buttonType: 'submit' | 'button' = 'submit';
  @Input() loading = false;

  @Output()
  handleClick = new EventEmitter<void>();

  onHandleClick(): void {
    this.handleClick.emit();
  }
}
