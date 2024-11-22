import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailDescriptionItemComponent } from './detail-description-item.component';

describe('DetailDescriptionItemComponent', () => {
  let component: DetailDescriptionItemComponent;
  let fixture: ComponentFixture<DetailDescriptionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailDescriptionItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailDescriptionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
