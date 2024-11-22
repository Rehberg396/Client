import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Vehicle } from '@cps/types';
import { ResizableColumnDirective } from '@cps/ui';
import { INTERNAL_LOCK_ENGINE_TYPE } from '@cps/vehicle-health/ui';

@Component({
  selector: 'vh-vehicle-properties',
  standalone: true,
  imports: [MatTableModule, ResizableColumnDirective],
  templateUrl: './vehicle-properties.component.html',
  styleUrls: ['./vehicle-properties.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclePropertiesComponent {
  @Input()
  set selectedVehicle(vehicle: Vehicle) {
    const displayedColumnVehiclePropertyTable: string[] = [];
    const rowData = vehicle.vehicleProperties
      ?.filter((property) => property.name !== INTERNAL_LOCK_ENGINE_TYPE)
      .reduce(
        (acc, curr) => {
          if (curr.name) {
            displayedColumnVehiclePropertyTable.push(curr.name);
            acc[curr.name] = curr.value ?? curr.defaultValue ?? '';
          }
          return acc;
        },
        {} as Record<string, string>
      );
    this.displayedColumnVehiclePropertyTable =
      displayedColumnVehiclePropertyTable;
    this.dataSourceVehicleProperty.data = rowData ? [rowData] : [];
  }

  dataSourceVehicleProperty = new MatTableDataSource();
  displayedColumnVehiclePropertyTable: string[] = [];
}
