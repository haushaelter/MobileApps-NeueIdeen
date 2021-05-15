import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  user: any = {};

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  register() {
    if (this.user.email && this.user.passwort) {
      if (this.user.passwort === this.user.passwortWiederholung) {
        if (this.firebaseService.registrieren(this.user.email, this.user.passwort)) {
          this.router.navigateByUrl("/home");
        }
      } else {
        console.log("Passwörter stimmen nicht überein.");
      }
    }
  }

}
