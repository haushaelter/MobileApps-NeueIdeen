import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-kochbuch',
  templateUrl: './kochbuch.page.html',
  styleUrls: ['./kochbuch.page.scss'],
})
export class KochbuchPage implements OnInit {
  seitentitel = "Mein Kochbuch";
  rezept1 = {
    "anzahl": 312, 
    "bewertung": 3.5, 
    "favorit": true
  };
  rezept2=  {
    "titel": "Titel",
    "bewertung": 4, 
    "favorit": false
  };
  rezept3= {
    "titel": "Rezept",
    "anzahl": 511, 
    "favorit": true
  };
  rezept4 ={
    "titel": "Rezept 4",
    "anzahl": 622, 
    "bewertung": 5, 
  };
  rezepte = [this.rezept1, this.rezept2, this.rezept3, this.rezept4];

  constructor() { }

  ngOnInit() {
  }

}
