import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RezeptPageRoutingModule } from './rezept-routing.module';

import { RezeptPage } from './rezept.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RezeptPageRoutingModule
  ],
  declarations: [RezeptPage]
})
export class RezeptPageModule {}
