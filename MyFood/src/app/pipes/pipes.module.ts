import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonToArrayPipe } from './json-to-array.pipe';

@NgModule({
  declarations: [JsonToArrayPipe],
  imports: [CommonModule],
  exports: [JsonToArrayPipe]
})
export class PipeModule {}