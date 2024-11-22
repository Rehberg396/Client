import { CriticalityPipe } from './criticality.pipe';

describe(CriticalityPipe.name, () => {
  it('create an instance', () => {
    const pipe = new CriticalityPipe();
    expect(pipe).toBeTruthy();
  });
});
