import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  DoCheck,
  EventEmitter,
  Input,
  NgZone,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { filter, map, pairwise, throttleTime } from 'rxjs';

type Option = {
  label: string;
  value: string;
};

class ErrorMatchStateSelect implements ErrorStateMatcher {
  constructor(private ngControl: NgControl | null) {}

  isErrorState(): boolean {
    if (!this.ngControl) return false;
    return Boolean(this.ngControl.touched && this.ngControl.invalid);
  }
}

@Component({
  selector: 'vh-select',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule, FormsModule, ScrollingModule],
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent
  implements ControlValueAccessor, DoCheck, AfterViewInit
{
  @Input()
  label = '';
  @Input()
  errorMsg = '';
  @Input()
  cssClass = '';

  #options: Option[] = [];
  @Input()
  set options(options: (Option | string)[]) {
    this.#options = options.map((value) => {
      if (typeof value === 'string') {
        return {
          label: value,
          value: value,
        };
      }
      return value;
    });
  }
  get options(): Option[] {
    return this.#options;
  }

  @Output() loadMore = new EventEmitter<void>();

  @ViewChild('scroller', { static: true }) scroller!: CdkVirtualScrollViewport;

  value: any;
  isDisabled = false;
  errorMatcher!: ErrorMatchStateSelect;
  onChange!: (value?: any) => void;
  onTouch!: () => void;

  ngControl = inject(NgControl, { self: true, optional: true });
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private readonly ngZone = inject(NgZone);

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
      this.errorMatcher = new ErrorMatchStateSelect(this.ngControl);
    }
  }

  ngDoCheck(): void {
    if (this.ngControl?.touched) {
      this.onTouch();
      this.cdr.markForCheck();
    }
  }

  ngAfterViewInit(): void {
    this.setupVirtualLoading();
  }

  setupVirtualLoading(): void {
    this.scroller
      .elementScrolled()
      .pipe(
        map(() => this.scroller.measureScrollOffset('bottom')),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < 140),
        throttleTime(200),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          this.loadMore.emit();
        });
      });
  }

  writeValue(value: any): void {
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

  onModelChange(event: any): void {
    this.onChange(event);
    this.value = event;
  }
}
