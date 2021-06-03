import { Deserialize } from "../deserialize";
import { IndividuelleAngaben } from "./individuelle-angaben.model";
import { RezeptReferenz } from "./rezept-referenz.model";

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
