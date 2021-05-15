import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user:any = {};
  
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  login(){
    if(this.user.email && this.user.passwort) {
      this.authService.login(this.user.email, this.user.passwort);
    }
  }

}
