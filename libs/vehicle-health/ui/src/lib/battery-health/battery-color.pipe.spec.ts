import { BatteryColorPipe } from './battery-color.pipe';

describe(BatteryColorPipe.name, () => {
  const batteryColorPipe = new BatteryColorPipe();

  it('should return #00884A when value is 1', () => {
    expect(batteryColorPipe.transform(1)).toBe('#00884A');
  });

  it('should return #FFCF00 when value is 2', () => {
    expect(batteryColorPipe.transform(2)).toBe('#FFCF00');
  });

  it('should return #ED0007 when value is 3', () => {
    expect(batteryColorPipe.transform(3)).toBe('#ED0007');
  });

  it('should return #00884A when value is 4', () => {
    expect(batteryColorPipe.transform(4)).toBe('#00884A');
  });

  it('should return #00884A when value is 0', () => {
    expect(batteryColorPipe.transform(0)).toBe('#00884A');
  });
});
