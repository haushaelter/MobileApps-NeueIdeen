import { Component, ViewChild } from '@angular/core';
import { Rezept } from '../models/rezepte/rezept.model';
import { User } from '../models/user/user.model';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  readonly seitentitel = "Suche";
  rezepte:Array<Rezept> = new Array();
  liste: Array<string>;
  user: User;

  constructor(
    private firebase: FirebaseService
  ) { 
    //Anzeigen von footer
    document.getElementById("footer").style.display = "block";
    //Aufrufen aller Rezepte
    this.rezepte = firebase.getAlleRezepte();
    this.user = firebase.getUser(localStorage.getItem('user'));
    this.liste = firebase.getAlleRezeptIds();
    
  }
}
