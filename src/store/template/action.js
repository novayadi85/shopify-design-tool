export const UPDATE_TEMPLATE   = 'UPDATE_TEMPLATE';
export const GET_TEMPLATE   = 'GET_TEMPLATE';
export const ADD_TEMPLATE   = 'ADD_TEMPLATE';
export const ADD_BLOCK = 'ADD_BLOCK';

export const update = items => ({
  type: UPDATE_TEMPLATE,
  payload: { items }
});

export const add = items => ({
  type: ADD_TEMPLATE,
  payload: { items }
});

export const addBlock = (section, items) => ({
  type: ADD_BLOCK,
  payload: { section, items }
});

export const get =  () => ({
    type: GET_TEMPLATE,
});

export function updateSidebar(items) {
  return dispatch => {
    dispatch(update(items));
  };
}

export function addSidebar(items) {
  return dispatch => {
    dispatch(add(items));
  };
}

export function addNewBlock(section, items) {
  return dispatch => {
    dispatch(addBlock(section, items));
  };
}

export function getSidebar() {
    return dispatch => {
        dispatch(get());
    };
}