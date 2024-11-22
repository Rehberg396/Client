export interface Cause {
  description: string;
}

export interface Error {
  title: string;
  causes?: Cause[];
}

export interface DiagnosticStep {
  status: number;
  title: string;
  description: string;
  errors?: Error[];
}

export type DiagnosticSteps = {
  histories: DiagnosticStep[];
  loading: boolean;
};

export interface Risk {
  riskAvailabilityLevel: number;
  riskDamageLevel: number;
  riskEmissionsLevel: number;
  riskSafetyLevel: number;
}

export interface Detection {
  negligenceLevel: number;
  dtcClearingLevel : number;
}
