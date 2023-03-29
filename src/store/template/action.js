export const UPDATE_TEMPLATE   = 'UPDATE_TEMPLATE';
export const GET_TEMPLATE   = 'GET_TEMPLATE';
export const ADD_TEMPLATE   = 'ADD_TEMPLATE';
export const ADD_BLOCK = 'ADD_BLOCK';
export const UPDATE_BLOCK = 'UPDATE_BLOCK';
export const UPDATE_LIQUID = 'UPDATE_LIQUID';

export const update = items => ({
  type: UPDATE_TEMPLATE,
  payload: { items }
});

export const add = items => ({
  type: ADD_TEMPLATE,
  payload: { items }
});

export const addBlock = (section, items, handle) => ({
  type: ADD_BLOCK,
  payload: { section, items , handle}
});

export const editBlock = (block, items, handle) => ({
  type: UPDATE_BLOCK,
  payload: { block, setting: items , handle}
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

export function addNewBlock(section, items, handle) {
  return dispatch => {
    dispatch(addBlock(section, items, handle));
  };
}

export function updateBlock(block, items) {
  //console.log(items)
  return dispatch => {
    dispatch(editBlock(block, items));
  };
}

export function getSidebar() {
    return dispatch => {
        dispatch(get());
    };
}

