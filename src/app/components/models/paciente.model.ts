
export class PacienteModel{
   
    id:any;
    nombres:string;
    cedula:number;
    correo:any;
    telefono:any;
    direccion:any;
    turno:string;
    turnoParaMostrar:Turno[];
    registrador:string;
    usuarioUid:string;
    diagnostico:Diagnostico[];
    solicitudCambioTurno: string;
    fotoUrl?: string;

}
export class Turno {
    fechaHora: string; 
    cedulaPaciente: number;
    nombreMedico: string;
    emailMedico: string;
  }

export class Diagnostico{
    id?: string;
    fecha: Date;
    texto: string;
    cedulaPaciente?: number;
    realizadoPor?: string;
    leido?: boolean;
}