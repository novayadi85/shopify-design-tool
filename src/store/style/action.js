export const UPDATE_STYLE = 'UPDATE_STYLE';
export const REPLACE_ITEMS = 'REPLACE_ITEMS';
export const REPLACE_MOBILE_ITEMS = 'REPLACE_MOBILE_ITEMS';
export const SET_MODE = 'SET_MODE';
export const CSS_EDITOR = 'CSS_EDITOR';
export const GET_ACTIVE_STYLE = 'GET_ACTIVE_STYLE';

export const updateStyle = (type, items) => ({
  type: UPDATE_STYLE,
  payload: { type, items }
});

export const fetchStyles = () => ({
  type: GET_ACTIVE_STYLE
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

export const _setCssEditor = ( values) => ({
  type: CSS_EDITOR,
  payload: { values }
});

export const _setMode = ( mode ) => ({
  type: SET_MODE,
  payload: { mode }
});

export const _replaceMobileCSS = ( items) => ({
  type: REPLACE_MOBILE_ITEMS,
  payload: { items }
});


export function replaceCSS(items) {
    return dispatch => {
        dispatch(replaceStyle(items));
    };
}

export function replaceMobileCSS(items) {
  return dispatch => {
      dispatch(_replaceMobileCSS(items));
  };
}


export function setCssEditor(values) {
  return dispatch => {
      dispatch(_setCssEditor(values));
  };
}

export function setMode(mode) {
  return dispatch => {
      dispatch(_setMode(mode));
  };
}

