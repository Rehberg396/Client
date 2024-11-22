import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent } from './select.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'vh-dummy',
  template: `<form [formGroup]="form">
    <vh-select formControlName="name" [options]="options"></vh-select>
  </form>`,
  standalone: true,
  imports: [ReactiveFormsModule, SelectComponent],
})
class DummyComponent {
  options = [
    {
      value: 'test name',
      label: 'test value',
    },
  ];
  form = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
  });

  submit(): void {
    this.form.markAllAsTouched();
  }
}

describe(SelectComponent.name, () => {
  let component: DummyComponent;
  let fixture: ComponentFixture<DummyComponent>;
  let selectComponent: SelectComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent, BrowserAnimationsModule, DummyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DummyComponent);
    component = fixture.componentInstance;

    selectComponent = fixture.debugElement.query(
      By.directive(SelectComponent)
    ).componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onTouch when form control is invalid', () => {
    jest.spyOn(selectComponent, 'onTouch');
    component.submit();
    selectComponent.ngDoCheck();
    expect(selectComponent.onTouch).toHaveBeenCalled();
    expect(component.form.invalid).toBe(true);
  });

  it('should call onChange control value is changed', () => {
    jest.spyOn(selectComponent, 'onChange');
    selectComponent.onModelChange('test option');
    expect(selectComponent.onChange).toHaveBeenCalled();
    expect(selectComponent.value).toBe('test option');
  });

  it('should emit loadMore when scroll to bottom', async () => {
    const spyElementScroll = jest.spyOn(
      selectComponent.scroller,
      'elementScrolled'
    );
    const elementScrolled$ = new ReplaySubject<Event>();
    const spyOnLoadMoreEmit = jest.spyOn(selectComponent.loadMore, 'emit');
    spyElementScroll.mockReturnValue(elementScrolled$.asObservable());
    const spyMeasureScrollOffset = jest.spyOn(
      selectComponent.scroller,
      'measureScrollOffset'
    );
    selectComponent.ngAfterViewInit();
    spyMeasureScrollOffset.mockReturnValue(150);
    elementScrolled$.next({} as Event);
    spyMeasureScrollOffset.mockReturnValue(100);
    elementScrolled$.next({} as Event);
    expect(spyOnLoadMoreEmit).toHaveBeenCalled();
  });
});
