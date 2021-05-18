import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from '../components/components.module';

@Component({
  selector: 'app-favoriten',
  templateUrl: './favoriten.page.html',
  styleUrls: ['./favoriten.page.scss'],
})
export class FavoritenPage implements OnInit {
  rezept1 = {
    "anzahl": 312, 
    "bewertung": 3.5, 
    "eigeneBewertung": false,
    "favorit": true,
    "bearbeitet": true
  };
  rezept2=  {
    "titel": "Titel",
    "bewertung": 4, 
    "favorit": false,
    "bearbeitet": false
  };
  rezept3= {
    "titel": "Rezept",
    "anzahl": 511, 
    "eigeneBewertung": 4,
    "favorit": true
  };
  rezept4 ={
    "titel": "Rezept 4",
    "anzahl": 622, 
    "bewertung": 5, 
    "eigeneBewertung": false,
    "bearbeitet": true
  };
  rezept5 ={
    "titel": "Rezept 5",
    "anzahl": 67, 
    "bewertung": 2, 
    "bearbeitet": true,
    "favorit": true
  };
  private rezepte=[this.rezept1, this.rezept2, this.rezept3, this.rezept4, this.rezept5];
  constructor() {}

  ngOnInit() {
  }
}
