import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from '../components/components.module';

@Component({
  selector: 'app-kochbuecher',
  templateUrl: './kochbuecher.page.html',
  styleUrls: ['./kochbuecher.page.scss'],
})
export class KochbuecherPage implements OnInit {
  buch1= {
    "titel": "Buch1",
    "verlag": "Verlag",
    "bewertung": 3.5,
    "anzahl": 412,
    "bild": '../../assets/icon/favicon.png'
  };
  buch2= {
    "titel": "Buch2",
    "verlag": "Verlag",
    "bewertung": 5,
    "anzahl": 62,
    "bild": '../../assets/icon/favicon.png'
  };
  buch3= {
    "titel": "Buch3",
    "verlag": "Verlag",
    "bewertung": 3,
    "anzahl": 84,
    "bild": '../../assets/icon/favicon.png'
  };
  buch4= {
    "titel": "Buch4",
    "verlag": "Verlag",
    "bewertung": 3.5,
    "anzahl": 636,
    "bild": '../../assets/icon/favicon.png'
  };

  buecher= [this.buch1, this.buch2, this.buch3, this.buch4];
  constructor() { }

  ngOnInit() {
  }

}
