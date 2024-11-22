import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TOAST_DATA } from './toast.config';
import { ToastComponent } from './toast.component';

describe(ToastComponent.name, () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  const toastDataMock = {
    message: '',
    toastRef: {
      dispose: jest.fn(),
      detach: jest.fn(),
    },
    type: 'success',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, ToastComponent],
      providers: [
        {
          provide: TOAST_DATA,
          useValue: toastDataMock,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close when close close button', () => {
    jest.spyOn(component, 'onClick');
    const closeBtn = fixture.debugElement.query(By.css('.custom-toast__close'));
    closeBtn.nativeElement.click();
    expect(component.onClick).toHaveBeenCalled();
  });

  it('should close toast when onClick is called', () => {
    component.onClick();
    expect(toastDataMock.toastRef.detach).toHaveBeenCalled();
  });
});
