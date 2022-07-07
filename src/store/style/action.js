export const UPDATE_STYLE   = 'UPDATE_STYLE';

export const updateStyle = items => ({
  type: UPDATE_STYLE,
  payload: { items }
});


export function updateStyles(items) {
    return dispatch => {
        dispatch(updateStyle(items));
    };
}

