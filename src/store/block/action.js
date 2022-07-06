export const UPDATE_BLOCK   = 'UPDATE_BLOCK';
export const FETCH_BLOCK_BEGIN   = 'FETCH_BLOCK_BEGIN';
export const FETCH_BLOCK_SUCCESS   = 'FETCH_BLOCK_SUCCESS';
export const GET_BLOCK   = 'GET_BLOCK';
export const FETCH_BLOCK_FAILURE   = 'FETCH_BLOCK_FAILURE';

export const updateBlocks = items => ({
  type: UPDATE_BLOCK,
  payload: { items }
});

export const fetchBlockBegin = () => ({
  type: FETCH_BLOCK_BEGIN
});

export const fetchBlockSuccess = items => ({
  type: FETCH_BLOCK_SUCCESS,
  payload: { items }
});

export const getBlocks =  () => ({
    type: GET_BLOCK,
});

export const fetchBlockFailure = error => ({
  type: FETCH_BLOCK_FAILURE,
  payload: { error }
});

export function updateBlock(items) {
  return dispatch => {
    dispatch(updateBlocks(items));
  };
}


export function getBlock() {
    return dispatch => {
        dispatch(getBlocks());
    };
}


export function fetchBlock(url) {
  return dispatch => {
    dispatch(fetchBlockBegin());
    return fetch(url)
      .then(handleErrors)
      .then(res => res.json())
      .then(json => {
        dispatch(fetchBlockSuccess(json.data));
        return json.data;
      })
      .catch(error => dispatch(fetchBlockFailure(error)));
  };
}

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}