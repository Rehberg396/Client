import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'vh-search-input',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './search-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent {
  @Output() search = new EventEmitter<string>();
  @Input() label = '';
  @Input() placeholder = '';
  @Input() hint = '';

  @Input()
  set value(value: string) {
    this.form.patchValue({ search: value });
  }
  @Input() set disabled(isDisabled: boolean) {
    if (isDisabled) {
      this.form.controls.search.disable();
    } else {
      this.form.controls.search.enable();
    }
  }

  form = new FormGroup({
    search: new FormControl('', {
      nonNullable: true,
    }),
  });
  onSearch() {
    this.search.emit(this.form.getRawValue().search);
  }
  onClear() {
    this.form.reset();
    this.search.emit(this.form.getRawValue().search);
  }
}
