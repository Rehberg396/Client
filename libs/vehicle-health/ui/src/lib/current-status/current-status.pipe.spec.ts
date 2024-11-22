import { CurrentStatusPipe } from './current-status.pipe';

describe(CurrentStatusPipe.name, () => {
  let pipe: CurrentStatusPipe;

  beforeEach(() => {
    pipe = new CurrentStatusPipe();
  });

  it('should return the correct status hover description', () => {
    expect(pipe.transform('Active')).toBe(
      'The latest fault was received at a time less than 1 day at'
    );
    expect(pipe.transform('Offline')).toBe(
      'The latest fault was received at a time greater than 1 day at'
    );
    expect(pipe.transform('')).toBe('');
  });
});
