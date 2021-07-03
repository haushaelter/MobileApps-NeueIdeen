import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
/**
 * Autor: Adrian Przybilla
 */
export class HeaderComponent{

  @Input() 
  private titel:string;

  /**
   * @ignore
   * @param auth {AuthService}
   */
  constructor(
    private auth: AuthService
  ) { }

  /**
   * Autor: Adrian Przybilla
   * Loggt den User aus
   * @returns {void}
   */
  private logout():void {
    this.auth.logout();
  }
}
