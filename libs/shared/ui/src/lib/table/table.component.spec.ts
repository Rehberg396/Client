import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { By } from '@angular/platform-browser';

describe(TableComponent.name, () => {
  let component: TableComponent<{ name: string }>;
  let fixture: ComponentFixture<TableComponent<{ name: string }>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent<{ name: string }>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle selectedData', async () => {
    fixture.componentRef.setInput('columnConfigs', [
      {
        label: 'Name',
        key: 'name',
        type: 'text',
      },
    ]);
    const data = { name: 'test' };
    fixture.componentRef.setInput('dataSource', [data]);
    fixture.detectChanges();
    jest.spyOn(component.rowSelectionChange, 'emit');

    const debugEl = fixture.debugElement;
    const row = debugEl.query(By.css('.element-row'));

    row.nativeElement.click();
    expect(component.rowSelectionChange.emit).toHaveBeenCalledWith({
      name: 'test',
    });
    fixture.componentRef.setInput('selectedData', data);
    fixture.detectChanges();
    row.nativeElement.click();
    expect(component.rowSelectionChange.emit).toHaveBeenCalledWith(undefined);
  });

  describe('selection', () => {
    const row1 = { name: 'test1' };
    const row2 = { name: 'test2' };

    beforeAll(async () => {
      fixture.componentRef.setInput('columnConfigs', [
        {
          label: 'Selection',
          key: 'selection',
          type: 'selection',
        },
        {
          label: 'Name',
          key: 'name',
          type: 'text',
        },
      ]);
      fixture.componentRef.setInput('dataSource', [row1, row2]);
    });

    it('toggleAllRows', () => {
      component.toggleAllRows();
      expect(component.selection().selected).toEqual([]);
      component.selection().select(row1, row2);
      component.toggleAllRows();
      expect(component.selection().selected).toEqual([row1, row2]);
    });

    it('toggleRow', () => {
      component.toggleRow(row1);
      expect(component.selection().isSelected(row1)).toBe(true);
      component.toggleRow(row1);
      expect(component.selection().isSelected(row1)).toBe(false);
    });
  });
});
