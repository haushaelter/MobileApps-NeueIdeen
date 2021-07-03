import { Injectable } from '@angular/core';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Autor: Anika Haushälter
 */
export class ListService {

  constructor(
    private logging: HelperService
  ) { }

  /**
   * Autor: Anika Haushälter
   * 
   * Überprüft, ob ein übergebener Wert nicht undefined oder null ist
   * @param suche //Wonach wird untersucht (Titel, Vertrag)
   * @param ergebnis //Was wurde gefunden
   * @returns Alternativen Text oder gefundenes Ergebnis
   */
  checkString(suche: string, ergebnis):string{
    if(ergebnis!=undefined || ergebnis!=null){      
      return `${ergebnis}`;
    } else {
      this.logging.logging(`Fehler: ${suche} = ${ergebnis}`)
      return `${suche} nicht gefunden`;
    }
  }

  /**
   * Autor: Anika Haushälter
   * 
   * überprüft, ob ein übergebener Wert vom Typ number ist
   * @param num //zu überprüfende Nummer
   * @returns übergebene Nummer oder 0
   */
  checkNumber(num):number{
    if(typeof num!= "number"){
      this.logging.logging(`Fehler: typeof number = ${typeof num}`)
      return 0;
    } else {
      return num;
    }
  }

  /**
   * Autor: Anika Haushälter
   * 
   * @param bewertung //Anzahl der Bewertungen, die bei dem Rezept bereits gemacht wurden
   * @returns Array der Länge 5, der Bezeichnungen für Icons enthält
   */
  checkStars(bewertung): Array<string>{
    let sterne = Array<string>();
    //Überprüfen auf Typ number
    bewertung = this.checkNumber(bewertung);

    let i=0;
    for(i; i<bewertung && i<5; ){
      if(bewertung<++i){
        sterne.push("Star-half-outline");
      } else {
        sterne.push("star")
      }
    }

    for(i; i<5; i++){
      sterne.push("star-outline");
    }

    return sterne;
  }
}
