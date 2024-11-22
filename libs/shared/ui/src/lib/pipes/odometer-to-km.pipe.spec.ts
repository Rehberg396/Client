import { OdometerToKmPipe } from './odometer-to-km.pipe';

describe(OdometerToKmPipe.name, () => {
  let pipe: OdometerToKmPipe;

  beforeEach(() => {
    pipe = new OdometerToKmPipe();
  });

  it('should transform null value to an empty string', () => {
    const transformedValue = pipe.transform(null);
    expect(transformedValue).toEqual('');
  });

  it('should transform undefined value to an empty string', () => {
    const transformedValue = pipe.transform(undefined);
    expect(transformedValue).toEqual('');
  });

  it('should transform a valid number to kilometers with proper formatting', () => {
    const value = 5000000;
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toEqual('5,000 km');
  });

  it('should transform zero to kilometers with proper formatting', () => {
    const value = 0;
    const transformedValue = pipe.transform(value);
    expect(transformedValue).toEqual('0 km');
  });
});
