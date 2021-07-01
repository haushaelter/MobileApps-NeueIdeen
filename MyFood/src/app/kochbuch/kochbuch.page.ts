import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Kochbuch } from '../models/kochbuecher/kochbuch';
import { Rezept } from '../models/rezepte/rezept.model';
import { User } from '../models/user/user.model';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-kochbuch',
  templateUrl: './kochbuch.page.html',
  styleUrls: ['./kochbuch.page.scss'],
})
/**
 * Autor: Anika Haushälter
 */
export class KochbuchPage {
  //Variablen zum Kochbuch
  private id: string = this.activatedRoute.snapshot.queryParamMap.get("id");
  buchdata: Kochbuch;

  //Variablen zu den Rezepten im Kochbuch
  rezepte:Array<Rezept> = new Array();
  liste: Array<string>;

  //User aus der Datenbank
  user: User;

  //Variable, die gefilterte Liste enthält
  filter: Array<Rezept>;

  /**
   * @ignore
   * @param router 
   * @param firebase 
   * @param activatedRoute 
   */
  constructor(
    private router: Router,
    private firebase: FirebaseService,
    private activatedRoute: ActivatedRoute
  ) { 
    this.buchdata = this.router.getCurrentNavigation().extras.state.buch;
    this.rezepte = this.firebase.getRezepte([["id"].concat(this.buchdata.rezepte)]);
    this.user = firebase.getUser(localStorage.getItem('user'));
    this.id = this.id.replace("%20", " ");
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
