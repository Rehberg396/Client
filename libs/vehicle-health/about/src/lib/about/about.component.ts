import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

type Changelog = {
  version: string;
  releaseDate: string;
  logs: {
    id: string;
    name: string;
  }[];
};

@Component({
  selector: 'vh-about',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  changelogs: Changelog[] = [
    {
      version: 'v1.1.0',
      releaseDate: '2024-09-27',
      logs: [
        {
          id: '#RSOHINFRA-711',
          name: 'Improve internal docupedia documentation for developers',
        },
        { id: '#RSOHINFRA-1256', name: 'Enable Report for Billing' },
        {
          id: '#RSOHINFRA-1636',
          name: 'Improvements for Battery Health 24V input table',
        },
        { id: '#RSOHINFRA-1658', name: 'Add new L.OS IP to whitelist in QA' },
        {
          id: '#RSOHINFRA-1693',
          name: 'Auto Fetch/Refresh Mechanism in the GUI for the Vehicle Details Page',
        },
        {
          id: '#RSOHINFRA-1695',
          name: 'Request New Internal Security Test and Fix Findings',
        },
        {
          id: '#RSOHINFRA-1708',
          name: 'Analysis and Improvement of Performance Tests Results',
        },
        { id: '#RSOHINFRA-1714', name: 'Fix Penetration Test Findings 2' },
        {
          id: '#RSOHINFRA-1718',
          name: 'Followup: Applying DevSecOps for Production Environment',
        },
        {
          id: '#RSOHINFRA-1731',
          name: 'Complete OSS Scan template for BE and FE',
        },
        {
          id: '#RSOHINFRA-1733',
          name: 'Setup and Deployment Production Environment [MRT]',
        },
        {
          id: 'RSOHINFRA-1657',
          name: 'Add drop option to plausible_range_check in data_utils',
        },
      ],
    },
    {
      version: 'v1.0.0',
      releaseDate: '2024-09-04',
      logs: [
        {
          id: '#RSOHINFRA-1248',
          name: 'Integration quality checks: add schema validation library code',
        },
        { id: '#RSOHINFRA-1257', name: 'Grafana Views for MRT VH Application' },
        { id: '#RSOHINFRA-1258', name: 'Performance Tests' },
        { id: '#RSOHINFRA-1329', name: 'Update Vehicle Health Architecture' },
        {
          id: '#RSOHINFRA-1339',
          name: 'Fix Findings of Internal Security Test',
        },
        { id: '#RSOHINFRA-1418', name: 'Service Validation' },
        { id: '#RSOHINFRA-1422', name: 'Penetration Test Findings' },
        { id: '#RSOHINFRA-1423', name: 'DevSecOps Findings' },
        { id: '#RSOHINFRA-1461', name: 'Frontend Improvements 2' },
        {
          id: '#RSOHINFRA-1463',
          name: 'Applying DevSecOps for Production Environment',
        },
        { id: '#RSOHINFRA-1468', name: 'BBM Cloud Migration Followup' },
        {
          id: '#RSOHINFRA-1481',
          name: 'Documentation for Customer API Service',
        },
        { id: '#RSOHINFRA-1648', name: 'Add WAY IP to whitelist in QA' },
      ],
    },
    {
      version: 'v0.2.0',
      releaseDate: '2024-08-13',
      logs: [
        { id: '#RSOHINFRA-616', name: 'BBM Cloud Migration' },
        { id: '#RSOHINFRA-617', name: 'BBM Cloud Migration' },
        { id: '#RSOHINFRA-740', name: 'General features' },
        { id: '#RSOHINFRA-924', name: 'VH_INFRA_L2_R3' },
        { id: '#RSOHINFRA-925', name: 'VH_INFRA_L2_R4' },
        {
          id: '#RSOHINFRA-939',
          name: 'UseCaseExecuter wrapper (platform setup) / Usecase template',
        },
        {
          id: '#RSOHINFRA-1082',
          name: '[BBM Cloud Migration] Preparing Release on July',
        },
        {
          id: '#RSOHINFRA-1122',
          name: 'Setup workflow to test use case scalability over various fleet sizes',
        },
        { id: '#RSOHINFRA-1166', name: 'Applying DevSecOps' },
        {
          id: '#RSOHINFRA-1210',
          name: 'Update of visualization according to latest feedback from legal and corporate design',
        },
        {
          id: '#RSOHINFRA-1211',
          name: 'Update DTC template with new naming of risk levels',
        },
        {
          id: '#RSOHINFRA-1225',
          name: 'Harmonize search criteria in Fleet Overview',
        },
        { id: '#RSOHINFRA-1255', name: 'Frontend Improvements' },
        {
          id: '#RSOHINFRA-1263',
          name: 'Introduce test pipeline for Battery Health 24V in BBM',
        },
        {
          id: '#RSOHINFRA-1289',
          name: 'Recommendation Module (VI): Quality measures II',
        },
        { id: '#RSOHINFRA-1308', name: 'Service Validation' },
        {
          id: '#RSOHINFRA-1358',
          name: 'Test pipeline for recommendation module',
        },
      ],
    },
    {
      version: 'v0.1.0',
      releaseDate: '2024-08-08',
      logs: [
        {
          id: '#RSOHINFRA-1093',
          name: 'Adaptation of CD API regarding Pay per Vehicle / Month',
        },
        {
          id: '#RSOHINFRA-1204',
          name: '24V Battery Health Customer API creation',
        },
        {
          id: '#RSOHINFRA-1279',
          name: 'Preparation Penetration Test on QA environment',
        },
      ],
    },
  ];
}
