export const UPDATE_STYLE = 'UPDATE_STYLE';
export const REPLACE_ITEMS = 'REPLACE_ITEMS';

export const updateStyle = (type, items) => ({
  type: UPDATE_STYLE,
  payload: { type, items }
});


export function updateStyles(type, items) {
    return dispatch => {
        dispatch(updateStyle(type, items));
    };
}

export const replaceStyle = ( items) => ({
  type: REPLACE_ITEMS,
  payload: { items }
});


export function replaceCSS(items) {
    return dispatch => {
        dispatch(replaceStyle(items));
    };
}

