import { CriticalityMap } from './criticality.const';

describe('Criticality Contant test', () => {
  it('should map criticality values to their respective objects correctly', () => {
    const expectedMap = new Map([
      [
        'Serious',
        {
          value: 'Serious',
          icon: 'bosch-ic-alert-error-filled',
          field: 'serious',
          level: 1,
          color: '#a80003',
        },
      ],
      [
        'Manufacturer Specific',
        {
          value: 'Manufacturer Specific',
          icon: 'bosch-ic-alert-info-filled',
          field: 'manufacturerSpecific',
          level: 2,
          color: '#9e2896',
        },
      ],
      [
        'High',
        {
          value: 'High',
          icon: 'bosch-ic-alert-error-filled',
          field: 'high',
          level: 3,
          color: '#ed0007',
        },
      ],
      [
        'Medium',
        {
          value: 'Medium',
          icon: 'bosch-ic-alert-info-filled',
          field: 'medium',
          level: 4,
          color: '#fa6800',
        },
      ],
      [
        'Low',
        {
          value: 'Low',
          icon: 'bosch-ic-alert-info-filled',
          field: 'low',
          level: 5,
          color: '#ffcf00',
        },
      ],
      [
        'No criticality',
        {
          value: 'No criticality',
          icon: 'bosch-ic-alert-success-filled',
          field: 'noCriticality',
          level: 6,
          color: '#00884a',
        },
      ],
    ]);
    expect(CriticalityMap).toEqual(expectedMap);
  });
});
