import { PowertrainAnomalyColorPipe } from './powertrain-anomaly-color.pipe';

describe(PowertrainAnomalyColorPipe.name, () => {
  let pipe: PowertrainAnomalyColorPipe;
  beforeEach(() => (pipe = new PowertrainAnomalyColorPipe()));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the correct color for a value of 0', () => {
    const result = pipe.transform(0);
    expect(result).toEqual('#00884a');
  });

  it('should return the default color for a negative numeric value', () => {
    const result = pipe.transform(-1);
    expect(result).toEqual('#7d7476');
  });

  it('should return the correct color for a value of 1', () => {
    const result = pipe.transform(1);
    expect(result).toEqual('#ffcf00');
  });

  it('should return the correct color for a value of 2', () => {
    const result = pipe.transform(2);
    expect(result).toEqual('#a80003');
  });

  it('should return the default color for a non-existent value', () => {
    const result = pipe.transform(3);
    expect(result).toEqual('#7d7476');
  });

  it('should return the unknown color for null value', () => {
    const result = pipe.transform(null);
    expect(result).toEqual('#7d7476');
  });
});
