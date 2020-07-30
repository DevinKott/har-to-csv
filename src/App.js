import React, { useState } from 'react';
import styled from 'styled-components';
import filesaver from 'file-saver'

import Uploader from './UploaderComponent'
import Filter from './FilterComponent'
import Table from './TableComponent'

function App() {
    const [obj, setObj] = useState(null);
    const [includes, setIncludes] = useState([]);
    const [filter, setFilter] = useState("")

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

    let entries = [];
    if (isValid(obj) && isValid(obj['log'] && isValid(obj['log']['entries']))) {
        entries = obj['log']['entries'];
    }

    if (entries.length > 0 && filter !== '') {
        entries = entries.filter(
            (entry) => {
                return entry['request']['url'].includes(filter);
            }
        );
    }

    
    return (
        <Root>
            <Container>
                <h1>har-to-csv</h1>
                <Uploader setObj={setObj}/>
                <Filter setFilter={setFilter}/>
                <Table entries={entries}/>
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
