import { SelectionModel } from '@angular/cdk/collections';
import {
  AsyncPipe,
  DatePipe,
  DecimalPipe,
  JsonPipe,
  NgTemplateOutlet,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ButtonComponent } from '../button/button.component';
import { ResizableColumnDirective } from './resizable-column.directive';
import { ColumnConfig } from './table.model';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'vh-table',
  standalone: true,
  imports: [
    MatTableModule,
    ButtonComponent,
    MatSortModule,
    MatIconModule,
    AsyncPipe,
    ResizableColumnDirective,
    DatePipe,
    DecimalPipe,
    NgTemplateOutlet,
    MatProgressBarModule,
    MatCheckboxModule,
    MatTooltipModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> {
  columnConfigs = input<ColumnConfig<T>[]>([]);
  configs = computed(() =>
    this.columnConfigs().filter((config) => !config.hidden)
  );
  displayedColumns = computed(() => this.configs().map((config) => config.key));

  isLoading = input(false);
  dataSource = input<T[]>([]);
  errorMessage = input('');
  showHighlight = input<(value: T) => boolean>(() => false);
  showSelectedRow = input(false);
  selectedData = input<T | undefined>();
  rowSelectionChange = output<T | undefined>();
  sortBy = input('');
  sortDirection = input<SortDirection>('');
  sortChange = output<Sort>();

  handleClick(event: MouseEvent, data: T) {
    event.preventDefault();
    const current = this.selectedData();
    const value = data === current ? undefined : data;
    this.rowSelectionChange.emit(value);
  }

  selection = input(new SelectionModel<T>(true, []));
  isAllSelected() {
    const selection = this.selection();
    const dataSource = this.dataSource();
    const numSelected = selection.selected.length;
    const numRows = dataSource.length;
    return numSelected === numRows;
  }
  toggleAllRows() {
    const selection = this.selection();
    if (this.isAllSelected()) {
      selection.clear();
      return;
    }
    selection.select(...this.dataSource());
  }
  toggleRow(element: T) {
    const selection = this.selection();
    selection.toggle(element);
  }
}
