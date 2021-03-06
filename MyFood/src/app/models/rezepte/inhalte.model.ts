import { Deserialize } from "../deserialize";
import { Schritt } from "./schritt.model";

/**
 * Model für die Erstellung von Inhalten in einem Rezept, wie sie in der Datenbank liegen und auf der Website verwendet werden sollen.
 * Jeder Inhalte-Eintrag, hat eine beliebige Anzahl an Schritten.
 * Autor: Adrian Przybilla
 */
export class Inhalte implements Deserialize {
    
    basis: {
        beschreibung: string;
        titel: string;
    };
    bewertung: {
        anzahl: number;
        bewertung: number;
    };
    [schritte: number]: Schritt;

    deserialize(input:any){
        for(let i in input){
            switch(i) {
                case "Basis":
                    this.basis = input[i];
                    break;
                case "Bewertung":
                    this.bewertung = input[i];
                    break;
                default:
                    this[i] = new Schritt().deserialize(input[i]);        
                    break;
            }
        }

        return this;
    }
}
