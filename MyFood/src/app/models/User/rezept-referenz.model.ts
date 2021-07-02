import { Deserialize } from "../deserialize";

/**
 * Model für die Erstellung von Referenzen auf Rezepte, wie sie in der Datenbank liegen und auf der Website verwendet werden sollen.
 * Autor: Adrian Przybilla
 */
export class RezeptReferenz implements Deserialize {

    bewertung: number;
    notizen: string;

    deserialize(input: any) {
        Object.assign(this, input);

        return this;
    }

}
