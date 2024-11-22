import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import {
  EngineTypeRequest,
  UpdateEngineTypeFormComponent,
} from './update-engine-type-form.component';

describe(UpdateEngineTypeFormComponent.name, () => {
  function setup() {
    const mockDialogRef = {
      close: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [UpdateEngineTypeFormComponent, BrowserAnimationsModule],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            options: {
              engineTypes$: of([]),
            },
          },
        },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    });

    const fixture = TestBed.createComponent(UpdateEngineTypeFormComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    return { fixture, component, mockDialogRef };
  }

  it('should do nothing when submit invalid form', () => {
    const { component, mockDialogRef } = setup();
    component.submit();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  });

  it('should close dialog with form value if submit valid form', () => {
    const { component } = setup();
    const validFormValue: EngineTypeRequest = {
      engineType: 'Diesel',
    };
    component.engineTypeForm.setValue({
      ...validFormValue,
    });
    component.handleSubmit = jest.fn();
    component.engineTypeForm.controls.engineType.patchValue('Diesel');
    component.submit();
    expect(component.handleSubmit).toHaveBeenCalled();
  });

  it('should dialog when invoke onClose()', () => {
    const { component, mockDialogRef } = setup();
    component.onClose();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
