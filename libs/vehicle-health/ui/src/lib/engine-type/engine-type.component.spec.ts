import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EngineTypeComponent } from './engine-type.component';
import {
  INTERNAL_LOCK_ENGINE_TYPE,
  UPDATE_ENGINE_TYPE_MANUALLY,
} from './engine-type.const';

describe(EngineTypeComponent.name, () => {
  let component: EngineTypeComponent;
  let fixture: ComponentFixture<EngineTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngineTypeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EngineTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle happy case engineTypeProperties with true condition need manual updated', () => {
    const component = new EngineTypeComponent();
    component.engineTypeProperties = {
      engineType: '',
      vehicleProperties: [
        {
          name: INTERNAL_LOCK_ENGINE_TYPE,
          value: UPDATE_ENGINE_TYPE_MANUALLY,
          defaultValue: '',
        },
      ],
    };
    expect(component.checkForUpdateManually()).toBe(true);
  });

  it('should initialize with default engineTypeProperties when no input is provided', () => {
    const component = new EngineTypeComponent();
    expect(component.engineTypeProperties).toEqual({
      engineType: '',
      vehicleProperties: [],
    });
  });
});
