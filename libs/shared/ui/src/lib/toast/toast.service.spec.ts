import { Overlay, OverlayModule } from '@angular/cdk/overlay';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastComponent } from './toast.component';
import { TOAST_DATA } from './toast.config';
import { ToastService } from './toast.service';

describe(ToastService.name, () => {
  let service: ToastService;
  let fixture: ComponentFixture<ToastComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OverlayModule,
        BrowserAnimationsModule,
        MatIconModule,
        ToastComponent,
      ],
      providers: [
        Overlay,
        {
          provide: TOAST_DATA,
          useValue: {
            message: 'test',
            toastRef: {
              dispose: () => jasmine.createSpy(),
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    service = TestBed.inject(ToastService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should show toast when call success', () => {
    service.success('success');
    const toastContainer = fixture.debugElement.query(
      By.css('.custom-toast-container')
    );
    const message = fixture.debugElement.query(
      By.css('.custom-toast-content__message')
    );
    expect(toastContainer).toBeTruthy();
    expect(message.nativeElement.innerHTML.trim()).toBe('test');
  });

  it('should show toast when call error', () => {
    service.error('success');
    const toastContainer = fixture.debugElement.query(
      By.css('.custom-toast-container')
    );
    const message = fixture.debugElement.query(
      By.css('.custom-toast-content__message')
    );
    expect(toastContainer).toBeTruthy();
    expect(message.nativeElement.innerHTML.trim()).toBe('test');
  });
});
