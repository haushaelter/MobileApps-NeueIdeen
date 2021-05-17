import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavoritenPage } from './favoriten.page';

const routes: Routes = [
  {
    path: '',
    component: FavoritenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavoritenPageRoutingModule {}
