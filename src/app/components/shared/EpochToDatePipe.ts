import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'epochToDate'
})
export class EpochToDatePipe implements PipeTransform {
  transform(value: number): Date {
    return new Date(value * 1000);
  }
}
