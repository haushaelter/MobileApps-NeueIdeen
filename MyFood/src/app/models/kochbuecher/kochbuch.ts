import { Deserialize } from "../deserialize";

export class Kochbuch implements Deserialize{

    id: string;
    bewertung: {
        anzahl: number;
        bewertung: number;
    };
    rezepte: Array<string>

    deserialize(input:any){
        Object.assign(this, input);
        
        return this;
    }
}
