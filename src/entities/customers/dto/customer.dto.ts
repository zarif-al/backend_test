export interface CustomerInputDTO {
  name: string;
  email: string;
  address: string;
  enabled: boolean;
  emailScheduleTime: string;
}

export interface CustomerOutputDTO {
  name: string;
  email: string;
  address: string;
  enabled: boolean;
  emailScheduleTime: string;
  emailBodyTemplate: string;
}
