import { updateSidebar, updateTemplate } from "../template/action";
import { replaceCSS, replaceMobileCSS } from "../style/action";

export const FETCH_PRODUCTS_BEGIN   = 'FETCH_PRODUCTS_BEGIN';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';
export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_LIQUID = 'UPDATE_LIQUID';
export const UPDATE_TEMPLATE_ID = 'UPDATE_TEMPLATE_ID';

export const fetchProductsBegin = () => ({
  type: FETCH_PRODUCTS_BEGIN
});

export const updatePage = page => ({
  type: UPDATE_PAGE,
  payload: { page }
});

export const updateLiquid = liquid => ({
  type: UPDATE_LIQUID,
  payload: { liquid }
});

export const updateTemplateId = (templateId, type, canAddBlock, canAddSection, format) => ({
  type: UPDATE_TEMPLATE_ID,
  payload: { templateId, type, canAddBlock, canAddSection, format}
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

export function setLiquid(liquid) {
  return dispatch => {
    dispatch(updateLiquid(liquid));
  };
};

export function setTemplateId(id, type, canAddBlock, canAddSection, fromat) {
  return dispatch => {
    dispatch(updateTemplateId(id, type, canAddBlock, canAddSection, fromat));
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
        let canAddBlock = data?.template?.canAddBlock ?? true;
        let settings = data?.template?.setting ?? null;
        let canAddSection = data?.template?.canAddSection ?? true;
        let type = data?.template?.brickname ?? [];
        let templateId = data?.templateId ?? [];
        let cssStyles = data?.cssStyles ?? [];
        let mobileStyles = data?.mobileStyles ?? [];
        let storeFormat = data?.store ?? [];
        let liquidCode = data?.template?.liquid ?? [];

        localStorage.setItem('store', storeFormat ? JSON.stringify(storeFormat) : [])
        
        
        if (sch.length >= 1) {
          dispatch(updateSidebar(sch));
        }

        if (settings) {
          dispatch(updateTemplate(settings));
        }

        if (liquidCode.length > 0) {
          // dispatch(updateLiquid(liquidCode));
        }

        if (templateId.length > 0) {
           dispatch(setTemplateId(templateId, type, canAddBlock , canAddSection, storeFormat));
        }

        if (cssStyles.length > 0) {
          dispatch(replaceCSS(cssStyles));
        }

        if (mobileStyles.length >= 0) {
          dispatch(replaceMobileCSS(mobileStyles));
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