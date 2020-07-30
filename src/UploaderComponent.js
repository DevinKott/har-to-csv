import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isValid } from './Utils'

function Uploader(props) {
    const defaultSetObj = () => {
        console.error(`Uploader - no setObj function found.`);
    }

    const setObj = isValid(props.setObj) ? props.setObj : defaultSetObj;

    const uploadFile = (event) => {
        if (!isValid(event)) {
            console.error(`uploadFile - event was null/undefined.`);
            return;
        }

        if (!isValid(event.target)) {
            console.error(`uploadFile - event target was null/undefined.`);
            return;
        }

        if (!isValid(event.target.files)) {
            console.error(`uploadFile - event target files was null/undefined.`);
            return;
        }

        const files = event.target.files;
        if (files.length <= 0) {
            console.error(`uploadFile - no files were uploaded.`);
            return;
        }

        const file = files[0];
        if (!isValid(file)) {
            console.error(`uploadFile - file is null/undefined.`);
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = async (reader) => {
            if (!isValid(reader)) {
                console.error(`uploadFile - file reader return value was null/undefined.`);
                return;
            }

            if (!isValid(reader.target)) {
                console.error(`uploadFile - fileReader target was null/undefined.`);
                return;
            }

            const text = reader.target.result;
            if (!isValid(text)) {
                console.error(`uploadFile - text read from file reader is null/undefined.`);
                return;
            }

            try {
                const json = JSON.parse(text);
                setObj(json);
            } catch (exception) {
                console.error(`uploadFile - the string to parse is not valid JSON.`);
                console.error(exception);
                return;
            }
        }

        fileReader.readAsText(file);
    }

    return (
        <Root>
            <span>Click the following to load a HAR file: </span>
            <input type="file" accept=".har" onChange={uploadFile}/>
        </Root>
    );
}

const Root = styled.section`
    display: flex;
    flex-direction: row;

    justify-content: space-between;
    margin-top: 1rem;
`
Uploader.propTypes = {
    setObj: PropTypes.func
}

export default Uploader;