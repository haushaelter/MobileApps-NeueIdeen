import { Deserialize } from "../deserialize";

/**
 * Model für die Erstellung von Zutaten in einem Rezept, wie sie in der Datenbank liegen und auf der Website verwendet werden sollen.
 * Jedes Rezept kann beliebig viele Einträge dieses Models beinhalten.
 * Autor: Adrian Przybilla
 */
export class ZutatReferenz implements Deserialize {
    menge: number;
    einheit: string;
    id: string;

    deserialize(input: any) {
        Object.assign(this, input);

        return this;
    }
}
