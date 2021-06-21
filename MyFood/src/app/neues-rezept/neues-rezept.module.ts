import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NeuesRezeptPageRoutingModule } from './neues-rezept-routing.module';

import { NeuesRezeptPage } from './neues-rezept.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NeuesRezeptPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [NeuesRezeptPage]
})
export class NeuesRezeptPageModule {}
