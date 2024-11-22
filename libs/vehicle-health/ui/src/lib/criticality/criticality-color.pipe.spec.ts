import { CriticalityColorPipe } from './criticality-color.pipe';

describe(CriticalityColorPipe.name, () => {
  let pipe: CriticalityColorPipe;
  beforeEach(() => {
    pipe = new CriticalityColorPipe();
  });

  it('should return #a80003 when value = 1', () => {
    pipe = new CriticalityColorPipe();
    expect(pipe.transform(1)).toBe('#a80003');
  });

  it('should return #9e2896 when value = 2', () => {
    pipe = new CriticalityColorPipe();
    expect(pipe.transform(2)).toBe('#9e2896');
  });

  it('should return #ed0007 when value = 3', () => {
    pipe = new CriticalityColorPipe();
    expect(pipe.transform(3)).toBe('#ed0007');
  });

  it('should return #fa6800 when value = 4', () => {
    pipe = new CriticalityColorPipe();
    expect(pipe.transform(4)).toBe('#fa6800');
  });

  it('should return #ffcf00 when value = 5', () => {
    pipe = new CriticalityColorPipe();
    expect(pipe.transform(5)).toBe('#ffcf00');
  });

  it('should return #00884a when value is not in range 1 to 5', () => {
    pipe = new CriticalityColorPipe();
    expect(pipe.transform(6)).toBe('#00884a');
  });
});
