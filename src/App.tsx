import React, {useEffect, useState} from 'react';
import './App.css';
import 'antd/dist/antd.dark.css';
import {Affix, Checkbox, Col, Input, Layout, Row} from "antd";
import {Result, XivLang} from "./types";
import {LangSelector} from "./component/LangSelector";
import {ResultItem} from "./component/ResultItem";

const languages: XivLang[] = ["en", "fr", "ja", "de"];

async function runSearch(term: string, lang: XivLang) {
    if (term.length === 0) {
        return false;
    }

    console.log("Searching for " + term);

    const query = await fetch("https://xivapi.com/search?language=" + lang +
        "&string=" + encodeURIComponent(term) +
        "&columns=ID,Icon,Url,Name,Name_" + languages.join(',Name_')
    );
    if (!query.ok) {
        return false;
    }
    const results = await query.json();
    return results.Results as Result[];
}

let _savedLangCache: XivLang[] | null = null;

/**
 * Validate possible user input (don't allow an invalid lang)
 */
function getSavedLangs(): XivLang[] {
    if (_savedLangCache !== null) {
        return _savedLangCache;
    }

    const savedDisplayedLangs = JSON.parse(localStorage.getItem("displayedLangs") ?? '["en", "fr"]');
    const displayedLangs: XivLang[] = [];
    savedDisplayedLangs.forEach((item: string) => {
        if ((languages as string[]).includes(item)) {
            displayedLangs.push(item as XivLang);
        }
    })

    return displayedLangs;
}

function App() {
    const [search, setSearch] = useState<string>("");
    const [results, setResults] = useState<Result[]>([]);

    const [displayedLangs, _setDisplayedLangs] = useState<XivLang[]>(getSavedLangs());
    const setDisplayedLangs = (langs: XivLang[]) => {
        localStorage.setItem("displayedLangs", JSON.stringify(langs));
        _setDisplayedLangs(langs);
    }

    let savedLang = localStorage.getItem("lang") ?? "en";
    if (!(languages as string[]).includes(savedLang)) {
        savedLang = "en";
    }
    const [lang, _setLang] = useState<XivLang>(savedLang as XivLang);
    const setLang = (lang: XivLang) => {
        localStorage.setItem("lang", lang);
        _setLang(lang);
    }

    useEffect(() => {
        (async () => {
            const results = await runSearch(search, lang);
            if (results) {
                setResults(results);
            }
        })();
    }, [lang, search]);

    return (
        <Layout>
            <Layout.Content>
                <div className="App">
                    <Affix offsetTop={0}>
                        <div className="search">
                            {languages.map((l) => {
                                return <label key={l}>
                                    <Checkbox checked={displayedLangs.includes(l)} onChange={e => {
                                        let newLangs = [...displayedLangs];
                                        if (e.target.checked) {
                                            if (!displayedLangs.includes(l)) {
                                                newLangs = [...newLangs, l]
                                            }
                                        } else {
                                            const index = displayedLangs.indexOf(l);
                                            if (index >= 0) {
                                                newLangs.splice(index, 1);
                                            }
                                        }
                                        setDisplayedLangs(newLangs);
                                    }}>
                                        {l.toUpperCase()}
                                    </Checkbox>
                                </label>;
                            })}

                            <Input.Group compact>
                                <LangSelector languages={languages} value={lang}
                                              onChange={(value) => setLang(value)}/>
                                <Input.Search size={"large"} onSearch={newValue => {
                                    setSearch(newValue);
                                }} autoFocus={true} style={{width: "80vw"}}/>
                            </Input.Group>
                        </div>
                    </Affix>
                    <Row justify={"center"}>
                        <Col xs={24} sm={20} md={16} lg={10}>
                            <div className={"results"}>
                                {results.map((result: any) => {
                                    return <ResultItem key={result.ID} displayedLangs={displayedLangs} item={result}/>;
                                })}
                            </div>
                        </Col>
                    </Row>
                </div>
            </Layout.Content>
        </Layout>
    );
}

export default App;
