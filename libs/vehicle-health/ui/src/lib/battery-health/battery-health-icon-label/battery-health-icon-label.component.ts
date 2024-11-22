import { Component, Input } from '@angular/core';
import { IconLabelComponent } from '@cps/ui';
import { BatteryColorPipe } from '../battery-color.pipe';

@Component({
  selector: 'vh-battery-health-icon-label',
  standalone: true,
  imports: [IconLabelComponent, BatteryColorPipe],
  templateUrl: './battery-health-icon-label.component.html',
})
export class BatteryHealthIconLabelComponent {
  @Input() category = '';
  @Input() sohStatus = 1;
}
