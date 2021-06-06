import { User } from "../../src/app/models/user/user.model";
import { RezeptReferenz } from "../../src/app/models/user/rezept-referenz.model";
import { IndividuelleAngaben } from "../../src/app/models/user/individuelle-angaben.model";

let user1 = new User().deserialize({
    id: "Olf7J48ZKgWCCjW3wfICFSFkerh1",
    eigeneRezepte: [
        "Paprika-Tomaten-Gemüse",
    ],
    favoriten: [
        "Fleischkäse mit Spiegelei",
        "Paprika-Tomaten-Gemüse"
    ],
    individuelleAngaben: new IndividuelleAngaben().deserialize({
        "Fleischkäse mit Spiegelei": new RezeptReferenz().deserialize({
            bewertung: 5,
            notizen: "Dat schmeggt."
        }),
    }),
});
let user2 = new User().deserialize({
    id: "A2kmzPY8PWRT3doEiGPJAEC3RAb2",
    eigeneRezepte: [
        "Hamburger",
    ],
    favoriten: [
        "Hamburger"
    ],
    individuelleAngaben: new IndividuelleAngaben().deserialize({
        "Fleischkäse mit Spiegelei": new RezeptReferenz().deserialize({
            bewertung: 4,
            notizen: "Lass das Ei weg."
        }),
    }),
});
let user3= new User().deserialize({
    id: "pU6N8NOXtUh0xN6seZLVA1GYAbo1",
    eigeneRezepte: [
        "Kartoffelpuffer",
    ],
    favoriten: [
        "Hähnchentopf mit Kartoffeln"
    ],
    individuelleAngaben: new IndividuelleAngaben().deserialize({
        "Kartoffelpuffer": new RezeptReferenz().deserialize({
            bewertung: 3,
            notizen: "Voll geil mit Apfelmus"
        }),
    }),
});
let user4= new User().deserialize({
    id: "rcGbXdItVsR8xSeMfdGWB6oaI3E2",
    eigeneRezepte: [
        "Chicken Wings mit Käsedip"
    ],
    favoriten: [
    ],
    individuelleAngaben: new IndividuelleAngaben().deserialize({
        "Fleischkäse mit Spiegelei": new RezeptReferenz().deserialize({
            bewertung: 2,
            notizen: "Fleischkäse 2 Minuten länger drinnen lassen"
        }),
    }),
});
let user5= new User().deserialize({
    id: "vdDZ82xogDbQfDaqoVkVGoGy8Ju2",
    eigeneRezepte: [
        "Hähnchentopf mit Kartoffeln",
    ],
    favoriten: [
        "Fleischkäse mit Spiegelei"
    ],
    individuelleAngaben: new IndividuelleAngaben().deserialize({
        "Hähnchentopf mit Kartoffeln": new RezeptReferenz().deserialize({
            bewertung: 5,
            notizen: "Lecker!"
        }),
    }),
});
let user6;
let user7;
let user8;
let user9;
let user10;

export let user: Array<User> = new Array<User>(
    user1,
    user2,
    user3,
    user4,
    user5
)