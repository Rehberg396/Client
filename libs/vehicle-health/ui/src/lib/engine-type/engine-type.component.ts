import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  INTERNAL_LOCK_ENGINE_TYPE,
  UPDATE_ENGINE_TYPE_MANUALLY,
} from './engine-type.const';

interface VehicleEngineType {
  engineType: string;
  vehicleProperties: VehicleProperty[];
}

interface VehicleProperty {
  name: string;
  value: string | boolean | number;
  defaultValue: string | boolean | number;
}
@Component({
  selector: 'vh-engine-type',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './engine-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EngineTypeComponent {
  @Input() engineTypeProperties: VehicleEngineType = {
    engineType: '',
    vehicleProperties: [],
  };

  @Output() openUpdateDialog = new EventEmitter<void>();

  checkForUpdateManually() {
    return this.engineTypeProperties.vehicleProperties.some(
      (property) =>
        property.name === INTERNAL_LOCK_ENGINE_TYPE &&
        property.value === UPDATE_ENGINE_TYPE_MANUALLY
    );
  }
}
