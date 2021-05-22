import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { KochbuchPageRoutingModule } from './kochbuch-routing.module';

import { KochbuchPage } from './kochbuch.page';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    KochbuchPageRoutingModule,
    ComponentsModule
  ],
  declarations: [KochbuchPage]
})
export class KochbuchPageModule {}
