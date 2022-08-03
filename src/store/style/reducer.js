import { UPDATE_STYLE, REPLACE_ITEMS, CSS_EDITOR, SET_MODE, GET_ACTIVE_STYLE, REPLACE_MOBILE_ITEMS} from './action';
export const DESKTOP = 'DESKTOP';
export const MOBILE = 'MOBILE';

const initialState = {
    items: [],
    mobile: [],
    loading: false,
    error: null,
    mode: 'DESKTOP'
  };
  
export default function styleReducer(state = initialState, action) {
    switch(action.type) {
        case UPDATE_STYLE:
        let items = action.payload.items;
        let found = state.items.find(item => item.ID === action.payload.type)

		if (state.mode === MOBILE) {
			items = action.payload.items;
			found = state.mobile.find(item => item.ID === action.payload.type)

			if (found) {
				state.mobile.map(({ ...item }, index) => {
				  if (item.ID === action.payload.type) {
					state.mobile[index]['items'] = items
				  }
				  return item
				})
			  }
			  else {
				state.mobile.push({
				  items: items,
				  ID: action.payload.type
				});
			}
			
		}
		else {
			if (found) {
				state.items.map(({ ...item }, index) => {
				  if (item.ID === action.payload.type) {
					state.items[index]['items'] = items
				  }
				  return item
				})
			} else {
				state.items.push({
				  items,
				  ID: action.payload.type
				});
			}
		}	
        

        return {
            ...state,
              loading: true,
              error: null,
        };
      
      	case REPLACE_ITEMS:
          // Mark the state as "loading" so we can show a spinner or something
          // Also, reset any errors. We're starting fresh.
          return {
          ...state,
            loading: false,
            error: null,
            items: action.payload.items
		  };
		
		case REPLACE_MOBILE_ITEMS:
			// Mark the state as "loading" so we can show a spinner or something
			// Also, reset any errors. We're starting fresh.
			return {
			...state,
			  loading: false,
			  error: null,
			  mobile: action.payload.items
		};
      
        case CSS_EDITOR:
          return {
            ...state,
              loading: true,
            error: null,
            editor: action.payload.values
          };
      
      case SET_MODE:
            return {
              ...state,
                loading: true,
              error: null,
              mode: action.payload.mode
            };
      
      case GET_ACTIVE_STYLE:
        return {
          ...state
      };
      
      default:
        return state;
    }
  }