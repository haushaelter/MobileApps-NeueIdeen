import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.page.html',
  styleUrls: ['./forget.page.scss'],
})
export class ForgetPage implements OnInit {

  email:any;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  forget () {
    if(this.email)
      this.authService.passwortVergessen(this.email);
  }

}
