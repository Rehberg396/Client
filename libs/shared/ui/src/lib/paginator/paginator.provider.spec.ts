import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { By } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePaginatorIntl } from './paginator.provider';

@Component({
  standalone: true,
  selector: 'vh-stub',
  template: `<mat-paginator [length]="30" [pageSize]="10"></mat-paginator>`,
  imports: [MatPaginatorModule],
})
class StubComponent {}

describe(providePaginatorIntl.name, () => {
  let fixture: ComponentFixture<StubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StubComponent],
      providers: [provideAnimations(), providePaginatorIntl()],
    }).compileComponents();

    fixture = TestBed.createComponent(StubComponent);
    fixture.detectChanges();
  });

  describe('pageSizeOptions', () => {
    it('should have page size options of [5, 10, 20]', () => {
      const debugEl = fixture.debugElement;
      const paginatorDebugEl = debugEl.query(By.directive(MatPaginator));
      const matPaginator = paginatorDebugEl.componentInstance as MatPaginator;
      expect(matPaginator.pageSizeOptions).toEqual([5, 10, 20]);
    });
  });

  describe('matPaginatorIntl', () => {
    it('should have getRangeLabel to be 0 of 0', () => {
      fixture.detectChanges();
      const paginatorDebugEl = fixture.debugElement.query(
        By.directive(MatPaginator)
      );
      const matPaginator = paginatorDebugEl.componentInstance as MatPaginator;
      expect(matPaginator._intl.getRangeLabel(0, 0, 0)).toBe('0 of 0');
    });

    it('should have getRangeLabel to be 1 - 10 of 30', () => {
      const paginatorDebugEl = fixture.debugElement.query(
        By.directive(MatPaginator)
      );
      const matPaginator = paginatorDebugEl.componentInstance as MatPaginator;
      expect(matPaginator._intl.getRangeLabel(0, 10, 30)).toBe('1 - 10 of 30');
    });

    it('should have getRangeLabel to be 21 - 24 of 24', () => {
      const paginatorDebugEl = fixture.debugElement.query(
        By.directive(MatPaginator)
      );
      const matPaginator = paginatorDebugEl.componentInstance as MatPaginator;
      expect(matPaginator._intl.getRangeLabel(2, 10, 24)).toBe('21 - 24 of 24');
    });

    it('should have getRangeLabel to be 21 - 30 of 30', () => {
      const paginatorDebugEl = fixture.debugElement.query(
        By.directive(MatPaginator)
      );
      const matPaginator = paginatorDebugEl.componentInstance as MatPaginator;
      expect(matPaginator._intl.getRangeLabel(2, 10, 30)).toBe('21 - 30 of 30');
    });

    it('should have getRangeLabel to be 11 - 20 of 10', () => {
      const paginatorDebugEl = fixture.debugElement.query(
        By.directive(MatPaginator)
      );
      const matPaginator = paginatorDebugEl.componentInstance as MatPaginator;
      expect(matPaginator._intl.getRangeLabel(1, 10, 10)).toBe('11 - 20 of 10');
    });

    it('should have previousPageLabel to be Prev page', () => {
      const paginatorDebugEl = fixture.debugElement.query(
        By.directive(MatPaginator)
      );
      const matPaginator = paginatorDebugEl.componentInstance as MatPaginator;
      expect(matPaginator._intl.previousPageLabel).toBe('Previous page');
    });

    it('should have nextPageLabel to be Next page', () => {
      const paginatorDebugEl = fixture.debugElement.query(
        By.directive(MatPaginator)
      );
      const matPaginator = paginatorDebugEl.componentInstance as MatPaginator;
      expect(matPaginator._intl.nextPageLabel).toBe('Next page');
    });

    it('should have itemsPerPageLabel to be Item per page', () => {
      const paginatorDebugEl = fixture.debugElement.query(
        By.directive(MatPaginator)
      );
      const matPaginator = paginatorDebugEl.componentInstance as MatPaginator;
      expect(matPaginator._intl.itemsPerPageLabel).toBe('Items per page');
    });
  });
});
