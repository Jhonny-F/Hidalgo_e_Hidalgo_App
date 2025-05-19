export interface ClientesModel {
  id: number;
  fullName: string;
  identification: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  shift?: string;
}
