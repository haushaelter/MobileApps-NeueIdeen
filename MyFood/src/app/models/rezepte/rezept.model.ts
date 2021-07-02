import { Deserialize } from "../deserialize";
import { Inhalte } from "./inhalte.model";
import { ZutatReferenz } from "./zutat-referenz.model";

/**
 * Model für die Erstellung von einem Rezept, wie es in der Datenbank liegen und auf der Website verwendet werden soll.
 * Autor: Adrian Przybilla
 */
export class Rezept implements Deserialize {
    
    id: string;
    ersteller: string;
    inhalte: Inhalte;
    zutaten: {
        [key: string]: ZutatReferenz
    };

    deserialize(input: any) {
        Object.assign(this, input);
        this.inhalte = new Inhalte().deserialize(input.inhalte);
        
        for(let i in input.zutaten){
            this.zutaten[i] = new ZutatReferenz().deserialize(input.zutaten[i]);
        }
        
        return this;
    }
}
