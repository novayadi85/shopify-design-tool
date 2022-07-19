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

export const addBlock = (section, items) => ({
  type: ADD_BLOCK,
  payload: { section, items }
});

export const editBlock = (block, items) => ({
  type: UPDATE_BLOCK,
  payload: { block, setting: items }
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

