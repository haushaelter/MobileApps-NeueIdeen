import { Kochbuch } from "../../src/app/models/kochbuecher/kochbuch";

let kochbuch1 = new Kochbuch().deserialize({
    id: "Nur fuer echte Kerle",
    bewertung: {
        anzahl: 3,
        bewertung: 5
    },
    verlag: "Naumann & Goebel Verlagsgesellschaft mbH",
    rezepte: [
        "Fleischkäse mit Spiegelei",
    ],
});
let kochbuch2;

export let kochbuecher: Array<Kochbuch> = new Array<Kochbuch>(
    kochbuch1,
    kochbuch2
)