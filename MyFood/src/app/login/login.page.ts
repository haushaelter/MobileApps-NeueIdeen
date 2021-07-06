import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AesService } from '../services/aes.service';
import { AuthService } from '../services/auth.service';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
/**
 * Autor: Anika Haushälter und Adrian Przybilla
 */
export class LoginPage implements OnInit {
  readonly seitentitel = "Login";

  user:any = {};
  
  /**
   * @ignore
   * @param authService 
   * @param logging 
   * @param navCtrl 
   * @param aes 
   */
  constructor(
    private authService: AuthService,
    private logging: HelperService,
    private navCtrl: NavController,
    private aes: AesService
  ) {}

  /**
   * Autor: Anika Haushälter
   * 
   * Aufruf beim Betreten der Seite
   */
  ngOnInit() {
    // Navigation nicht anzeigen
    document.getElementById("footer").style.display = "none";
  }

  /**
   * Autor: Anika Haushälter
   * 
   * Aufruf beim Verlassen der Seite
   */
  ngOnDestroy(){
    
    this.user.email = "";
    this.user.passwort = "";
  }

  /**
   * Autor: Adrian Przybilla
   * 
   * Prüft alle Input-Felder und führt Login durch oder gibt eine passende Fehlermeldung als Toast aus
   */
  private login(){
    if(this.user.email && this.user.passwort) {
      this.authService.login(this.user.email, this.aes.encrypt(this.user.passwort));
    } else if(this.user.email){
      this.logging.zeigeToast("Bitte Passwort eingeben");
    } else {
      this.logging.zeigeToast("Bitte E-Mail eingeben");
    }
  }

  /**
   * Autor: Adrian Przybilla
   * 
   * Navigiert zur Seite Passwort vergessen
   */
  private passwortVergessen(){
    this.navCtrl.navigateForward('/passwort-vergessen');
  }

}
