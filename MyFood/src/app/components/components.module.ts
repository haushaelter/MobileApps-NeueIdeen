import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SearchbarComponent } from './searchbar/searchbar.component';

const PAGES_COMPONENTS = [
  SearchbarComponent
]

@NgModule({
  declarations: [PAGES_COMPONENTS],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    PAGES_COMPONENTS
  ]
})

export class ComponentsModule { }
