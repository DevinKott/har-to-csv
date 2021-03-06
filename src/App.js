import React, { useState } from 'react';
import styled from 'styled-components';

import Uploader from './UploaderComponent'
import Filter from './FilterComponent'
import Table from './TableComponent'
import Export from './ExportComponent'

import { isValid } from './Utils'

function App() {
    const [obj, setObj] = useState(null);
    const [filter, setFilter] = useState("")

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
                <h3>The HTTP Archive format, or HAR, is a JSON-formatted archive file format for logging of a web browser&apos;s interaction with a site.</h3>
                <h3>The table shown is exported to CSV format with a comma as a delimiter.</h3>
                <h3>Made by Devin Kott.</h3>
                <h5>Version 1.0: Initial (07/29/2020)</h5>
                <Uploader setObj={setObj}/>
                <Filter setFilter={setFilter}/>
                <Export entries={entries}/>
                <Table entries={entries}/>
            </Container>
        </Root>
    );
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
