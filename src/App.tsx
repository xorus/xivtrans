import React, {useState} from 'react';
import './App.css';

interface Result {
    ID: string,
    Icon: string,
    Url: string,
    Name: string,
    Name_fr: string,
    Name_de: string,
    Name_ja: string,
    Name_en: string
}

type XivLang = "en" | "fr" | "ja" | "de";
const languages: XivLang[] = ["en", "fr", "ja", "de"];

async function runSearch(term: string, lang: XivLang, setter: (value: any) => void) {
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


function App() {
    const [search, setSearch] = useState<string>("");
    const [lang, setLang] = useState<XivLang>("en");
    const [results, setResults] = useState<Result[]>([]);
    const [displayedLangs, setDisplayedLangs] = useState<XivLang[]>(["en", "fr"]);

    return (
        <div className="App">
            {languages.map((l) => {
                return <label key={l}>
                    <input type="checkbox" checked={displayedLangs.includes(l)} onChange={(e) => {
                        if (e.target.checked) {
                            if (!displayedLangs.includes(l)) {
                                setDisplayedLangs([...displayedLangs, l]);
                            }
                        } else {
                            const index = displayedLangs.indexOf(l);
                            if (index >= 0) {
                                const newLangs = [...displayedLangs];
                                newLangs.splice(index, 1);
                                setDisplayedLangs(newLangs);
                            }
                        }
                    }}/>
                    {l.toUpperCase()}
                </label>;
            })}

            <form action="#" onSubmit={async (event) => {
                event.preventDefault();
                const results = await runSearch(search, lang, setResults);
                if (results) {
                    setResults(results);
                }
            }}>
                <input type="search" value={search} onChange={(event) => {
                    setSearch(event.target.value);
                }} autoFocus={true}/>
                <select onChange={(event) => {
                    setLang(event.target.value as XivLang);
                }} value={lang}>
                    {languages.map((itemLang) => (
                        <option key={itemLang}
                                value={itemLang}>
                            {itemLang.toUpperCase()}
                        </option>
                    ))}
                </select>
            </form>
            <div>
                {results.map((result: any) => {
                    return <div key={result.ID}>
                        <strong>{result.name}</strong> <br/>
                        {displayedLangs.map((l) => {
                            return <span key={l}>
                                {l.toUpperCase()} {result["Name_" + l]} <br/>
                            </span>;
                        })}
                    </div>;
                })}
            </div>
        </div>
    );
}

export default App;
