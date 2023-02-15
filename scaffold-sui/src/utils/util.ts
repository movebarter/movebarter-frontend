let ReplaceChar = (rawID: string): string => {
    if (rawID == undefined || rawID === "") {
        return "";
    }
    return rawID.slice(0, 4) + "..." + rawID.slice(-4);
}

export {ReplaceChar};