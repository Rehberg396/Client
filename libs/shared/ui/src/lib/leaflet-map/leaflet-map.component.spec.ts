import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeafletMapComponent } from './leaflet-map.component';

describe(LeafletMapComponent.name, () => {
  let component: LeafletMapComponent;
  let fixture: ComponentFixture<LeafletMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeafletMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeafletMapComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('latLng', [3, 1]);
    fixture.componentRef.setInput('popup', 'test');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
