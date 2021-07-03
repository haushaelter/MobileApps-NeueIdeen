import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Autor: Anika Haushälter
 */
export class AuthGuard implements CanActivate {

  constructor(
    private auth : AuthService,
    private router: Router
  ) {}

  /**
   * Autor: Anika Haushälter
   * 
   * Wenn auf eine nicht-freigegebene Route zugegriffen wird, wird auf die Route Login zurück navigiert
   * @param route 
   * @param state 
   * @returns {boolean} Wenn User eingeloggt ist, wird true zurückgegeben, andernfalls false
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{
      if(this.auth.isLoggedIn()){
        return true;
      } 
      this.router.navigate(['login']);
      return false;
  }
  
}
