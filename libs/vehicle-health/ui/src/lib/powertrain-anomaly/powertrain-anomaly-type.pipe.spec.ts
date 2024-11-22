import { PowertrainAnomalyTypesPipe } from './powertrain-anomaly-type.pipe';

describe('powertrainAnomalyType', () => {
  let pipe: PowertrainAnomalyTypesPipe;

  beforeEach(() => {
    pipe = new PowertrainAnomalyTypesPipe();
  });

  it('should return "Coolant Temperature Status" for type "COOLANT"', () => {
    expect(pipe.transform('COOLANT')).toBe('Coolant Temperature Status');
  });

  it('should return "Oil Temperature Status" for type "OIL"', () => {
    expect(pipe.transform('OIL')).toBe('Oil Temperature Status');
  });

  it('should return "Unknown type" for an unknown type', () => {
    expect(pipe.transform('UNKNOWN')).toBe('Unknown type');
  });
});
