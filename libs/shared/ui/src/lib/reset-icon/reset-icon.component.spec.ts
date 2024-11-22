import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetIconComponent } from './reset-icon.component';

describe('ResetIconComponent', () => {
  let component: ResetIconComponent;
  let fixture: ComponentFixture<ResetIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
