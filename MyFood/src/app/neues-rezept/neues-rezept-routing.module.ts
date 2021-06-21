import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NeuesRezeptPage } from './neues-rezept.page';

const routes: Routes = [
  {
    path: '',
    component: NeuesRezeptPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NeuesRezeptPageRoutingModule {}
