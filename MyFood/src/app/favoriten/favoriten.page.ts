import { Component } from '@angular/core';
import { Rezept } from '../models/rezepte/rezept.model';
import { User } from '../models/user/user.model';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-favoriten',
  templateUrl: './favoriten.page.html',
  styleUrls: ['./favoriten.page.scss'],
})
/**
 * Autor: Anika Haushälter
 */
export class FavoritenPage {
  readonly seitentitel = "Favoriten";

  //Inhalte aus der Datenbank
  private rezepte:Array<Rezept> = new Array();
  user: User;
  private liste: Array<string>;

  //Variable, die gefilterte Liste enthält
  filter: Array<Rezept>;

  /**
   * @ignore
   * @param firebase 
   * @param auth 
   */
  constructor(
    private firebase: FirebaseService,
    private auth: AuthService
  ) {
    this.user = firebase.getUser(localStorage.getItem('user'));
    this.getFavoriten();
  }

  /**
   * Autor: Anika Haushälter
   * Zugreifen auf Favoriten des eingeloggten Users in der Datenbank
   */
  async getFavoriten(){
    if(this.firebase.getAlleFavoriten(this.auth.getAktuellerUser().uid)!=undefined){
      this.rezepte = await this.firebase.getAlleFavoriten(this.auth.getAktuellerUser().uid);      
    }
    
    this.liste = this.firebase.getAlleRezeptIds();
    
    this.filter = this.rezepte;
  }
  
  /**
   * Autor: Anika Haushälter
   * Anpassen der Liste filter, damit herausgefilterte Rezepte angezeigt werden
   * @param rezeptListe 
   */
   filterRezepte(rezeptListe: Array<Rezept>){
    this.filter = rezeptListe;    
  }
}
