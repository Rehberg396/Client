import { MetadataPipe } from './metadata.pipe';

describe(MetadataPipe.name, () => {
  const userNotification = {
    category: 'manual_update_enginetype',
    content: 'test',
    createdDate: new Date().toJSON(),
    id: 'test',
    messageStatus: 'read',
    metadata: {},
  };

  it('should return empty', () => {
    expect(
      new MetadataPipe().transform({
        ...userNotification,
        category: 'other',
      })
    ).toBe('');
  });

  it('should return [licensePlate] value', () => {
    expect(
      new MetadataPipe().transform({
        ...userNotification,
        category: 'manual_update_enginetype',
        metadata: {
          vin: 'vin',
          licensePlate: 'licensePlate',
        },
      })
    ).toBe('[licensePlate]');
  });

  it('should return [vin] value', () => {
    expect(
      new MetadataPipe().transform({
        ...userNotification,
        category: 'manual_update_enginetype',
        metadata: {
          vin: 'vin',
        },
      })
    ).toBe('[vin]');
  });

  it('should return empty value when metadata does not have vin or license plate', () => {
    expect(
      new MetadataPipe().transform({
        ...userNotification,
        category: 'manual_update_enginetype',
        metadata: {
          other: 'other',
        },
      })
    ).toBe('');
  });
});
