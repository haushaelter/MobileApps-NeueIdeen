import { Deserialize } from "../deserialize";
import { IndividuelleAngaben } from "./individuelle-angaben.model";

/**
 * Model für die Erstellung von Zutaten in einem User in der Firestore-Datenbank, wie sie in der Datenbank liegen und auf der Website verwendet werden sollen.
 * Autor: Adrian Przybilla
 */
export class User implements Deserialize {

    id: string;
    eigeneRezepte: Array<string>;
    favoriten: Array<string>;
    individuelleAngaben: IndividuelleAngaben;    

    deserialize(input: any) {
        Object.assign(this, input);

        this.individuelleAngaben = new IndividuelleAngaben().deserialize(this.individuelleAngaben);

        return this;
    }
}
