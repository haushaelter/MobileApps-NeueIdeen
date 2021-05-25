import { Deserialize } from "../deserialize";
import { IndividuelleAngaben } from "./individuelle-angaben.model";
import { RezeptReferenz } from "./rezept-referenz.model";

export class User implements Deserialize {

    id: string;
    eigeneRezepte: Array<string>;
    favoriten: Array<string>;
    individuelleAngaben: {
        [rezeptId: string]: IndividuelleAngaben;
    };
    

    deserialize(input: any) {
        Object.assign(this, input);

        for(let i in input.rezeptId){
            console.log(i);
        }

        return this;
    }
}
