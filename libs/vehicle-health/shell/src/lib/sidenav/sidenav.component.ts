import { NestedTreeControl } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule, MatTreeNestedDataSource } from '@angular/material/tree';
import { IsActiveMatchOptions, RouterModule } from '@angular/router';
import { QueryParams } from '@cps/types';

interface NavItem {
  link?: string;
  text: string;
  icon: string;
  children?: NavItem[];
  routerLinkActiveOptions: IsActiveMatchOptions;
  defaultQueryParams?: QueryParams;
}

const routerLinkActiveOptions: IsActiveMatchOptions = {
  matrixParams: 'ignored',
  queryParams: 'ignored',
  fragment: 'ignored',
  paths: 'exact',
};

@Component({
  selector: 'vh-sidenav',
  standalone: true,
  imports: [
    MatIconModule,
    MatTreeModule,
    RouterModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  treeControl = new NestedTreeControl<NavItem>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<NavItem>();

  secondaryNavItems: NavItem[] = [
    {
      link: `/contact`,
      text: $localize`Contact`,
      icon: 'bosch-ic-adress-book',
      routerLinkActiveOptions,
    },
    {
      link: `/disclaimer`,
      text: $localize`Disclaimer`,
      icon: 'bosch-ic-problem-frame',
      routerLinkActiveOptions,
    },
    {
      link: `/about`,
      text: $localize`About`,
      icon: 'bosch-ic-info-i',
      routerLinkActiveOptions,
    },
  ];

  isOpen = true;

  constructor() {
    this.dataSource.data = [
      {
        link: `/fleet-overview`,
        text: $localize`Fleet Overview`,
        icon: 'bosch-ic-desktop-management-statistics',
        defaultQueryParams: {
          page: '0',
          size: '10',
        },
        routerLinkActiveOptions: {
          ...routerLinkActiveOptions,
          paths: 'subset',
        },
      },
      {
        link: `/vehicle`,
        text: $localize`Vehicle Management`,
        icon: 'bosch-ic-car',
        routerLinkActiveOptions,
        defaultQueryParams: {
          page: '0',
          size: '10',
        },
      },
      {
        link: `/diagnostic`,
        text: $localize`Vehicle Diagnostic`,
        icon: 'bosch-ic-vehicle-diagnostic-check',
        routerLinkActiveOptions,
      }
    ];
  }

  hasChild = (_: number, node: NavItem) =>
    !!node.children && node.children.length > 0;

  toggleMenu(isOpen: boolean) {
    this.isOpen = isOpen;
  }

  getPadding(element: HTMLElement): string {
    const level = Number.parseInt(
      element.getAttribute('aria-level') ?? '1',
      10
    );
    if (level === 1) {
      return '';
    }
    return level * 1.25 + 'rem';
  }
}
