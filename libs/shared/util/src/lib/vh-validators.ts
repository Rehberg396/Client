import { Validators } from '@angular/forms';

const patternSpecialChar =
  '^[\\w\\+\\-\\(\\)\\[\\]\\.\\:\\,\\?\\!\\/\\|#\\s]*$';

export class VhValidators {
  static specialChars() {
    return Validators.pattern(patternSpecialChar);
  }
}
