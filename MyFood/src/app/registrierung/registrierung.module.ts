import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrierungPageRoutingModule } from './registrierung-routing.module';

import { RegistrierungPage } from './registrierung.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RegistrierungPageRoutingModule
  ],
  declarations: [RegistrierungPage]
})
export class RegistrierungPageModule {}
