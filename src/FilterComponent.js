import React from 'react'
import styled from 'styled-components'

import isValid from './Utils'

function Filter(props) {
    const defaultChangeFilter = () => {
        console.error(`Filter - no setFilter function found.`);
    }

    const setFilter = isValid(props.setFilter) ? props.setFilter : defaultChangeFilter;

    const onUpdate = (event) => {
        if (!isValid(event)) {
            console.error(`filter onUpdate - event is null/undefined.`);
            return;
        }

        if (!isValid(event.target)) {
            console.error(`filter onUpdate - event target is null/undefined.`);
            return;
        }

        if (!isValid(event.target.value)) {
            console.error(`filter onUpdate - event target value is null/undefined.`);
            return;
        }

        const text = event.target.value;
        if (typeof text === 'string') {
            setFilter(text);
        }
    }

    return (
        <Root>
            <span>URL Filter</span>
            <input type='text' onChange={onUpdate}/>
        </Root>
    );
}

const Root = styled.section`
    display: flex;
    flex-direction: row;

    justify-content: space-between;

    margin-top: 1rem;
`

export default Filter;