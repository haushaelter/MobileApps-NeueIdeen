import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user:any = {};
  temp:any = [];

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login(){
    if(this.user.email && this.user.passwort) {
      if(this.firebaseService.login(this.user.email, this.user.passwort)) {
        this.router.navigateByUrl("/home");
      }
    }
  }

}
