import {
  ChangeDetectionStrategy,
  Component,
  LOCALE_ID,
  inject,
  isDevMode,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'vh-footer',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  locale = inject(LOCALE_ID);

  isDevMode = isDevMode();

  year = new Date().getFullYear();

  onChangeLocale(event: Event) {
    if (
      event.target &&
      'value' in event.target &&
      typeof event.target.value === 'string'
    ) {
      const value = event.target.value;
      document.cookie = `language=${value}; max-age=86400000; path=/`;
      location.href = this.replaceLocale(location.pathname, value);
    }
  }

  private replaceLocale(input: string, locale: string) {
    const regex = /^\/[a-z]{2}(?:-[a-zA-Z]{2,})?\//;
    return input.replace(regex, `/${locale}/`);
  }
}
