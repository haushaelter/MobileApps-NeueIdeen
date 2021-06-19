import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Rezept } from 'src/app/models/rezepte/rezept.model';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent implements OnInit {
  private liste:Array<string>;
  private rezepte: Array<Rezept>
  private filterListe: Array<Rezept>;

  /**
   * Input für Liste von ids. Dadurch kann Button Zufall mit Filtern arbeiten
   */
  @Input()
  set stringListe(rezeptListe){
    this.liste = rezeptListe;
  }

  /**
   * Input für vollständige Rezepte
   */
  @Input()
  set rezepteListe(rezepte){
    this.rezepte = rezepte
  }

  //Output für neue angepasste Liste mit vollständigen Rezepten
  @Output()
  newRezeptListe = new EventEmitter<Array<Rezept>>();

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
    let i = Math.round((Math.random())*this.liste.length);
    
    let id = this.liste[i];
    if(id==undefined){
      this.logging.logging("Fehler aufgetreten. Keine zufällige ID gefunden");
      this.zufall();
      return;
    }

    this.navCtrl.navigateForward(`/rezept?id=${id}`);
  }

  /**
   * Methode zum filtern/suchen
   * @param event 
   */
  suche(event){
    //Suchterm filtern
    let suchTerm = event.srcElement.value.toLowerCase();

    //filterListe zurücksetzen, für den Fall dass rückgängig gemacht wurde
    this.filterListe = this.rezepte;

    //Überprüfen, ob ein Suchterm eingegeben wurde
    if(suchTerm.length!==0){
      // id der Elemente in filterListe überprüfen und filterListe anpassen
      this.filterListe = this.filterListe.filter(aktuellesRezept => {
        if (aktuellesRezept.id.toLowerCase() && suchTerm) {
          return (aktuellesRezept.id.toLowerCase().indexOf(suchTerm.toLowerCase()) > -1);
        }
      });
    }
    
    //neue Liste an Parent zurückgeben
    this.filterRezepte(this.filterListe);
  }

  /**
   * Anpassen der Outputvariable
   * @param liste 
   */
  filterRezepte(liste: Array<Rezept>){
    this.newRezeptListe.emit(liste)
  }

}
