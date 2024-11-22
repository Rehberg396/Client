import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessDeniedComponent } from './access-denied.component';
import { AuthService } from '../auth.service';

describe(AccessDeniedComponent.name, () => {
  let component: AccessDeniedComponent;
  let fixture: ComponentFixture<AccessDeniedComponent>;
  let logout: jest.Func;

  beforeEach(async () => {
    logout = jest.fn();
    const authService = {
      logout,
    };

    await TestBed.configureTestingModule({
      imports: [AccessDeniedComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccessDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.logout when logout button is clicked', () => {
    component.logout();
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
