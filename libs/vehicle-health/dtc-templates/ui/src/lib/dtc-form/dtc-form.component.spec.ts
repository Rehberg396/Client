import { TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DtcFormComponent, DtcFormInputData } from './dtc-form.component';
import { DtcTemplate } from '@cps/types';
import { ButtonComponent } from '@cps/ui';

describe(DtcFormComponent.name, () => {
  const mockDtcData: DtcTemplate = {
    category: 'category',
    comment: 'comment',
    criticality: 'criticality',
    description: 'description',
    dtcCode: 'dtcCode',
    oem: 'oem',
    possibleCause: 'possibleCause',
    protocolStandard: 'protocolStandard',
    recommendations: ['test'],
    source: 'source',
    symptom: 'symptom',
    engineType: 'CNG',
    riskAvailability: 'risk availability',
    riskDamage: 'risk damage',
    riskEmissions: 'risk emissions',
    riskSafety: 'risk safety',
    group: '',
  };

  async function setup(mockDtcModel?: DtcFormInputData) {
    const matDialogRefMock = {
      close: jest.fn(),
    };

    await TestBed.configureTestingModule({
      providers: [
        FormBuilder,
        {
          provide: MatDialogRef,
          useValue: matDialogRefMock,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: mockDtcModel,
        },
      ],
      imports: [
        DtcFormComponent,
        MatIconModule,
        ReactiveFormsModule,
        ButtonComponent,
        MatFormFieldModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(DtcFormComponent);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    return { component, fixture, matDialogRefMock };
  }

  it('should create', async () => {
    const mockMatDialogData: DtcFormInputData = {
      dtcItem: mockDtcData,
      options: {
        criticalities: [],
        engineTypes: [],
        risks: [],
      },
    };
    const { component } = await setup(mockMatDialogData);
    expect(component).toBeTruthy();
  });

  it('should close when close icon is clicked', async () => {
    const dtcFormInputDataMock: DtcFormInputData = {
      dtcItem: mockDtcData,
      options: {
        criticalities: [],
        engineTypes: [],
        risks: [],
      },
    };
    const { fixture, matDialogRefMock } = await setup(dtcFormInputDataMock);
    const closeBtn = fixture.debugElement.query(
      By.css('[fonticon="bosch-ic-close"]')
    );
    closeBtn.nativeElement.click();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('should add more recommendation control when click add button', async () => {
    const dtcFormInputDataMock: DtcFormInputData = {
      dtcItem: mockDtcData,
      options: {
        criticalities: [],
        engineTypes: [],
        risks: [],
      },
    };
    const { fixture, component } = await setup(dtcFormInputDataMock);
    const addDescBtn = fixture.debugElement.query(
      By.css('[fonticon="bosch-ic-add"]')
    );
    addDescBtn.nativeElement.click();
    expect(component.form.controls.recommendations.length).toBe(2);
  });

  it('should remove recommendation control when click delete button', async () => {
    const dtcFormInputDataMock: DtcFormInputData = {
      dtcItem: mockDtcData,
      options: {
        criticalities: [],
        engineTypes: [],
        risks: [],
      },
    };
    const { fixture, component } = await setup(dtcFormInputDataMock);
    const addDescBtn = fixture.debugElement.query(
      By.css('[fonticon="bosch-ic-delete"]')
    );
    addDescBtn.nativeElement.click();
    expect(component.form.controls.recommendations.length).toBe(0);
  });

  it('should set form value when edit', async () => {
    const mockDtcData: DtcTemplate = {
      category: 'category',
      comment: 'comment',
      criticality: 'criticality',
      description: 'description',
      dtcCode: 'dtcCode',
      oem: 'oem',
      possibleCause: 'possibleCause',
      protocolStandard: 'protocolStandard',
      recommendations: [''],
      source: 'source',
      symptom: 'symptom',
      engineType: 'CNG',
      riskAvailability: 'risk availability',
      riskDamage: 'risk damage',
      riskEmissions: 'risk emissions',
      riskSafety: 'risk safety',
      group: '',
    };
    const dtcFormInputDataMock: DtcFormInputData = {
      dtcItem: mockDtcData,
      options: {
        criticalities: [],
        engineTypes: [],
        risks: [],
      },
    };
    const { component } = await setup(dtcFormInputDataMock);
    expect(component.form.getRawValue()).toEqual(mockDtcData);
  });

  describe('onSubmit', () => {
    it('should do nothing when submit button is triggered and form is invalid', async () => {
      const dtcFormInputDataMock: DtcFormInputData = {
        dtcItem: undefined,
        options: {
          criticalities: [],
          engineTypes: [],
          risks: [],
        },
      };
      const { component } = await setup(dtcFormInputDataMock);
      component.handleSubmit = jest.fn();
      component.onSubmit();
      expect(component.handleSubmit).not.toHaveBeenCalled();
    });

    it('should call handleUpdate when submit button is triggered and form is valid', async () => {
      const dtcFormInputDataMock: DtcFormInputData = {
        dtcItem: mockDtcData,
        options: {
          criticalities: [],
          engineTypes: [],
          risks: [],
        },
      };
      const { component } = await setup(dtcFormInputDataMock);
      component.handleSubmit = jest.fn();
      component.onSubmit();
      expect(component.handleSubmit).toHaveBeenCalled();
    });

    it('should do nothing when submit button is triggered and form is invalid', async () => {
      const dtcFormInputDataMock: DtcFormInputData = {
        dtcItem: undefined,
        options: {
          criticalities: [],
          engineTypes: [],
          risks: [],
        },
      };
      const { component } = await setup(dtcFormInputDataMock);
      component.form.patchValue({
        dtcCode: 'test',
        source: 'test',
        protocolStandard: 'test',
        oem: 'test',
        engineType: 'Generic',
      });
      component.handleSubmit = jest.fn();
      component.onSubmit();
      expect(component.handleSubmit).toHaveBeenCalled();
    });
  });
});
