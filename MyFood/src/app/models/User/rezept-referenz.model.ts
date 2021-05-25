import { Deserialize } from "../deserialize";
import { IndividuelleAngaben } from "./individuelle-angaben.model";

export class RezeptReferenz implements Deserialize {

    [name: number]: IndividuelleAngaben;

    deserialize(input:any){
        Object.assign(this, input);
        return this;
    }

}
