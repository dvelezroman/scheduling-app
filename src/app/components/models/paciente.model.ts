
export class PacienteModel{
   
    id:any;
    nombres:string;
    cedula:number;
    correo:any;
    telefono:any;
    direccion:any;
    turno:string;
    registrador:string;
    usuarioUid:string;
    diagnostico:Diagnostico[];
    solicitudCambioTurno: string;

}

export class Diagnostico{
    fecha: Date;
    texto: string;
    cedulaPaciente?: number;
    realizadoPor?: string;
}