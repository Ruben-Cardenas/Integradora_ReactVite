export interface ResidenteMySQL {
  id?: number;
  name: string;
  houseNumber: string;
  status: 'Activo' | 'Inactivo';
  username?: string;
  password?: string;
  controlId?: string;
  pin?: string;
  topic?: string;
}

export default ResidenteMySQL;