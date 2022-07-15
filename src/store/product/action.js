import { updateSidebar } from "../template/action";

export const FETCH_PRODUCTS_BEGIN   = 'FETCH_PRODUCTS_BEGIN';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';
export const UPDATE_PAGE = 'UPDATE_PAGE';

export const fetchProductsBegin = () => ({
  type: FETCH_PRODUCTS_BEGIN
});

export const updatePage = page => ({
  type: UPDATE_PAGE,
  payload: { page }
});

export const fetchProductsSuccess = products => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: { products }
});

export const fetchProductsFailure = error => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: { error }
});


export function setPage(id) {
  return dispatch => {
    dispatch(updatePage(id));
  };
};

export function fetchProducts(url) {
  return dispatch => {
    dispatch(fetchProductsBegin());

    return fetch(url)
      .then(handleErrors)
      .then(res => res.json())
      .then(json => {
        dispatch(fetchProductsSuccess(json.data));
        return json.data;
      }).then(data => {
        let sch = data?.template?.schema ?? [];
        if (sch.length >= 3) {
          dispatch(updateSidebar(sch));
        }
       
      })
      .catch(error => dispatch(fetchProductsFailure(error)));
  };
}

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}