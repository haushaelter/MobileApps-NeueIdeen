import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.page.html',
  styleUrls: ['./forget.page.scss'],
})
export class ForgetPage implements OnInit {

  email:any;

  constructor(
    private firebaseService: FirebaseService
  ) { }

  ngOnInit() {
  }

  forget () {
    if(this.email)
      this.firebaseService.passwortVergessen(this.email);
  }

}
