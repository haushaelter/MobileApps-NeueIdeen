import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registrierung',
    loadChildren: () => import('./registrierung/registrierung.module').then( m => m.RegistrierungPageModule)
  },
  {
    path: 'passwort-vergessen',
    loadChildren: () => import('./passwort-vergessen/passwort-vergessen.module').then( m => m.PasswortVergessenPageModule)
  },
  {
    path: 'rezept',
    loadChildren: () => import('./rezept/rezept.module').then( m => m.RezeptPageModule)
  },
  {
    path: 'kochbuecher',
    loadChildren: () => import('./kochbuecher/kochbuecher.module').then( m => m.KochbuecherPageModule)
  },
  {
    path: 'favoriten',
    loadChildren: () => import('./favoriten/favoriten.module').then( m => m.FavoritenPageModule)
  },
  {
    path: 'kochbuch',
    loadChildren: () => import('./kochbuch/kochbuch.module').then( m => m.KochbuchPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
