import { User } from "../../src/app/models/user/user.model";
import { RezeptReferenz } from "../../src/app/models/user/rezept-referenz.model";
import { IndividuelleAngaben } from "../../src/app/models/user/individuelle-angaben.model";

let user1 = new User().deserialize({
    id: "Olf7J48ZKgWCCjW3wfICFSFkerh1",
    eigeneRezepte: [
        "Hartgekochtes Ei",
    ],
    favoriten: [
        "Fleischkäse mit Spiegelei"
    ],
    individuelleAngaben: new IndividuelleAngaben().deserialize({
        "Fleischkäse mit Spiegelei": new RezeptReferenz().deserialize({
            bewertung: 5,
            notizen: "Dat schmeggt."
        }),
    }),
});
let user2;
let user3;
let user4;
let user5;
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
    user5,
    user6,
    user7,
    user8,
    user9,
    user10
)