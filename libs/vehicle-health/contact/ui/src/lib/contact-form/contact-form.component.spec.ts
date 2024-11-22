import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonComponent, InputComponent } from '@cps/ui';
import { ContactFormComponent, ContactInfo } from './contact-form.component';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        ContactFormComponent,
        InputComponent,
        ButtonComponent,
        BrowserAnimationsModule.withConfig({ disableAnimations: true }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('userInfo', {
      name: 'Test User',
      email: 'test@example.com',
    });
    fixture.componentRef.setInput('isLoading', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with userInfo', () => {
    const formValue = component.form.value;
    expect(formValue.name).toBe('Test User');
    expect(formValue.email).toBe('test@example.com');
  });

  it('should emit sendFeedback event with form value on submit', () => {
    const feedbackValue: ContactInfo = {
      name: 'Test User',
      email: 'test@example.com',
      feedback: 'Great service!',
    };
    const sendFeedbackSpy = jest.spyOn(component.sendFeedback, 'emit');
    component.form.setValue(feedbackValue);

    component.onSubmit();

    expect(sendFeedbackSpy).toHaveBeenCalledWith({
      value: feedbackValue,
      reset: expect.any(Function),
    });
  });

  it('should mark all fields as touched if form is invalid on submit', () => {
    component.form.controls['feedback'].setValue('');
    component.onSubmit();

    expect(component.form.controls['feedback'].touched).toBeTruthy();
    expect(component.form.invalid).toBeTruthy();
  });
});
