import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EpochToDatePipe } from './EpochToDatePipe';

@NgModule({
  declarations: [EpochToDatePipe],
  imports: [CommonModule],
  exports: [EpochToDatePipe]
})
export class SharedModule { }
