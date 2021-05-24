import { Deserialize } from "../deserialize";
import { Schritt } from "./schritt.model";

export class Inhalte implements Deserialize {
    
    basis: {
        beschreibung: string;
        titel: string;
    };
    bewertung: {
        anzahl: number;
        bewrtung: number;
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
