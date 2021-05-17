import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Logging } from '../services/helper';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  user: any = {};

  constructor(
    private authService: AuthService,
    private logging: Logging
  ) { }

  ngOnInit() {
  }

  register() {
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
