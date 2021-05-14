import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  user: any = {};

  constructor(
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
  }

  register() {
    if (this.user.email && this.user.passwort) {
      if (this.user.passwort === this.user.passwortWiederholung) {
        this.firebaseService.registrieren(this.user.email, this.user.passwort);
      } else {
        console.log("Passwörter stimmen nicht überein.");
      }
    }
  }

}
