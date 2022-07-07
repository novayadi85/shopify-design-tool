import { UPDATE_STYLE } from './action';
  
  const initialState = {
    items: [],
    loading: false,
    error: null
  };
  
export default function styleReducer(state = initialState, action) {
    switch(action.type) {
        case UPDATE_STYLE:
        return {
            ...state,
              loading: true,
              error: null,
              items: action.payload.items
            };
      default:
        return state;
    }
  }