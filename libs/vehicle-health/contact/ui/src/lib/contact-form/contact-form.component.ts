import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  inject,
  input,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactType } from '@cps/types';
import { ButtonComponent, InputComponent } from '@cps/ui';

export type UserInfo = {
  name: string;
  email: string;
};

export type ContactInfo = {
  name: string;
  email: string;
  feedback: string;
};
@Component({
  selector: 'vh-contact-form',
  standalone: true,
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent],
  providers: [],
})
export class ContactFormComponent {
  private readonly formBuilder = inject(FormBuilder);

  constructor() {
    effect(() => {
      this.form.patchValue({
        name: this.userInfo().name,
        email: this.userInfo().email,
      });
    });
  }

  userInfo = input.required<UserInfo>();
  isLoading = input.required<boolean>();

  @Output()
  sendFeedback = new EventEmitter<ContactType>();

  public form = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control(
      {
        disabled: false,
        value: '',
      },
      [Validators.required, Validators.minLength(1), Validators.maxLength(100)]
    ),
    email: this.formBuilder.nonNullable.control(
      {
        disabled: false,
        value: '',
      },
      [Validators.required, Validators.email]
    ),
    feedback: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(1000),
    ]),
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.sendFeedback.emit({
      value: this.form.getRawValue(),
      reset: () => {
        this.form.reset({ ...value, feedback: '' });
      },
    });
  }
}
