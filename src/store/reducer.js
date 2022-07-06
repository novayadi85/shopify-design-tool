import { combineReducers } from "redux";
import countReducer from "./count/reducer";
import templateReducer from "./template/reducer";
import productReducer from "./product/reducer";
import sectionReducer from "./sections/reducer";

const rootReducer = combineReducers({
    count: countReducer,
    template: templateReducer,
    products: productReducer,
    sections: sectionReducer
})
export default rootReducer