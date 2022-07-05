import { combineReducers } from "redux";
import countReducer from "./count/reducer";
import templateReducer from "./template/reducer";
import productReducer from "./product/reducer";

const rootReducer = combineReducers({
    count: countReducer,
    template: templateReducer,
    products: productReducer
})
export default rootReducer