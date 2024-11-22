import { DtcGroupIconPipe } from './dtc-group-icon.pipe';

describe(DtcGroupIconPipe.name, () => {
  let pipe: DtcGroupIconPipe;

  beforeEach(() => {
    pipe = new DtcGroupIconPipe();
  });

  it('should transform success', () => {
    expect(pipe.transform('')).toEqual('bosch-ic-wrench');
    expect(pipe.transform('Aftertreatment System')).toBe(
      'bosch-ic-car-mechanic'
    );
    expect(pipe.transform('Assistance, Comfort & Information')).toBe(
      'bosch-ic-security-street'
    );
    expect(pipe.transform('Battery and Electrics')).toBe(
      'bosch-ic-engine-battery-flash'
    );
    expect(pipe.transform('Braking System')).toBe('bosch-ic-brake-disk');
    expect(pipe.transform('Cooling System')).toBe('bosch-ic-fan-heat');
    expect(pipe.transform('Exhaust System')).toBe('bosch-ic-exhaust-pipe');
    expect(pipe.transform('Fuel Cell')).toBe('bosch-ic-fuel-cell');
    expect(pipe.transform('Other')).toBe('bosch-ic-batch');
    expect(pipe.transform('Passenger Safety')).toBe('bosch-ic-airbag');
    expect(pipe.transform('Propulsion System')).toBe(
      'bosch-ic-car-side-engine-flash'
    );
    expect(pipe.transform('test')).toBe('bosch-ic-wrench');
  });
});
