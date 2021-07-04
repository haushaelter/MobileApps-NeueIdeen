import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Rezept } from 'src/app/models/rezepte/rezept.model';
import { User } from 'src/app/models/user/user.model';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
/**
 * Autor: Anika Haushälter
 */
export class SearchbarComponent {
  private rezepte: Array<Rezept>
  private suchListe: Array<Rezept>;
  private filterListe: Array<Rezept>;    
  private options:Array<string>

  private filterOptions = [
    "über 100 Bewertungen",
    "mindestens 4 Sternen",
    "mit eigener Bewertung",
    "Favorit"
  ]

  test(option, options){
    console.log(typeof(option))
    console.log(options)
  }

  /**
   * Input für Liste von ids. Dadurch kann Button Zufall mit Filtern arbeiten
   */
  @Input()
  private stringListe:Array<string>;

  /**
   * Autor: Anika Haushälter
   * Input für vollständige Rezepte
   */
  @Input()
  set rezepteListe(rezepte){
    this.rezepte = rezepte;
    this.suchListe = this.rezepte;
    this.filterListe = this.rezepte;
  }

  @Input()
  private user: User;
  

  /**
   * Output für neue angepasste Liste mit vollständigen Rezepten
   */
  @Output()
  newRezeptListe = new EventEmitter<Array<Rezept>>();

  /**
   * @ignore
   * @param navCtrl 
   * @param logging 
   */
  constructor(
    private navCtrl: NavController,
    private logging: HelperService
  ) { }

  /**
   * Autor: Anika Haushälter
   * Funktion, um zufälliges Rezept auszugeben. Navigiert zum zufälligen Rezept
   * @returns {void}
   */
  private zufall(): void{    
    let liste:Array<Rezept> = new Array();
    this.suchListe.forEach(rezept => {
      if(this.filterListe.includes(rezept)){
        liste.push(rezept);
      }
    });
    
    let i = Math.round((Math.random())*liste.length)-1;
    
    if(liste[i].id==undefined){
      this.logging.logging("Fehler aufgetreten. Keine zufällige ID gefunden");
      this.zufall();
      return;
    }
    let id = liste[i].id;

    this.navCtrl.navigateForward(`/rezept?id=${id}`);
  }

  /**
   * Autor: Anika Haushälter
   * Methode zum filtern/suchen
   * @param event 
   * @returns {void}
   */
  private suche(event):void{
    //Suchterm filtern
    let suchTerm = event.srcElement.value.toLowerCase();

    //filterListe zurücksetzen, für den Fall dass rückgängig gemacht wurde
    this.suchListe = this.rezepte;

    //Überprüfen, ob ein Suchterm eingegeben wurde
    if(suchTerm.length!==0){
      // id der Elemente in filterListe überprüfen und filterListe anpassen
      this.suchListe = this.suchListe.filter(aktuellesRezept => {
        if (aktuellesRezept.id.toLowerCase() && suchTerm) {
          return (aktuellesRezept.id.toLowerCase().indexOf(suchTerm.toLowerCase()) > -1);
        }
      });
    }
    
    //neue Liste an Parent zurückgeben
    this.filterRezepte();
  }

  /**
   * Autor: Anika Haushälter
   * Anpassen der Outputvariable
   * @param liste 
   * @returns {void}
   */
  private filterRezepte(): void{
    let liste:Array<Rezept> = new Array();
    this.suchListe.forEach(rezept => {
      if(this.filterListe.includes(rezept)){
        liste.push(rezept);
      }
    });    
    this.newRezeptListe.emit(liste)
  }

  /**
   * Autor: Anika Haushälter
   * Filtern von Rezepten mit ausgewählten Kriterien
   * @param event 
   */
  private filter(event){    
    this.options = event.detail.value;
    this.logging.logging(`Filter ${this.options} gesetzt`)
    this.filterListe = this.rezepte;

    if(this.options.includes("über 100 Bewertungen")){
      this.filterListe = this.filterListe.filter(aktuellesRezept =>{
        return (aktuellesRezept.inhalte?.bewertung?.anzahl>100);
      });
    }
    if(this.options.includes("mindestens 4 Sternen")){
      this.filterListe = this.filterListe.filter(aktuellesRezept =>{
        return (aktuellesRezept.inhalte?.bewertung?.bewertung >= 4);
      });
    }
    if(this.options.includes("mit eigener Bewertung")){
      this.filterListe = this.filterListe.filter(aktuellesRezept =>{
        return (this.user?.individuelleAngaben[aktuellesRezept.id]?.bewertung ?? false);
      });
    }
    if(this.options.includes("Favorit")){
      this.filterListe = this.filterListe.filter(aktuellesRezept =>{
        return (this.user?.favoriten?.includes(aktuellesRezept.id) ?? false);
      });
    }

    this.filterRezepte()
  }

}
