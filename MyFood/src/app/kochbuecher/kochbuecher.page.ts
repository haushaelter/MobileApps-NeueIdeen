import { Component, OnInit } from '@angular/core';
import { ComponentsModule } from '../components/components.module';
import { Kochbuch } from '../models/kochbuecher/kochbuch';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-kochbuecher',
  templateUrl: './kochbuecher.page.html',
  styleUrls: ['./kochbuecher.page.scss'],
})
/**
 * AUtor: Anika Haushälter
 */
export class KochbuecherPage implements OnInit {
  readonly seitentitel = "Kochbücher";
  private kochbuecher:Array<Kochbuch>;
  
  /**
   * @ignore
   * @param firebase 
   */
  constructor(
    private firebase: FirebaseService
  ) { 
    this.kochbuecher = this.firebase.getAlleKochbuecher();
  }

  ngOnInit() {
  }

}
