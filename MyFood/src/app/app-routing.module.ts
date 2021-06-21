import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  
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
  },{
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'favoriten',
    loadChildren: () => import('./favoriten/favoriten.module').then( m => m.FavoritenPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'kochbuecher',
    loadChildren: () => import('./kochbuecher/kochbuecher.module').then( m => m.KochbuecherPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'rezept',
    loadChildren: () => import('./rezept/rezept.module').then( m => m.RezeptPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'kochbuch',
    loadChildren: () => import('./kochbuch/kochbuch.module').then( m => m.KochbuchPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'neues-rezept',
    loadChildren: () => import('./neues-rezept/neues-rezept.module').then( m => m.NeuesRezeptPageModule),
    canActivate: [AuthGuard]
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
