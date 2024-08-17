import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'fechaDiagnostico'
})
export class FechaDiagnosticoPipe extends DatePipe implements PipeTransform {
  override transform(value: any, ...args: any[]): any {
    if (value) {
      const fecha = new Date(value);
      const diaSemana = super.transform(fecha, 'EEEE', 'es-ES');
      const dia = super.transform(fecha, 'd', 'es-ES');
      const mes = super.transform(fecha, 'MMMM', 'es-ES');
      const anio = super.transform(fecha, 'yyyy', 'es-ES');
      const hora = super.transform(fecha, 'h:mm a', 'es-ES');
      const periodo = fecha.getHours() < 12 ? 'de la mañana' : 'de la tarde';
      return `Diagnóstico realizado, ${diaSemana} ${dia} de ${mes} del ${anio} a las ${hora}`;
    }
    return value;
  }
}