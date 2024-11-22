import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

import { VehicleImageComponent } from '@cps/vehicle-health/ui';
import { Vehicle } from '@cps/types';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'vh-vehicle-diagnostic-selection-table',
  standalone: true,
  templateUrl: './vehicle-diagnostic-selection-table.component.html',
  styleUrl: './vehicle-diagnostic-selection-table.component.scss',
  imports: [
    CommonModule,
    MatTableModule,
    VehicleImageComponent,
    MatProgressBarModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleDiagnosticSelectionTableComponent {
  @Input() isLoading = true;
  @Input() totalElements = 0;
  @Input() dataSource: Vehicle[] = [];
  @Input() selectedElement: string | null = null;
  @Output() eventVehicleSelected = new EventEmitter<string>();

  displayedColumns: string[] = ['vin', 'name', 'image'];

  handleClick(vin: string) {
    this.eventVehicleSelected.emit(vin);
  }
}
