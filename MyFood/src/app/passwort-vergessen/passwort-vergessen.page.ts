import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-passwort-vergessen',
  templateUrl: './passwort-vergessen.page.html',
  styleUrls: ['./passwort-vergessen.page.scss'],
})
export class PasswortVergessenPage implements OnInit {

  email:any;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  passwortVergessen () {
    if(this.email)
      this.authService.passwortVergessen(this.email);
  }

}
