import { Deserialize } from "../deserialize";
import { RezeptReferenz } from "./rezept-referenz.model";

export class IndividuelleAngaben implements Deserialize {

    [name: number]: RezeptReferenz;

    deserialize(input:any){
        for (let i in input) {
            this[i] = new RezeptReferenz().deserialize(input[i]);
        }

        return this;
    }

}
