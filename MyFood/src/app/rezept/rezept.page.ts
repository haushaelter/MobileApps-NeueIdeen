import { Component, Input } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Inhalte } from '../models/rezepte/inhalte.model';
import { Rezept } from '../models/rezepte/rezept.model';
import { Schritt } from '../models/rezepte/schritt.model';
import { ZutatReferenz } from '../models/rezepte/zutat-referenz.model';
import { IndividuelleAngaben } from '../models/user/individuelle-angaben.model';
import { RezeptReferenz } from '../models/user/rezept-referenz.model';
import { User } from '../models/user/user.model';
import { FileStorageService } from '../services/file-storage.service';
import { FirebaseService } from '../services/firebase.service';
import { HelperService } from '../services/helper.service';
import { ListService } from '../services/list.service';

@Component({
  selector: 'app-rezept',
  templateUrl: './rezept.page.html',
  styleUrls: ['./rezept.page.scss'],
})
/**
 * Autor: Anika Haushälter und Adrian Przybilla
 */
export class RezeptPage {
  // User
  readonly aktuelleUserId = localStorage.getItem('user');
  private aktuellerUser: User;

  // Rezeptdaten
  private id: string = this.activatedRoute.snapshot.queryParamMap.get("id");
  private data: Rezept;

  // Variablen für Darstellung
  private bewertungText: string;
  // Sternicon
  private sterne: Array<string>;
  private _fav: string = "star-outline";

  // Bild
  private bild: Observable<string | null>;

  // Zutaten
  private zutatenEinheit = [];
  private zutatenObj;

  @Input()
  set rezept(rezept: Rezept) {
    this.data = rezept;
  }

  @Input()
  set user(user: User) {
    console.log(user)
    // notizen = user.individuelleAngaben
  }

  /**
   * Autor: Anika Haushälter & Adrian Przybilla
   * 
   * Constructor
   * 
   * Es wird die ID der URL geholt und Datenbankabfragen getätigt
   * 
   * @param activatedRoute {ActivatedRoute} Dependency Injection
   * @param router {Router} Dependency Injection
   * @param firebase {FirebaseService} Dependency Injection
   * @param listService {ListService} Dependency Injection
   * @param filestorage {FileStorageService} Dependency Injection
   * @param navCtrl {NavController} Dependency Injection
   * @param logging {HelperService} Dependency Injection
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private firebase: FirebaseService,
    private listService: ListService,
    private filestorage: FileStorageService,
    private navCtrl: NavController,
    private logging: HelperService
  ) {
    //Überprüft, ob ein Rezept übergeben wurde
    let paramUebergeben: boolean = false;
    this.activatedRoute.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.rezept;
        paramUebergeben = true;
      }
    });

    if(this.id!=undefined && !paramUebergeben){
      this.id = this.id.replace("%20", " ");
      this.data = firebase.getRezept(this.id);
    }    
    this.aktuellerUser = firebase.getUser(this.aktuelleUserId);
    this.bild = this.filestorage.getRezeptFile(this.id);
    this.zutatenObj = this.firebase.getAlleZutatenAlsObject();
  }

  /**
   * Autor: Adrian Przybilla
   * 
   * Gibt zurück ob das Favoriten-Icon ausgefüllt oder leer sein soll
   * @returns name für ion-icon
   */
  private favStar() {
    return this.aktuellerUser.favoriten.includes(this.data.id) ? "star" : "star-outline";
  }

  /**
   * Autor: Anika Haushälter & Adrian Przybilla
   * 
   * Methode setzt Werte für die Anzeige der Bewertung, anhand daran, ob eine individuelle Bewertung vorhanden ist
   */
  private bewertung() {
    let temp: number;
    let tempAnzahl: number;

    if (this.aktuellerUser?.individuelleAngaben[this.data.id]) {
      this.bewertungText = "eigene Bewertung";

      temp = this.listService.checkNumber(this.aktuellerUser?.individuelleAngaben[this.data.id].bewertung);
      this.sterne = this.listService.checkStars(temp);
    } else {
      tempAnzahl = this.data?.inhalte?.bewertung?.anzahl ? this.data.inhalte.bewertung.anzahl : 0;
      this.bewertungText = `${tempAnzahl} ${tempAnzahl <= 1 ? "Bewertung" : "Bewertungen"}`;

      temp = this.listService.checkNumber(this.data.inhalte.bewertung.bewertung);
      this.sterne = this.listService.checkStars(this.data.inhalte.bewertung.bewertung);
    }
  }

  /**
   * Autor: Anika Haushälter & Adrian Przybilla
   * 
   * Setzt eine Bewertung mit der Übergebenen id+1, dem aktuellen User und dem Rezept
   * @param id {number} id des Sterns
   */
  private async bewerten(id: number) {
    await this.firebase.setBewertung((id + 1), this.aktuellerUser, this.data.id)
    this.aktuellerUser = this.firebase.getUser(this.aktuelleUserId);
  }

  /**
   * Autor: Adrian Przybilla
   * 
   * 
   * @param zutaten 
   * @returns 
   */
  private zutatenString(zutaten) {
    console.log(this.data.inhalte);
    let returnString: string = "";
    for (let i = 0; i < zutaten.length; i++) {
      returnString = returnString + zutaten[i];
      if (zutaten[i + 1] != undefined) {
        returnString = returnString + ", ";
      }
    }
    return returnString;
  }

  /**
   * Autor: Anika Haushälter
   * 
   * Löscht nach einer Sicherheitsabfrage das Rezept. Der Button ist normalerweise nur für den Ersteller sichtbar, dennoch wird der Ersteller nochmals geprüft
   */
  private rezeptLoeschen() {
    if (this.data.ersteller != this.aktuelleUserId) {
      this.logging.zeigeToast("Nur der Ersteller des Rezeptes kann löschen");
    } else {
      let okButton = {
        text: "Löschen",
        handler: () => {
          this.firebase.deleteRezept(this.data.id);
          this.navCtrl.navigateForward(`/home`);
          this.logging.zeigeToast(`Rezept ${this.data.id} wurde gelöscht`);
        }
      }

      let abbrechenButton = {
        text: "Abbrechen",
        role: "Cancel",
        handler: () => {
          this.logging.zeigeToast("Vorgang abgebrochen");
        }
      }

      this.logging.zeigeDialog(
        "Löschen",
        `Willst du wirklich das Rezept ${this.data.id} löschen? Gelöschte Rezepte können nicht wieder hergestellt werden!`,
        [okButton, abbrechenButton]
      );
    }
  }

  /**
   * Autor: Adrian Przybilla
   * 
   * Favorisieren von Rezept. Verwendet Rezept und eingeloggten User
   * @returns void
   */
  private setFavorit(e): void {
    let fav = e.target.name;
    if (this.data.id == undefined || this.aktuelleUserId == undefined) {
      this.logging.zeigeToast("Es ist ein Fehler beim Favorisieren aufgetreten.");
      this.logging.logging(`Rezeptid = ${this.data.id} und Userid = ${this.aktuelleUserId}`);
      return;
    }
    if (this._fav == "star-outline") {
      this.firebase.setFavorit(this.data.id, this.aktuelleUserId);
      this._fav = "star";
      this.logging.logging(`Favorit ${this.data.id} bei User ${this.aktuelleUserId} gesetzt`);
    } else {
      this.firebase.removeFavorit(this.data.id, this.aktuelleUserId);
      this._fav = "star-outline";
      this.logging.logging(`Favorit ${this.data.id} bei User ${this.aktuelleUserId} entfernt`);
    }
  }

  favorit() {
    this._fav = this.aktuellerUser.favoriten.includes(this.data.id) ? 'star' : 'star-outline'
  }

  /**
   * Autor: Anika Haushälter
   * 
   * Speichert die Notizen, die der User eingegeben hat
   * @param event 
   */
  private notizenSpeichern(event) {
    this.firebase.setNotiz(this.data.id, this.aktuelleUserId, event.detail.srcElement.defaultValue);
  }

  /**
   * Autor: Anika Haushälter
   * 
   * Ruft die Seite "neues-rezept" auf und übergibt das aktuelle Rezept, damit es überarbeitet werden kann
   */
  private rezeptBearbeiten(): void {
    let navigationExtras: NavigationExtras = {
      state: {
        rezept: this.data
      }
    };
    this.router.navigate(['neues-rezept'], navigationExtras);
  }
}
