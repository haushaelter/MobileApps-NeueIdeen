import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KochbuecherPage } from './kochbuecher.page';

const routes: Routes = [
  {
    path: '',
    component: KochbuecherPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KochbuecherPageRoutingModule {}
