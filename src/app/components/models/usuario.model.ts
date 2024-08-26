
export class UsuarioModel{
    id:string;
    cedula:number;
    nombres:string;
    email:string;
    password?:string;
    rol?:string;
    especialidad?:string;
    edad?:number;
    telefono?: string;
    pacienteId?:string;
    informacionProfesional?: string;
    direccionConsultorio?: string; 
    fotoUrl?: string;
}