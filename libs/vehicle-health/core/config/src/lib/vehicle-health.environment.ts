export type VehicleHealthEnvironment = {
  production: boolean;
  vh: string;
  sm: string;
  keycloak: {
    url: string;
    realm: string;
    clientId: string;
    resource: string;
  };
  refreshRate: number;
  checkForUpdateRate: number;
};
