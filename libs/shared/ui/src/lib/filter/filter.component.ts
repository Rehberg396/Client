import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FilterOption } from './filter';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'vh-filter',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  private readonly dialog = inject(MatDialog);
  @Input() filterOption: FilterOption[] = [];
  @Output() filterOptionChange = new EventEmitter<FilterOption[]>();
  totalFilterChecked = 0;

  openDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      data: { filterOption: this.filterOption },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.filterOption = result;
        this.filterOptionChange.emit(result);
        this.updateTotalFilterChecked();
      }
    });
  }

  private updateTotalFilterChecked() {
    this.totalFilterChecked = 0;
    this.filterOption.forEach((option) => {
      if (option.selectOption.some((x) => x.isChecked)) {
        this.totalFilterChecked++;
      }
    });
  }
}
