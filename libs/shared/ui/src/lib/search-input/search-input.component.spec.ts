import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SearchInputComponent } from './search-input.component';

describe(SearchInputComponent.name, () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchInputComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search when onSearch() is called', () => {
    component.value = 'test';
    jest.spyOn(component.search, 'emit');
    component.onSearch();
    expect(component.search.emit).toHaveBeenCalledWith('test');
  });

  it('should emit search when onClear() is called', () => {
    component.value = 'test';
    jest.spyOn(component.search, 'emit');
    component.onClear();
    expect(component.search.emit).toHaveBeenCalledWith('');
  });

  describe('toggle search control', () => {
    it('should be enabled', () => {
      component.disabled = false;
      expect(component.form.controls.search.disabled).toBe(false);
    });

    it('should be disabled', () => {
      component.disabled = true;
      expect(component.form.controls.search.disabled).toBe(true);
    });
  });
});
