import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonLoadingComponent } from './skeleton-loading.component';

describe('SkeletonLoadingComponent', () => {
  let component: SkeletonLoadingComponent;
  let fixture: ComponentFixture<SkeletonLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonLoadingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set countItems', () => {
    component.count = 2;
    expect(component.countItems).toEqual([1, 1]);
  });

  it('should not truncate %', () => {
    component.width = '100';
    expect(component.hostWidth).toBe('100');
  });

  it('should truncate %', () => {
    component.width = '100%';
    expect(component.hostWidth).toBe(100);
  });
});
