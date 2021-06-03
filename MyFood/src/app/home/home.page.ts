import { Component, ViewChild } from '@angular/core';
import { Rezept } from '../models/rezepte/rezept.model';
import { FirebaseService } from '../services/firebase.service';
import { HelperService } from '../services/helper.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  readonly seitentitel = "Suche";
  rezepte:Array<Rezept>;

  constructor(
    private logging: HelperService,
    private firebase: FirebaseService
  ) { 
    //Anzeigen von footer
    document.getElementById("footer").style.display = "block";
    //Aufrufen aller Rezepte
    this.rezepte = firebase.getAlleRezepte();
  }
}
