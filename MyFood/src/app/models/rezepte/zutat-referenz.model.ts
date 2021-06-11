import { Deserialize } from "../deserialize";
import { Schritt } from "./schritt.model"

export class ZutatReferenz implements Deserialize {
    menge: number;
    id: string;

    deserialize(input: any) {
        Object.assign(this, input);

        return this;
    }
}
