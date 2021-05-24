import { Deserialize } from "../deserialize";
import { Schritt } from "./schritt.model"

export class ZutatReferenz implements Deserialize {
    Menge: number;

    deserialize(input: any) {
        Object.assign(this, input);

        return this;
    }
}
