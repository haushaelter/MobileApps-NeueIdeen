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
export class KochbuchPage implements OnInit {
  private id: string = this.activatedRoute.snapshot.queryParamMap.get("id");
  buchdata: Kochbuch;
  rezeptdata: Array<Rezept>;
  user: User;

  constructor(
    private router: Router,
    private firebase: FirebaseService,
    private activatedRoute: ActivatedRoute
  ) { 
    this.buchdata = this.router.getCurrentNavigation().extras.state.buch;
    this.rezeptdata = this.firebase.getRezepte([["id"].concat(this.buchdata.rezepte)]);
    this.user = firebase.getUser(localStorage.getItem('user'));
    this.id = this.id.replace("%20", " ");
  }

  ngOnInit() {
  }

}
