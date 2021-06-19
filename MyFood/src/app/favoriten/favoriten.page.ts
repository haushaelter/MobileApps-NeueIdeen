import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from '../components/components.module';
import { Rezept } from '../models/rezepte/rezept.model';
import { User } from '../models/user/user.model';
import { AuthService } from '../services/auth.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-favoriten',
  templateUrl: './favoriten.page.html',
  styleUrls: ['./favoriten.page.scss'],
})
export class FavoritenPage implements OnInit {
  readonly seitentitel = "Favoriten";
  private rezepte: Array<Rezept>;
  filter: Array<Rezept>;
  private liste: Array<string>;
  user: User;


  constructor(
    private firebase: FirebaseService,
    private auth: AuthService
  ) {
    this.user = firebase.getUser(localStorage.getItem('user'));
    this.getFavoriten();
  }

  /**
   * Zugreifen auf Favoriten des eingeloggten Users in der Datenbank
   */
  async getFavoriten(){
    if(this.firebase.getAlleFavoriten(this.auth.getAktuellerUser().uid)!=undefined){
      this.rezepte = await this.firebase.getAlleFavoriten(this.auth.getAktuellerUser().uid);      
    }
    
    this.liste = this.firebase.getAlleRezeptIds();
    
    this.filter = this.rezepte;
  }

  ngOnInit() {
  }

  
  /**
   * Anpassen der Liste filter, damit herausgefilterte Rezepte angezeigt werden
   * @param rezeptListe 
   */
   filterRezepte(rezeptListe: Array<Rezept>){    
     console.log(this.filter);
     
    this.filter = rezeptListe;    
  }
}
