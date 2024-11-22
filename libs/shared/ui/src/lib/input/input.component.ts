import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  Input,
  inject,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NgControl,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

class ErrorMatchState implements ErrorStateMatcher {
  constructor(private ngControl: NgControl | null) {}

  isErrorState(): boolean {
    if (!this.ngControl) return false;
    return Boolean(this.ngControl.touched && this.ngControl.invalid);
  }
}

@Component({
  selector: 'vh-input',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent implements ControlValueAccessor, DoCheck {
  @Input()
  label = '';
  @Input()
  cssClass = '';
  @Input()
  type = 'text';
  @Input()
  errorMsg = '';
  @Input()
  useTextArea = false;
  
  isDisabled = false;
  errorMatcher!: ErrorMatchState;

  onChange!: (value?: string | number) => void;
  onTouch!: () => void;
  value: string | number = '';

  readonly ngControl = inject(NgControl, {
    self: true,
    optional: true,
  });
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
      this.errorMatcher = new ErrorMatchState(this.ngControl);
    }
  }

  get isRequired() {
    return !!this.ngControl?.control?.hasValidator(Validators.required);
  }

  ngDoCheck(): void {
    if (this.ngControl?.touched) {
      this.onTouch();
      this.cdr.markForCheck();
    }
  }

  writeValue(value: string | number): void {
    this.value = value;
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onModelChange(value: string | number): void {
    this.onChange(value);
    this.value = value;
  }
}
