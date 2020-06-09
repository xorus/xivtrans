import React from "react";
import {Result, XivLang} from "../types";
import {garlandLink} from "../garlandLink";

export function ResultItem(props: {
    displayedLangs: XivLang[],
    item: Result
}) {
    return <div className={"result"}>
        <div className="left">
            <a href={garlandLink(props.item)}
               target={"blank"}>
                <img src={`https://xivapi.com/${props.item.Icon}`} alt="" className={"icon"}/>
            </a>
        </div>
        <div className="content" data-id={props.item.ID} data-url={props.item.Url}>
            {props.displayedLangs.map((l) => {
                return <span key={l}>
                        {l.toUpperCase()} {(props.item as any)["Name_" + l]} <br/>
                    </span>;
            })}
        </div>
    </div>;
}