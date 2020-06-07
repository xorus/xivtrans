import React from "react";
import {Result, XivLang} from "../types";

export function ResultItem(props: {
    displayedLangs: XivLang[],
    item: Result
}) {
    return <div className={"result"}>
        <div className="left">
            <img src={`https://xivapi.com/${props.item.Icon}`} alt="" className={"icon"}/>
        </div>
        <div className="content">
            {props.displayedLangs.map((l) => {
                return <span key={l}>
                        {l.toUpperCase()} {(props.item as any)["Name_" + l]} <br/>
                    </span>;
            })}
        </div>
    </div>;
}