/* eslint-disable @typescript-eslint/no-explicit-any */
import { Overlay } from '@angular/cdk/overlay';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Vehicle } from '@cps/types';
import { ButtonComponent } from '@cps/ui';
import {
  INTERNAL_LOCK_ENGINE_TYPE,
  UPDATE_ENGINE_TYPE_MANUALLY,
} from '@cps/vehicle-health/ui';
import { of } from 'rxjs';
import {
  VehicleFormComponent,
  VehicleFormData,
} from './vehicle-form.component';

describe(VehicleFormComponent.name, () => {
  async function setup(data: { vehicle?: Partial<Vehicle> } = {}) {
    const mockDialogRef = {
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        VehicleFormComponent,
        MatIconModule,
        ReactiveFormsModule,
        ButtonComponent,
        MatFormFieldModule,
        BrowserAnimationsModule,
        MatDialogModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            vehicle: data.vehicle,
            options: {
              engineTypes$: of([]),
            },
          } as VehicleFormData,
        },
        Overlay,
        FormBuilder,
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(VehicleFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return {
      fixture,
      component,
      mockDialogRef,
    };
  }

  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should be create form', async () => {
    const { component } = await setup();
    expect(component.title).toEqual('Create Vehicle');
    expect(component.buttonLabel).toEqual('Create');
  });

  it('should be update form', async () => {
    const { component } = await setup({
      vehicle: {},
    });
    expect(component.title).toEqual('Update Vehicle');
    expect(component.buttonLabel).toEqual('Update');
  });

  it('should invoke dialogRef close when invoke onClose', async () => {
    const { component, mockDialogRef } = await setup();
    component.onClose();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should update vehiclePropertiesForm when currentVehicle.vehicleProperties is truthy', async () => {
    const { component } = await setup({
      vehicle: {
        vehicleProperties: [
          {
            defaultValue: 'a',
            name: 'customerId',
            value: 'a',
          },
          { defaultValue: 'a', name: 'customerId', value: 'a' },
        ],
      },
    });
    expect(component.form.getRawValue().vehicleProperties.length).toBe(2);
  });

  it('should asign default value when property is null', async () => {
    const vehicle = {
      vehicleProperties: [
        {
          defaultValue: null,
          name: null,
          value: null,
        },
      ],
    } as Vehicle;
    const { component } = await setup({
      vehicle: vehicle,
    });
    expect(component.form.getRawValue().vehicleProperties).toEqual([
      {
        defaultValue: '',
        name: '',
        value: '',
      },
    ]);
  });

  it('should invoke FromGroup.markAllAsTouched with form value when submit form invalid', async () => {
    const { component } = await setup();
    jest.spyOn(component.form, 'markAllAsTouched');
    component.onSubmit();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });

  it('should add 1 control when invoke addVehicleProperty', async () => {
    const { component } = await setup();
    const currLength = component.form.controls['vehicleProperties'].length;
    component.addVehicleProperty();
    expect(component.form.controls['vehicleProperties'].length).toEqual(
      currLength + 1
    );
  });

  it('should remove 1 control when invoke removeVehicleProperty', async () => {
    const { component } = await setup({
      vehicle: {
        vehicleProperties: [
          {
            defaultValue: 'a',
            name: 'customerId',
            value: 'a',
          },
        ],
      },
    });
    const currLength = component.form.controls['vehicleProperties'].length;
    component.removeVehicleProperty(0);
    expect(component.form.controls['vehicleProperties'].length).toEqual(
      currLength - 1
    );
  });

  it('should disabled vehicle property form group when vehicle property name = INTERNAL_LOCK_ENGINE_TYPE', async () => {
    const { component } = await setup({
      vehicle: {
        vehicleProperties: [
          {
            name: INTERNAL_LOCK_ENGINE_TYPE,
            defaultValue: '',
            value: '',
          },
        ],
      },
    });
    component.handleSubmit = jest.fn();
    component.onSubmit();
    expect(component.handleSubmit).not.toHaveBeenCalled();
  });

  describe('Form Validation Tests', () => {
    it.each`
      controlName           | value              | error
      ${'engineType'}       | ${''}              | ${'required'}
      ${'engineType'}       | ${'a'.repeat(256)} | ${'maxlength'}
      ${'vin'}              | ${''}              | ${'required'}
      ${'vin'}              | ${'INVALID_VIN'}   | ${'pattern'}
      ${'manufacturerName'} | ${'Invalid@Name!'} | ${'pattern'}
      ${'modelLine'}        | ${'Invalid@Line!'} | ${'pattern'}
      ${'modelType'}        | ${'Invalid@Type!'} | ${'pattern'}
      ${'modelYear'}        | ${'9999'}          | ${'pattern'}
      ${'name'}             | ${''}              | ${'required'}
      ${'name'}             | ${'Invalid@Name!'} | ${'pattern'}
      ${'licensePlate'}     | ${'Invalid%Plate'} | ${'pattern'}
    `(
      'should trigger $error error for $controlName when value is set to "$value"',
      async ({ controlName, value, error }) => {
        const { component } = await setup();
        const control = component.form.get(controlName);
        if (control) {
          control.setValue(value);
          expect(control.hasError(error)).toBe(true);
        } else {
          fail(`Control with name ${controlName} not found`);
        }
      }
    );
  });

  describe('DOM error message Tests', () => {
    it('should display the correct error message when VIN has a pattern error', async () => {
      const { fixture, component } = await setup();
      const vinControl = component.form.controls['vin'];
      vinControl.setValue('INVALIDVIN');
      vinControl.updateValueAndValidity();
      fixture.detectChanges();

      const vinDebugEl: DebugElement = fixture.debugElement.query(
        By.css('vh-input[formControlName="vin"]')
      );
      expect(vinDebugEl).toBeTruthy();
      if (vinDebugEl) {
        const vhInputComponent = vinDebugEl.componentInstance;
        const errorMsg = vhInputComponent.errorMsg;
        expect(errorMsg).toBe(component.vinErrMsg);
      }
    });

    it('should display the correct error message when manufacture name has a pattern error', async () => {
      const { fixture, component } = await setup();
      const manuControl = component.form.controls['manufacturerName'];
      manuControl.setValue('Invalid@ManuFacturerName');
      manuControl.updateValueAndValidity();
      fixture.detectChanges();

      const manuDebugEl: DebugElement = fixture.debugElement.query(
        By.css('vh-input[formControlName="manufacturerName"]')
      );
      expect(manuDebugEl).toBeTruthy();
      if (manuDebugEl) {
        const vhInputComponent = manuDebugEl.componentInstance;
        const errorMsg = vhInputComponent.errorMsg;
        expect(errorMsg).toBe(component.patternErrMsg);
      }
    });

    it('should display the correct error message when model year has a pattern error', async () => {
      const { fixture, component } = await setup();
      const modelYearControl = component.form.controls['modelYear'];
      modelYearControl.setValue('9999');
      modelYearControl.updateValueAndValidity();
      fixture.detectChanges();

      const modelYearDebugEl: DebugElement = fixture.debugElement.query(
        By.css('vh-input[formControlName="modelYear"]')
      );
      expect(modelYearDebugEl).toBeTruthy();
      if (modelYearDebugEl) {
        const vhInputComponent = modelYearDebugEl.componentInstance;
        const errorMsg = vhInputComponent.errorMsg;
        expect(errorMsg).toBe(component.modelYearErrMsg);
      }
    });
  });

  describe('onSubmit', () => {
    it('should do nothing when submit button is triggered and form is invalid', async () => {
      const { component } = await setup();
      component.handleSubmit = jest.fn();
      component.onSubmit();
      expect(component.handleSubmit).not.toHaveBeenCalled();
    });

    it('should call handleSubmit when submit button is triggered and form is valid', async () => {
      const { component } = await setup({
        vehicle: {
          vin: 'TEST1234567890123',
          name: 'test',
          engineType: 'Generic',
          modelYear: '2020',
        },
      });
      component.handleSubmit = jest.fn();
      component.form.controls.vin.patchValue('TEST1234567890123');
      component.form.controls.engineType.patchValue('Generic');
      component.form.controls.name.patchValue('test');
      component.onSubmit();
      expect(component.handleSubmit).toHaveBeenCalled();
    });

    it('should call handleSubmit when submit button is triggered and form is valid with internal_lock_engine_type', async () => {
      const { component } = await setup({
        vehicle: {
          vin: 'TEST1234567890123',
          name: 'test',
          engineType: 'Generic',
          modelYear: '2020',
          vehicleProperties: [
            {
              name: INTERNAL_LOCK_ENGINE_TYPE,
              defaultValue: UPDATE_ENGINE_TYPE_MANUALLY,
              value: UPDATE_ENGINE_TYPE_MANUALLY,
            },
          ],
        },
      });
      component.handleSubmit = jest.fn();
      component.onSubmit();
      expect(component.handleSubmit).toHaveBeenCalledWith({
        engineType: 'Generic',
        vin: 'TEST1234567890123',
        modelYear: '2020',
        name: 'test',
        vehicleProperties: [
          {
            name: INTERNAL_LOCK_ENGINE_TYPE,
            value: UPDATE_ENGINE_TYPE_MANUALLY,
            defaultValue: UPDATE_ENGINE_TYPE_MANUALLY,
          },
        ],
      } as Vehicle);
    });
  });
});
