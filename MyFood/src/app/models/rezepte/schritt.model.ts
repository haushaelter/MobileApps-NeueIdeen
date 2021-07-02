import { Deserialize } from "../deserialize";

/**
 * Model für die Erstellung von Rezept-Zubereitungsschritten in einem Rezept, wie sie in der Datenbank liegen und auf der Website verwendet werden sollen.
 * Jeder Inhalte-Eintrag hat eine beliebe Anzahl von Schritten.
 * Autor: Adrian Przybilla
 */
export class Schritt implements Deserialize {

    beschreibung: string;
    zutaten: Array<string>;

    deserialize(input: any) {
        Object.assign(this, input);
        
        return this;
    }
}
