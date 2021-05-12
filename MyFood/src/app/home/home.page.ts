import { Component, ViewChild } from '@angular/core';
import { ComponentsModule } from '../components/components.module';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private rezepte = [["1"], ["2"], ["3"]]  
  
}
