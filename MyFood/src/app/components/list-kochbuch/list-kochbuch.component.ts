import { Component, Input, OnInit } from '@angular/core';
import { Logging } from '../../services/helper';

@Component({
  selector: 'app-list-kochbuch',
  templateUrl: './list-kochbuch.component.html',
  styleUrls: ['./list-kochbuch.component.scss'],
})
export class ListKochbuchComponent implements OnInit {
  
  _titel = "Kein Titel gefunden";
  _verlag = "Kein Verlag";
  _bewertung = 0;
  _anzahl = 0;
  _sterne = Array<String>(5);

  @Input ()
  set buch(buch:JSON){
    //Define Title
    if(typeof buch['titel'] == "string" && buch['titel'] !=="undefined"){
      this._titel = `${buch['titel']}`;
    } else {
      this.logging.logging("Kein Titel übergeben")
    }

    //Define Verlag
    if(typeof buch['verlag'] == "string" && buch['verlag'] !=="undefined"){
      this._verlag = `${buch['verlag']}`;
    } else {
      this.logging.logging("Kein Verlag übergeben")
    }

    //Define Number of Likes (Problem: Überprüfen, ob keine Anzahl an Sternen übergeben wurde)
    if(typeof buch['anzahl'] == "number"){
      this._anzahl = buch['anzahl'];
    } else {
      this.logging.logging("Keine Anzahl an Bewertungen übergeben");
    }

    //Define Number of stars
    let i = 0; 
    //Bei 0 Bewertungen wird die Bewertung auch auf 0 gesetzt
    if(this._anzahl != 0){
      for(i; i<buch['bewertung'] && i<5; ){
        if(buch['bewertung']<++i){
          this._sterne.push("star-half-outline");
        } else {
          this._sterne.push("star");
        }
      }
    }
    for( i; i<5; i++){
      this._sterne.push("star-outline");
    }
  }
  constructor(
    private logging: Logging
  ) { }

  ngOnInit() {}

}
