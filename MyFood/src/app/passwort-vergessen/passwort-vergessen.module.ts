import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswortVergessenPageRoutingModule } from './passwort-vergessen-routing.module';

import { PasswortVergessenPage } from './passwort-vergessen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasswortVergessenPageRoutingModule
  ],
  declarations: [PasswortVergessenPage]
})
export class PasswortVergessenPageModule {}
