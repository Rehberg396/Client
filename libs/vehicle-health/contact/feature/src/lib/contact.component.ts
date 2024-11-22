import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ContactType } from '@cps/types';
import { ToastService } from '@cps/ui';
import { AuthService } from '@cps/vehicle-health/auth';
import { ContactFormComponent } from '@cps/vehicle-health/contact/ui';
import { ContactService } from '@cps/vehicle-health/data-access';

@Component({
  selector: 'vh-contact',
  standalone: true,
  imports: [ContactFormComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly contactService = inject(ContactService);

  authState = this.authService.authState;
  userInfo = computed(() => {
    const authState = this.authState();
    if (authState.isAuthenticated && authState.userInfo.hasAnyPermission()) {
      return {
        name: authState.userInfo.name,
        email: authState.userInfo.email,
      };
    }
    return {
      name: '',
      email: '',
    };
  });

  isLoading = signal(false);

  handleSubmit({ value: contactDetails, reset: resetForm }: ContactType) {
    this.isLoading.set(true);

    this.contactService.postFeedback(contactDetails).subscribe(
      () => {
        const message = $localize`Send feedback successfully`;
        this.toastService.success(message);
        this.isLoading.set(false);
        resetForm();
      },
      () => {
        const message = $localize`Send feedback fail`;
        this.toastService.error(message);
        this.isLoading.set(false);
      }
    );
  }
}
