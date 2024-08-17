import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';

@Pipe({
  name: 'customDate'
})
export class FechaTurnoTablaPipe extends DatePipe implements PipeTransform {
  override transform(value: any, formatType: 'short' | 'full' = 'short'): any {
    if (!value) return null;

    // Convertir a Date si es un string
    const date = (typeof value === 'string') ? new Date(value) : value;

    if (formatType === 'short') {
      const formattedDate = formatDate(date, 'dd/MM/yy', 'en-US');
      const formattedTime = formatDate(date, 'hh:mm a', 'en-US');
      return `${formattedDate}, a las ${formattedTime}`;
    } else {
      const day = formatDate(date, 'EEEE', 'es-ES');
      const dayNumber = formatDate(date, 'd', 'es-ES');
      const month = formatDate(date, 'MMMM', 'es-ES');
      const year = formatDate(date, 'yyyy', 'es-ES');
      const time = formatDate(date, 'hh:mm', 'es-ES');
      const period = date.getHours() < 12 ? 'de la mañana' : 'de la tarde';
      return `${day} ${dayNumber} de ${month} del ${year}, a las ${time} ${period}`;
    }
  }
}