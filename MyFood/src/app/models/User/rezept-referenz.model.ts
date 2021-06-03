import { Deserialize } from "../deserialize";
import { IndividuelleAngaben } from "./individuelle-angaben.model";

export class RezeptReferenz implements Deserialize {

    bewertung: number;
    notizen: string;

    deserialize(input: any) {
        Object.assign(this, input);

        return this;
    }

}
