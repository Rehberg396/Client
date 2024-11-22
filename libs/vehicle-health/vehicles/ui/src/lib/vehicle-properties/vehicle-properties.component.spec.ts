import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Vehicle } from '@cps/types';
import { INTERNAL_LOCK_ENGINE_TYPE } from '@cps/vehicle-health/ui';
import { VehiclePropertiesComponent } from './vehicle-properties.component';

describe(VehiclePropertiesComponent.name, () => {
  let component: VehiclePropertiesComponent;
  let fixture: ComponentFixture<VehiclePropertiesComponent>;
  const mockedVehicle: Vehicle = {
    vin: 'as',
    name: 'a',
    manufacturerName: 'a',
    modelLine: 'a',
    modelType: 'a',
    modelYear: '2020',
    engineType: 'a',
    licensePlate: '',
    vehicleProperties: [
      {
        name: 'EngineSpeedMaxThreshold edit v2',
        value: '1',
        defaultValue: '19020',
      },
      {
        name: 'EngineSpeedMaxThreshold create v2',
        value: '1',
        defaultValue: '1900',
      },
      {
        name: 'EngineSpeedMaxThresholdV2 cccc v3',
        value: '',
        defaultValue: 'String default',
      },
      {
        name: INTERNAL_LOCK_ENGINE_TYPE,
        value: 'true',
        defaultValue: 'false',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclePropertiesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VehiclePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create displayedColumnVehiclePropertyTable from input vehicle', () => {
    component.selectedVehicle = mockedVehicle;
    expect(component.displayedColumnVehiclePropertyTable.length).toBe(3);
  });

  it('should set table datasource to empty if no vehicle properties existing', () => {
    const vehicleMockWithNoProperties = {
      ...mockedVehicle,
      vehicleProperties: undefined,
    };
    component.selectedVehicle =
      vehicleMockWithNoProperties as unknown as Vehicle;
    expect(component.dataSourceVehicleProperty.data).toEqual([]);
  });
});
