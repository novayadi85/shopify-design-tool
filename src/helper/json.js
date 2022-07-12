export function parseJSON(value) {
    let result;
    try {
        result = JSON.parse(value);
    } catch(e) {
        result = value
    }

    return result;
}