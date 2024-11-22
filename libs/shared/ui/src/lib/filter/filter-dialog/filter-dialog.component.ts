import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ButtonComponent } from '../../button/button.component';
import { FilterOption } from '../filter';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'vh-filter-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    MatCheckboxModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './filter-dialog.component.html',
  styleUrl: './filter-dialog.component.scss',
})
export class FilterDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<FilterDialogComponent>);
  private readonly matDialogData = inject<{
    filterOption: FilterOption[];
  }>(MAT_DIALOG_DATA);

  readonly cloneTableFilterOption = structuredClone(
    this.matDialogData.filterOption
  );

  filterOptionSelected?: FilterOption;

  ngOnInit(): void {
    this.filterOptionSelected = this.cloneTableFilterOption[0];
  }

  onSelectFilterOption(filterOption: FilterOption): void {
    this.filterOptionSelected = filterOption;
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onApplyFilter(): void {
    this.dialogRef.close(this.cloneTableFilterOption);
  }

  onFilterChecked(): void {
    this.cloneTableFilterOption.forEach(
      (item) => (item.isChecked = item.selectOption.some((x) => x.isChecked))
    );
  }
}
