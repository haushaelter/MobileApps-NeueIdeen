import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user:any = {};
  
  constructor(
    private authService: AuthService,
    private logging: HelperService
  ) { }

  ngOnInit() {
  }

  login(){
    if(this.user.email && this.user.passwort) {
      this.authService.login(this.user.email, this.user.passwort);
    } else if(this.user.email){
      this.logging.zeigeToast("Bitte Passwort eingeben");
    } else {
      this.logging.zeigeToast("Bitte E-Mail eingeben");
    }
  }

}
