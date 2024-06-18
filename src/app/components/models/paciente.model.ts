
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

}

export class Diagnostico{
    fecha: Date;
    texto: string;
}