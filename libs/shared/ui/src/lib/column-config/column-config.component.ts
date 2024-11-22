import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../button';

@Component({
  selector: 'vh-column-config',
  standalone: true,
  imports: [
    CommonModule,
    CdkOverlayOrigin,
    CdkConnectedOverlay,
    MatCheckboxModule,
    FormsModule,
    ButtonComponent,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './column-config.component.html',
  styleUrl: './column-config.component.scss',
})
export class ColumnConfigComponent {
  configs = input<
    {
      key: string;
      title: string;
      isChecked?: boolean;
    }[]
  >([]);

  @Output()
  configChange = new EventEmitter<string[]>();

  isActive = false;

  onApply(): void {
    const checkedColumnConfigs = this.configs()
      .filter((tableColumnConfig) => tableColumnConfig.isChecked)
      .map((tableColumnConfigs) => tableColumnConfigs.key);
    this.configChange.emit(checkedColumnConfigs);
    this.isActive = false;
  }
}
