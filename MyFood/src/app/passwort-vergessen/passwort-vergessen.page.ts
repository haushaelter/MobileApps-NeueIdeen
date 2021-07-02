import { Component, OnInit } from '@angular/core';
import { AesService } from '../services/aes.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-passwort-vergessen',
  templateUrl: './passwort-vergessen.page.html',
  styleUrls: ['./passwort-vergessen.page.scss'],
})
export class PasswortVergessenPage implements OnInit {

  user: any = {};

  constructor(
    private authService: AuthService,
    private aes: AesService
  ) { }

  ngOnInit() {
  }

  /**
   * Methode zum Anfragen eines neuen Passwort. Aktuell nicht mehr implementiert, auf Grund von Problemen mit der Verschlüsselung der Passwörter
   * Autor: Adrian Przybilla
   */
  passwortVergessen () {
    
  }

}
