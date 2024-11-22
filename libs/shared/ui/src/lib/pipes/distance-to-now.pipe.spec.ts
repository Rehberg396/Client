import { DistanceToNowPipe } from './distance-to-now.pipe';

describe(DistanceToNowPipe.name, () => {
  let pipe: DistanceToNowPipe;

  beforeEach(() => {
    pipe = new DistanceToNowPipe();
  });

  it('should return empty when value is undefined', () => {
    const value = pipe.transform(undefined, 'en-US');
    expect(value).toBe('');
  });

  it('should return empty when value is null', () => {
    const value = pipe.transform(null, 'en-US');
    expect(value).toBe('');
  });

  it('should return empty when value is empty', () => {
    const value = pipe.transform('', 'en-US');
    expect(value).toBe('');
  });

  it('should return correct value when value is a valid date', () => {
    const value = pipe.transform(new Date(), 'en-US');
    expect(value).toBe('less than a minute ago');
  });

  it('should return correct value when value is a valid date', () => {
    const value = pipe.transform(new Date().toJSON(), 'en-US');
    expect(value).toBe('less than a minute ago');
  });

  it('should return correct value when value is a valid date number millis', () => {
    const value = pipe.transform(new Date().getTime(), 'en-US');
    expect(value).toBe('less than a minute ago');
  });
});
