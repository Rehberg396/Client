import { RiskLevelCategoryPipe } from './risk-level-category.pipe';

describe(RiskLevelCategoryPipe.name, () => {
  it('create an instance', () => {
    const pipe = new RiskLevelCategoryPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return No Risk color when risk level is 4', () => {
    const pipe = new RiskLevelCategoryPipe();
    const color = pipe.transform(4);
    expect(color).toBe('No Risk');
  });

  it('should return Minor color when risk level is 3', () => {
    const pipe = new RiskLevelCategoryPipe();
    const color = pipe.transform(3);
    expect(color).toBe('Minor');
  });

  it('should return Major color when risk level is 2', () => {
    const pipe = new RiskLevelCategoryPipe();
    const color = pipe.transform(2);
    expect(color).toBe('Major');
  });
  it('should return Critical color when risk level is 1', () => {
    const pipe = new RiskLevelCategoryPipe();
    const color = pipe.transform(1);
    expect(color).toBe('Critical');
  });
});
