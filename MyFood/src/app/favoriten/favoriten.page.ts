import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from '../components/components.module';
import { Rezept } from '../models/rezepte/rezept.model';
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
  private rezeptListe: Array<string>

  constructor(
    private firebase: FirebaseService,
    private auth: AuthService
  ) {
    this.getFavoriten();
  }

  /**
   * Zugreifen auf Favoriten des eingeloggten Users in der Datenbank
   */
  async getFavoriten(){
    if(this.firebase.getAlleFavoriten(this.auth.getAktuellerUser().uid)!=undefined){
      this.rezepte = this.firebase.getAlleFavoriten(this.auth.getAktuellerUser().uid);
    }
    
    this.rezeptListe = this.firebase.getAlleRezeptIds();
    
  }

  ngOnInit() {
  }
}
