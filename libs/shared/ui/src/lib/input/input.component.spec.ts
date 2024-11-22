import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputComponent } from './input.component';

@Component({
  selector: 'vh-dummy',
  template: `<form [formGroup]="form">
    <vh-input formControlName="name"></vh-input>
  </form>`,
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent],
})
class DummyComponent {
  form = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
  });

  submit(): void {
    this.form.markAllAsTouched();
  }
}

describe(InputComponent.name, () => {
  async function setup() {
    await TestBed.configureTestingModule({
      imports: [DummyComponent, InputComponent, BrowserAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(DummyComponent);
    const component = fixture.componentInstance;
    const inputComponent = fixture.debugElement.query(
      By.directive(InputComponent)
    ).componentInstance;
    fixture.detectChanges();

    return {
      fixture,
      component,
      inputComponent,
    };
  }

  it('should create', async () => {
    const { component } = await setup();
    expect(component).toBeTruthy();
  });

  it('should be invalid state if submit form without fill input', async () => {
    const { component } = await setup();
    component.submit();
    expect(component.form.invalid).toBe(true);
  });

  it('should be valid state if submit form with data input', async () => {
    const { component } = await setup();
    component.form.setValue({
      name: 'test',
    });
    component.submit();
    expect(component.form.invalid).toBe(false);
  });

  it('should trigger onChange and setValue when onModelChange is called', async () => {
    const { inputComponent } = await setup();
    const onChangeSpy = jest.spyOn(inputComponent, 'onChange');
    inputComponent.onModelChange('test model change');
    expect(onChangeSpy).toHaveBeenCalledWith('test model change');
    expect(inputComponent.value).toBe('test model change');
  });

  it('should trigger onChange and setValue when onModelChange is called', async () => {
    const { component, inputComponent } = await setup();
    const onTouchSpy = jest.spyOn(inputComponent, 'onTouch');
    component.form.controls.name.markAsTouched();
    component.submit();
    inputComponent.ngDoCheck();
    expect(onTouchSpy).toHaveBeenCalled();
  });
});
