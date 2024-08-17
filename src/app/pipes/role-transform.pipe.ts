import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rolTransform'
})
export class RoleTransformPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    switch(value.toLowerCase()) {
      case 'medico':
        return 'Doctor';
      case 'paciente':
        return 'Paciente';
      default:
        return value;
    }
  }

}
