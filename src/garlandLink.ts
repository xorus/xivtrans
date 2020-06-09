import {Result} from "./types";

export function garlandLink(item: Result): string {
    const base ="https://garlandtools.org/db/#";

    const replaceMatching = [
        "item",
        "quest",
        "achievement",
        "action",
        "status",
        "fate",
        "leve",
        ["ENpcResident", "npc"]
    ];
    for (let matching of replaceMatching) {
        if (Array.isArray(matching)) {
            if (item.Url.toLowerCase().indexOf(`/${matching[0]}`) === 0) {
                return `${base}${matching[1]}/${item.ID}`;
            }
            continue;
        }

        if (item.Url.toLowerCase().indexOf(`/${matching}`) === 0) {
            return `${base}${matching}/${item.ID}`;
        }
    }

    return "https://garlandtools.org/db/#search/" + encodeURI(item.Name);
}