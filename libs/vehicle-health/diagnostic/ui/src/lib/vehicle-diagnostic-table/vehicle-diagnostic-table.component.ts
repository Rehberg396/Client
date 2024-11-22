import { Component, EventEmitter, Output, Input, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';


import { StatusComponent } from '@cps/vehicle-health/ui';
import {
  ExpandIconComponent,
  ResetIconComponent,
 } from '@cps/ui';

import { VehicleDiagnosticDetailsComponent } from '../vehicle-diagnostic-details';
import { DiagnosticStep, RequestStatus } from '@cps/types';


@Component({
  selector: 'vh-vehicle-diagnostic-table',
  standalone: true,
  templateUrl: './vehicle-diagnostic-table.component.html',
  styleUrl: './vehicle-diagnostic-table.component.scss',
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressBarModule,
    StatusComponent,
    VehicleDiagnosticDetailsComponent,
    ExpandIconComponent,
    MatIconModule,
    ResetIconComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehicleDiagnosticTableComponent {
  @Input() dataSource: RequestStatus<DiagnosticStep[]> = {
    loadingState: 'initial',
  };
  @Output() toggleDetail = new EventEmitter<DiagnosticStep>();
  @Output() resetSteps = new EventEmitter<void>();

  displayedColumns: string[] = ['status', 'step', 'expand'];
  expandedElement: DiagnosticStep | null = null;


  onToggle(event: MouseEvent, element: DiagnosticStep) {
    event.stopPropagation();
    this.expandedElement = this.expandedElement === element ? null : element;
    const isExpanded = this.expandedElement === element;
    if (isExpanded) this.toggleDetail.emit(element);
  }

  onReset() {
    this.resetSteps.emit();
  }
}
