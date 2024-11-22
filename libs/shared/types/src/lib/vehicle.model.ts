import { DtcTemplate } from './dtc';

export interface Vehicle {
  vin: string;
  name: string;
  manufacturerName: string;
  modelLine: string;
  modelType: string;
  modelYear: string;
  engineType: string;
  licensePlate: string;
  vehicleProperties: VehicleProperty[];
  links?: string[];
}

export interface VehicleProperty {
  name: string | null;
  value: string | null;
  defaultValue: string | null;
}

export interface ProcessingStage {
  dateTime: string;
  state: string;
}

export interface VehicleFault {
  start: string;
  end: string;
  faultDateTime: string;
  status: string;
  dtcCode: string;
  protocolStandard: string;
  oem: string;
  faultOrigin: string;
  vin: string;
  dtcTemplate: DtcTemplate;
  vehicleName: string;
}

export interface RichVehicleFault extends VehicleFault {
  criticality: string | null;
  recommendations: string[] | null;
  description: string | null;
  possibleCause: string | null;
  possibleSymptoms: string | null;
}

export interface VehicleConnectivityStatus {
  inActive: number;
  active: number;
  lastSeen: number;
  isLoading: boolean;
}

export interface FaultDismissInfo {
  faultDateTime: string;
  dtcCode: string;
  protocolStandard: string;
  status: string;
  vin: string;
}

export interface FaultDismissRequest {
  faultDateTime: string;
  dtcCode: string;
  protocolStandard: string;
  vin: string;
}

export type VehicleFaultHistory = {
  histories: VehicleFault[];
  loading: boolean;
};
