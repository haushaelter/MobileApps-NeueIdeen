import { Deserialize } from "../deserialize";

export class IndividuelleAngaben implements Deserialize {

    bewertung: number;
    notizen: string;

    deserialize(input:any){
        Object.assign(this, input);
        return this;
    }

}
