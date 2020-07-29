import React, { useState } from 'react';
import styled from 'styled-components';
import filesaver from 'file-saver'

function App() {
    const [obj, setObj] = useState(null);
    const [includes, setIncludes] = useState([]);
    const [filter, setFilter] = useState("")

    const uploadFile = (e) => {
        const file = e.target.files[0];
        if (!isValid(file)) {
            console.error(`Error reading file.`);
            return;
        }

        const reader = new FileReader();
        reader.onload = async (readerE) => {
            const text = readerE.target.result;
            try {
                const jsonObj = JSON.parse(text);
                setObj(jsonObj);
            } catch (exception) {
                console.error(`Exception occurred while reading HAR file.`)
                console.error(exception)
            }
        }

        reader.readAsText(file)
    }

    const buttons = []

    if (isValid(obj)) {
        const log = obj['log'];
        if (isValid(log)) {
            const entries = log['entries'];
            if (isValid(entries)) {
                if (isValid(entries[0])) {
                    const entry = entries[0];
                    for (const key in entry) {
                        if (Object.prototype.hasOwnProperty.call(entry, key)) {
                            if (isNaN(entry[key]) === false || typeof entry[key] === 'string') {
                                buttons.push(`${key}`)
                            }
                        }
                    }
                }
            }
        }
    }
    
    return (
        <Root>
            <Container>
                <h1>har-to-csv</h1>
                <section>
                    <span>Click the following to load a HAR file:</span>
                    <input type="file" accept=".har" onChange={uploadFile}/>
                </section>
                <section>
                    Entries: {isValid(obj) ? `${obj['log']['entries'].length}` : '0'}
                </section>
                <section>
                    URL Filter: <input type='text' onChange={(e) => {
                        if (e.target.value) {
                            setFilter(e.target.value);
                        } else {
                            setFilter("")
                        }
                    }} />
                </section>
                <section>
                    <span>Include in CSV:</span>
                    <div>
                        {
                            buttons.length > 0 &&
                            buttons.map(
                                (button, index) => {
                                    return (
                                        <button key={`key-in-file-${index}`} onClick={
                                            () => {
                                                if (includes.includes(button)) {
                                                    const tempIncludes = []
                                                    includes.filter(b => b !== button).forEach(b => tempIncludes.push(b));
                                                    setIncludes(tempIncludes);
                                                } else {
                                                    const tempIncludes = [button];
                                                    includes.forEach(b => tempIncludes.push(b));
                                                    setIncludes(tempIncludes)
                                                }
                                            }
                                        }>{button}</button>
                                    )
                                }
                            )
                        }
                    </div>
                    <ul>
                        {
                            includes.map(
                                (str, index) => {
                                    return <li key={`include-list-${index}`}>{str}</li>
                                }
                            )
                        }
                    </ul>
                </section>
                <section>
                    <button
                        onClick={
                            () => {
                                if (!isValid(obj) || includes.length <= 0) {
                                    return;
                                }

                                const entries = obj['log']['entries'];
                                if (!isValid(entries)) {
                                    return;
                                }

                                if (entries.length <= 0) {
                                    return;
                                }

                                const rows = []
                                const names = []

                                for (let i = 0; i < includes.length; i++) {
                                    const inc = includes[i];
                                    names.push(inc)
                                }

                                rows.push(names.join(','))

                                let entriesToSearch = entries;
                                if (filter !== '') {
                                    entriesToSearch = entriesToSearch.filter(
                                        (entry) => {
                                            return entry['request']['url'].includes(filter);
                                        }
                                    );
                                }

                                entriesToSearch.forEach(
                                    (entry) => {
                                        const attributes = []

                                        for (let i = 0; i < includes.length; i++) {
                                            const inc = includes[i];
                                            if (Object.prototype.hasOwnProperty.call(entry, inc)) {
                                                const value = entry[inc];
                                                if (typeof value === 'string') {
                                                    attributes.push(`"${value}"`);
                                                } else {
                                                    attributes.push(value);
                                                }
                                            } else {
                                                attributes.push('')
                                            }
                                        }

                                        rows.push(attributes.join(','))
                                    }
                                )

                                const csvStr = rows.join('\n');

                                const blob = new Blob([csvStr], {type: "text/plain;charset=utf-8"});
                                filesaver.saveAs(blob, "output.csv")
                            }
                        }
                    >
                        Export
                    </button>
                </section>
            </Container>
        </Root>
    );
}

const isValid = (obj) => {
    return obj !== undefined && obj !== null;
}

const Container = styled.main`
  width: 100%;
  max-width: 640px;

  padding: 1rem;
`;

const Root = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
`;

export default App;
