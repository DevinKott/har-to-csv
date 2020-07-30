import React from 'react'
import styled from 'styled-components'
import { saveText, isValid } from './Utils';

function Export(props) {
    let entries = props.entries || [];

    const click = () => {
        const rows = [['Status', 'Method', 'Size', 'Time', 'URL'].join(',')]
        entries.forEach(
            entry => {
                const attributes = [];
                
                const req = entry[`request`];
                const res = entry[`response`];

                const time = entry[`time`] || '';
                let status = '';
                let method = '';
                let url = '';
                let size = '';

                if (isValid(res)) {
                    if (isValid(res['status'])) {
                        status = res['status'];
                    }

                    if (isValid(res['bodySize'])) {
                        size = res[`bodySize`];
                    }
                }

                if (isValid(req)) {
                    if (isValid(req['method'])) {
                        method = req['method'];
                    }
                    
                    if (isValid(req['url'])) {
                        url = req['url'];
                    }
                }

                attributes.push(status);
                attributes.push(method);
                attributes.push(size);
                attributes.push(time);
                attributes.push(url);

                rows.push(attributes.join(','));
            }
        );

        const csvStr = rows.join('\n');
        saveText(csvStr, "output.csv");
    }

    return (
        <Root>
            <button onClick={click} disabled={entries.length === 0}>
                Export
            </button>
        </Root>
    );
}

const Root = styled.section`
    display: flex;
    justify-content: center;

    margin-top: 1rem;
`

export default Export;