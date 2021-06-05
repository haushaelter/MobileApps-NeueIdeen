import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent implements OnInit {
  private rezepteListe:Array<string>;

  @Input()
  /**
   * Input für Rezeptliste. Dadurch kann Button Zufall mit Filtern arbeiten
   */
  set rezeptListe(rezeptListe){
    this.rezepteListe = rezeptListe;
  }

  constructor(
    private navCtrl: NavController,
    private logging: HelperService
  ) { }

  ngOnInit() {}

  /**
   * Funktion, um zufälliges Rezept auszugeben. Navigiert zum zufälligen Rezept
   * @returns 
   */
  zufall(): void{    
    let i = Math.round((Math.random())*this.rezepteListe.length);
    
    let id = this.rezepteListe[i];
    if(id==undefined){
      this.logging.logging("Fehler aufgetreten. Keine zufällige ID gefunden");
      this.zufall();
      return;
    }

    this.navCtrl.navigateForward(`/rezept?id=${id}`);
  }

}
