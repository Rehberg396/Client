import { NO_RISK_DEFINED_COLOR, risks } from './risks.const';
import { RiskLevelColorPipe } from './risk-level-color.pipe';

describe(RiskLevelColorPipe.name, () => {
  it('create an instance', () => {
    const pipe = new RiskLevelColorPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return "#A80003" color when risk level is 4', () => {
    const pipe = new RiskLevelColorPipe();
    const color = pipe.transform(4);
    expect(color).toBe(risks[3].color);
  });

  it('should return "#ED0007" color when risk level is 3', () => {
    const pipe = new RiskLevelColorPipe();
    const color = pipe.transform(3);
    expect(color).toBe(risks[2].color);
  });

  it('should return "#FFCF00" color when risk level is 2', () => {
    const pipe = new RiskLevelColorPipe();
    const color = pipe.transform(2);
    expect(color).toBe(risks[1].color);
  });

  it('should return "#00884A" color when risk level is 1', () => {
    const pipe = new RiskLevelColorPipe();
    const color = pipe.transform(1);
    expect(color).toBe(risks[0].color);
  });

  it('should return "#7D7476" color when risk level is not defined', () => {
    const pipe = new RiskLevelColorPipe();
    const color = pipe.transform(undefined);
    expect(color).toBe(NO_RISK_DEFINED_COLOR);
  });
});
