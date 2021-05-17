import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KochbuecherPageRoutingModule } from './kochbuecher-routing.module';

import { KochbuecherPage } from './kochbuecher.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KochbuecherPageRoutingModule
  ],
  declarations: [KochbuecherPage]
})
export class KochbuecherPageModule {}
