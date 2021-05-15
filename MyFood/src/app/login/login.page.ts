import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user:any = {};

  constructor(
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
  }

  login(){
    if(this.user.email && this.user.passwort) {
      this.firebaseService.login(this.user.email, this.user.passwort);
    }
  }

}
