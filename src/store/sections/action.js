export const UPDATE_SECTION   = 'UPDATE_SECTION';
export const FETCH_SECTION_BEGIN   = 'FETCH_SECTION_BEGIN';
export const FETCH_SECTION_SUCCESS   = 'FETCH_SECTION_SUCCESS';
export const GET_SECTION   = 'GET_SECTION';
export const FETCH_SECTION_FAILURE   = 'FETCH_SECTION_FAILURE';

export const updateSections = items => ({
  type: UPDATE_SECTION,
  payload: { items }
});

export const fetchSectionBegin = () => ({
  type: FETCH_SECTION_BEGIN
});

export const fetchSectionSuccess = items => ({
  type: FETCH_SECTION_SUCCESS,
  payload: { items }
});

export const getSections =  () => ({
    type: GET_SECTION,
});

export const fetchSectionFailure = error => ({
  type: FETCH_SECTION_FAILURE,
  payload: { error }
});

export function updateSection(items) {
  return dispatch => {
    dispatch(updateSections(items));
  };
}


export function getSection() {
    return dispatch => {
        dispatch(getSections());
    };
}


export function fetchSection(url) {
  return dispatch => {
    dispatch(fetchSectionBegin());
    return fetch(url)
      .then(handleErrors)
      .then(res => res.json())
      .then(json => {
        dispatch(fetchSectionSuccess(json.data));
        return json.data;
      })
      .catch(error => dispatch(fetchSectionFailure(error)));
  };
}

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}