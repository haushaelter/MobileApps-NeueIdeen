import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Kochbuch } from '../models/kochbuecher/kochbuch';
import { Rezept } from '../models/rezepte/rezept.model';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-kochbuch',
  templateUrl: './kochbuch.page.html',
  styleUrls: ['./kochbuch.page.scss'],
})
export class KochbuchPage implements OnInit {
  seitentitel = "Mein Kochbuch";
  buchdata: Kochbuch;
  rezeptdata: Array<Rezept>;

  constructor(
    private router: Router,
    private firebase: FirebaseService
  ) { 
    this.buchdata = this.router.getCurrentNavigation().extras.state.buch;
    this.rezeptdata = this.firebase.getRezepte(this.buchdata.rezepte);   
  }

  ngOnInit() {
  }

}
