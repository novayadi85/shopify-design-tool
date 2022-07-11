export const UPDATE_STYLE   = 'UPDATE_STYLE';

export const updateStyle = (type, items) => ({
  type: UPDATE_STYLE,
  payload: { type, items }
});


export function updateStyles(type, items) {
    return dispatch => {
        dispatch(updateStyle(type, items));
    };
}

