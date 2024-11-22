export interface PowertrainAnomaly {
  vin: string;
  coolantStatus: number;
  oilStatus: number;
  coolantTimestamp: string;
  oilTimestamp: string;
}

export interface PowertrainAnomalyHistory {
  oilHistories: AnomalyHistory[];
  coolantHistories: AnomalyHistory[];
}

export interface AnomalyHistory {
  timestamp: string;
  status: number;
  anomalyType: string;
}
