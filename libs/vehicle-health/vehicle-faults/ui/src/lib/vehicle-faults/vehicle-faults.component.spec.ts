/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { DtcTemplate, RichVehicleFault } from '@cps/types';
import { VehicleFaultsComponent } from './vehicle-faults.component';

describe(VehicleFaultsComponent.name, () => {
  let component: VehicleFaultsComponent;
  let fixture: ComponentFixture<VehicleFaultsComponent>;

  const fault1 = {
    start: new Date().toJSON(),
    end: new Date().toJSON(),
    faultDateTime: new Date().toJSON(),
    status: 'pending',
    dtcCode: 'dtcCode1',
    faultOrigin: 'faultOrigin1',
    description: 'description1',
    possibleCause: 'possibleCause1',
    possibleSymptoms: 'possibleSymptoms1',
    criticality: 'criticality1',
    recommendations: [],
    oem: 'oem1',
    protocolStandard: 'protocolStandard1',
    dtcTemplate: {} as DtcTemplate,
    vehicleName: '1',
    vin: '1',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleFaultsComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
    fixture = TestBed.createComponent(VehicleFaultsComponent);
    fixture.componentRef.setInput('vin', '1');
    fixture.componentRef.setInput('page', '0');
    fixture.componentRef.setInput('size', '10');
    fixture.componentRef.setInput('sortDirection', 'asc');
    fixture.componentRef.setInput('sortBy', 'vin');
    fixture.componentRef.setInput('displayedColumns', {
      isHidden: () => false,
    });
    fixture.componentRef.setInput('dataSource', [
      fault1,
      {
        start: new Date().toJSON(),
        end: new Date().toJSON(),
        faultDateTime: new Date().toJSON(),
        status: 'inactive',
        dtcCode: 'dtcCode2',
        faultOrigin: 'faultOrigin2',
        description: 'description2',
        possibleCause: 'possibleCause2',
        possibleSymptoms: 'possibleSymptoms2',
        criticality: 'criticality2',
        recommendations: [],
        oem: 'oem2',
        protocolStandard: 'protocolStandard1',
        dtcTemplate: {} as DtcTemplate,
        vehicleName: '1',
        vin: '1',
      },
    ]);
    fixture.componentRef.setInput('isLoading', false);
    fixture.componentRef.setInput('errorMessage', '');
    fixture.componentRef.setInput('totalElements', 2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

  it('should call history.emit', async () => {
    const historyIcon = component
      .columnConfigs()
      .filter((d) => d.type === 'action')
      .flatMap((d) => d.actions)
      .find(
        (action) =>
          action.icon({} as unknown as RichVehicleFault) === 'bosch-ic-history'
      )!;
    jest.spyOn(component.history, 'emit');
    historyIcon.onClick!(fault1);
    expect(component.history.emit).toHaveBeenCalledWith(fault1);
  });

  it('should call dimiss.emit', async () => {
    const dismissIcon = component
      .columnConfigs()
      .filter((d) => d.type === 'action')
      .flatMap((d) => d.actions)
      .find(
        (action) =>
          action.icon({} as unknown as RichVehicleFault) ===
          'bosch-ic-abort-frame'
      )!;
    jest.spyOn(component.dismiss, 'emit');
    dismissIcon.onClick!(fault1);
    expect(component.dismiss.emit).toHaveBeenCalledWith(fault1);
  });
});
