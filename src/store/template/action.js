export const UPDATE_TEMPLATE   = 'UPDATE_TEMPLATE';
export const GET_TEMPLATE   = 'GET_TEMPLATE';

export const update = items => ({
  type: UPDATE_TEMPLATE,
  payload: { items }
});

export const get =  () => ({
    type: GET_TEMPLATE,
});

export function updateSidebar(items) {
  return dispatch => {
    dispatch(update(items));
  };
}


export function getSidebar() {
    return dispatch => {
        dispatch(get());
    };
}