import { FormControl } from '@angular/forms';
import { VhValidators } from './vh-validators';

describe('VhValidators', () => {
  it('should return null if value contains only allowed special characters', () => {
    const control = new FormControl('valid_text_with_special_chars_!?.');
    const result = VhValidators.specialChars()(control);
    expect(result).toBeNull();
  });

  it('should return an error if value contains disallowed special characters', () => {
    const control = new FormControl('invalid_text_with_special_char_$');
    const result = VhValidators.specialChars()(control);
    expect(result).toEqual({
      pattern: {
        requiredPattern: '^[\\w\\+\\-\\(\\)\\[\\]\\.\\:\\,\\?\\!\\/\\|#\\s]*$',
        actualValue: 'invalid_text_with_special_char_$',
      },
    });
  });

  it('should return null if the value is empty', () => {
    const control = new FormControl('');
    const result = VhValidators.specialChars()(control);
    expect(result).toBeNull();
  });

  it('should return null if the value is null', () => {
    const control = new FormControl(null);
    const result = VhValidators.specialChars()(control);
    expect(result).toBeNull();
  });
});
