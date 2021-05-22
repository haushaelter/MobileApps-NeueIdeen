import { Component, Input, OnInit } from '@angular/core';
import { Logging } from '../services/helper';

@Component({
  selector: 'app-rezept',
  templateUrl: './rezept.page.html',
  styleUrls: ['./rezept.page.scss'],
})
export class RezeptPage implements OnInit {
  _titel = "Rezepttitel";
  _anzahl = 0;
  _favorit = "star-outline";
  _bewertung = 0;
  _zutaten = Array<String>();
  _schritte = Array<String>();

  @Input() 
  set rezept (rezept:JSON){
    //Define Title
    if(typeof rezept['titel'] == "string" && rezept['titel'] !=="undefined"){
      this._titel = `${rezept['titel']}`;
    } else {
      this.logging.logging("Kein Titel übergeben")
    }

    //Define Number of Likes (Problem: Überprüfen, ob keine Anzahl an Sternen übergeben wurde)
    if(typeof rezept['anzahl'] == "number"){
      this._anzahl = rezept['anzahl'];
    } else {
      this.logging.logging("Keine Anzahl an Bewertungen übergeben");
    }

    //Define Zutaten
    for(let i = 0; i<rezept['zutaten'].length; i++){
      this._zutaten.push(rezept['zutaten'][i]);
    }

    //Define Schritte
    for(let i = 0; i<rezept['schritte'].length; i++){
      this._schritte.push(rezept['schritte'][i]);
    }

  }

  constructor(
    private logging: Logging
  ) {}

  ngOnInit() {
  }

}
