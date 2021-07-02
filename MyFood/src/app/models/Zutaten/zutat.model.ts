import { Deserialize } from "../deserialize";

/**
 * Model für die Erstellung von Zutaten, wie sie in der Datenbank liegen und auf der Website verwendet werden sollen.
 * Autor: Adrian Przybilla
 */
export class Zutat implements Deserialize {

    id: string;
    standardeinheit: string;
    kalorien: number;
    eiweiß: number;
    fett: number;
    kohlenhydrate: number;    

    deserialize(input:any){
        Object.assign(this, input);
        
        return this;
    }

}
