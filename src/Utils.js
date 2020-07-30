import filesaver from 'file-saver'

export function isValid(obj) {
    return obj !== null && obj !== undefined;
}

export function saveText(text, file) {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    filesaver.saveAs(blob, file)
}