export const colors = [
  {
    category: 'Good Battery',
    sohStatus: 1,
    color: '#00884A',
  },
  {
    category: 'Aged Battery',
    sohStatus: 2,
    color: '#FFCF00',
  },
  {
    category: 'Bad Battery',
    sohStatus: 3,
    color: '#ED0007',
  },
] as const;

export type BatteryColors = typeof colors;
export type SohStatus = BatteryColors[number]['sohStatus'];
export type BatteryColor = BatteryColors[number]['color'];

export const batteryColorMap = new Map<number, BatteryColor>(
  colors.map((v) => [v.sohStatus, v.color])
);
