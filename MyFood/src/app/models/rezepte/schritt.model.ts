import { Deserialize } from "../deserialize";

export class Schritt implements Deserialize {

    beschreibung: string;
    zutaten: Array<string>;

    deserialize(input: any) {
        Object.assign(this, input);
        
        return this;
    }
}
