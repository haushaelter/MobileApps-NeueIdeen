import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KochbuchPage } from './kochbuch.page';

const routes: Routes = [
  {
    path: '',
    component: KochbuchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KochbuchPageRoutingModule {}
