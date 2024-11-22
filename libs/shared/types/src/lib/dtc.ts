export type DtcTemplate = {
  id?: string;
  source: string;
  category: string;
  group: string;
  protocolStandard: string;
  dtcCode: string;
  oem: string;
  description: string;
  possibleCause: string;
  symptom: string;
  criticality: string;
  recommendations: string[];
  comment: string;
  engineType: string;
  riskSafety: string;
  riskDamage: string;
  riskAvailability: string;
  riskEmissions: string;
};

export type DtcTemplateWithoutId = Omit<DtcTemplate, 'id'>;

export type DtcTemplateGroup = {
  dtcCode: string;
  dtcCategoryGroup: string;
  recommendations: string[];
  dtcTemplates: DtcTemplateGroup[];
  riskSafetyLevel: number;
  riskDamageLevel: number;
  riskAvailabilityLevel: number;
  riskEmissionsLevel: number;
  description: string;
  possibleCause: string;
  symptom: string;
  comment: string;
  criticality: string;
  criticalityLevel: string;
  lastUpdated: string;
};

export type DtcTemplateGroupFilter = {
  vin: string;
  criticality?: string;
};
