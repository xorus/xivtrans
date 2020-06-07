import {XivLang} from "../types";
import {Select} from "antd";
import React from "react";

export function LangSelector(props: {
    languages: XivLang[],
    value: XivLang,
    onChange: (lang: XivLang) => void
}) {
    return <Select size={"large"} onChange={(value) => {
        props.onChange(value as XivLang);
    }} defaultValue={props.value}>
        {props.languages.map((itemLang) => (
            <Select.Option key={itemLang} value={itemLang}>
                {itemLang.toUpperCase()}
            </Select.Option>
        ))}
    </Select>;
}