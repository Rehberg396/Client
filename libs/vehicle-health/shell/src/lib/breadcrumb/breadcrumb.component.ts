import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { IsActiveMatchOptions, RouterModule } from '@angular/router';
import { QueryParams } from '@cps/types';

export type Breadcrumb = {
  url: string;
  label: string;
  defaultQueryParams: QueryParams;
};

@Component({
  selector: 'vh-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
})
export class BreadcrumbComponent {
  breadcrumbs = input<Breadcrumb[]>([]);

  routerLinkActiveOptions: IsActiveMatchOptions = {
    matrixParams: 'ignored',
    queryParams: 'ignored',
    fragment: 'ignored',
    paths: 'exact',
  };
}
