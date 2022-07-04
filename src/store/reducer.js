import { combineReducers } from "redux";

import countReducer from "./count/reducer";
import templateReducer from "./template/reducer";

const rootReducer = combineReducers({
    count: countReducer,
    template: templateReducer
})
export default rootReducer