import { UPDATE_STYLE } from './action';
  
  const initialState = {
    items: [],
    loading: false,
    error: null
  };
  
export default function styleReducer(state = initialState, action) {
    switch(action.type) {
        case UPDATE_STYLE:
        let items = action.payload.items;
        console.log(action.payload)
        let found = state.items.find(item => item.ID === action.payload.type)
        console.log('found', found)
        if (found) {
          state.items.map(({ ...item }, index) => {
            if (item.ID === action.payload.type) {
              state.items[index]['items'] = items
            }
            
          })
        }

        else {
          state.items.push({
            items,
            ID: action.payload.type
          });
        }

        return {
            ...state,
              loading: true,
              error: null,
            };
      default:
        return state;
    }
  }