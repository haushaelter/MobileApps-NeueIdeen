import { Deserialize } from "../deserialize";
import { RezeptReferenz } from "./rezept-referenz.model";

/**
 * Model für die Erstellung von individuellen Angaben, wie sie in der Datenbank liegen und auf der Website verwendet werden sollen.
 * Jede individuelle Angabe, hat als ID das Rezept auf das verwiesen wird und darin eine eigene Bewertung und Notizen für dieses Rezept.
 * Autor: Adrian Przybilla
 */
export class IndividuelleAngaben implements Deserialize {

    [name: number]: RezeptReferenz;

    deserialize(input:any){
        for (let i in input) {
            this[i] = new RezeptReferenz().deserialize(input[i]);
        }

        return this;
    }

}
