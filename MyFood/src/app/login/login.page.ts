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
export class LoginPage implements OnInit {
  readonly seitentitel = "Login";

  user:any = {};
  
  constructor(
    private authService: AuthService,
    private logging: HelperService,
    private navCtrl: NavController,
    private aes: AesService
  ) {}

  ngOnInit() {
    document.getElementById("footer").style.display = "none";
  }

  /**
   * Prüft alle Input-Felder und führt Login durch oder gibt eine passende Fehlermeldung als Toast aus
   * Autor: Adrian Przybilla
   */
  login(){
    if(this.user.email && this.user.passwort) {
      this.authService.login(this.user.email, this.aes.encrypt(this.user.passwort));
    } else if(this.user.email){
      this.logging.zeigeToast("Bitte Passwort eingeben");
    } else {
      this.logging.zeigeToast("Bitte E-Mail eingeben");
    }
  }

  passwortVergessen(){
    this.navCtrl.navigateForward('/passwort-vergessen');
  }

}
