import { Deserialize } from "../deserialize";

/**
 * Model für die Erstellung von Kochbüchern, wie sie in der Datenbank liegen und auf der Website verwendet werden sollen
 * Autor: Adrian Przybilla
 */
export class Kochbuch implements Deserialize{

    id: string;
    bewertung: {
        anzahl: number;
        bewertung: number;
    };
    verlag: string;
    rezepte: Array<string>

    deserialize(input:any){
        Object.assign(this, input);
        
        return this;
    }
}
