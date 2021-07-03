import { Component } from '@angular/core';
import { AesService } from '../services/aes.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-passwort-vergessen',
  templateUrl: './passwort-vergessen.page.html',
  styleUrls: ['./passwort-vergessen.page.scss'],
})
/**
 * Autor: Adrian Przybilla
 */
export class PasswortVergessenPage{

  user: any = {};

  constructor(
    private authService: AuthService,
    private aes: AesService
  ) { }

  /**
   * Autor: Adrian Przybilla
   * 
   * Methode zum Anfragen eines neuen Passwort. Aktuell nicht mehr implementiert, auf Grund von Problemen mit der Verschlüsselung der Passwörter
   */
  private passwortVergessen () {
    
  }

}
