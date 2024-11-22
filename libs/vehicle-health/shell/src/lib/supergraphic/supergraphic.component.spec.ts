import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SupergraphicComponent } from './supergraphic.component';

describe('SupergraphicComponent', () => {
  let component: SupergraphicComponent;
  let fixture: ComponentFixture<SupergraphicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupergraphicComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SupergraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
