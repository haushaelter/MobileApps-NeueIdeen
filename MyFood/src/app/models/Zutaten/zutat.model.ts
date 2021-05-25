import { Deserialize } from "../deserialize";

export class Zutat implements Deserialize {

    id: string;
    standardeinheit: string;
    kalorien: number;
    eiweiß: number;
    fett: number;
    kohlenhydrate: number;    

    deserialize(input:any){
        Object.assign(this, input);
        
        return this;
    }

}
