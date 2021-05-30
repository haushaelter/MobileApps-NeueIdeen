import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-registrierung',
  templateUrl: './registrierung.page.html',
  styleUrls: ['./registrierung.page.scss'],
})
export class RegistrierungPage implements OnInit {
  readonly seitentitel = "Registrierung";

  user: any = {};

  constructor(
    private authService: AuthService,
    private logging: HelperService
  ) { }

  ngOnInit() {
    document.getElementById("footer").style.display = "none";
  }

  registrieren() {
    if (this.user.email && this.user.passwort) {
      if (this.user.passwort === this.user.passwortWiederholung) {
        this.authService.registrieren(this.user.email, this.user.passwort);
      } else {
        this.logging.zeigeToast("Passwörter stimmen nicht überein");
      }
    } else if(this.user.email){
      this.logging.zeigeToast("Bitte Passwort eingeben");
    } else {
      this.logging.zeigeToast("Bitte E-Mail eingeben");
    }
  }

}
