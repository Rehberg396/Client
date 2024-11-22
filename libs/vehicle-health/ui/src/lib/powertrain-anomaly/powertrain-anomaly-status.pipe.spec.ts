import { PowertrainAnomalyStatusPipe } from './powertrain-anomaly-status.pipe';

describe('PowertrainAnomalyStatusPipe', () => {
  let pipe: PowertrainAnomalyStatusPipe;

  beforeEach(() => {
    pipe = new PowertrainAnomalyStatusPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transforms oil status correctly', () => {
    expect(pipe.transform('OIL', 0)).toBe('Normal Oil Temperature detected');
    expect(pipe.transform('OIL', 1)).toBe('Oil Over Temperature detected');
    expect(pipe.transform('OIL', 2)).toBe(
      'Critical Oil Over Temperature detected'
    );
    expect(pipe.transform('OIL', 3)).toBe('Unknown Oil Temperature status');
  });

  it('transforms coolant status correctly', () => {
    expect(pipe.transform('COOLANT', 0)).toBe(
      'Normal Coolant Temperature detected'
    );
    expect(pipe.transform('COOLANT', 1)).toBe(
      'Coolant Over Temperature detected'
    );
    expect(pipe.transform('COOLANT', 2)).toBe(
      'Critical Coolant Over Temperature detected'
    );
    expect(pipe.transform('COOLANT', 3)).toBe(
      'Unknown Coolant Temperature status'
    );
  });

  it('handles unknown type', () => {
    expect(pipe.transform('unknown', 0)).toBe('Unknown type');
  });

  it('handles unknown oil status', () => {
    expect(pipe.transform('OIL', null)).toBe('Unknown Oil Temperature status');
  });

  it('handles unknown coolant status', () => {
    expect(pipe.transform('COOLANT', null)).toBe(
      'Unknown Coolant Temperature status'
    );
  });
});
